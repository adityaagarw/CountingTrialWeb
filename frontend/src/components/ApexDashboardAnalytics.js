import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Chart from 'react-apexcharts';
import AnalyticsPopupForm from './AnalyticsPopupForm';

const ApexDashboardAnalytics = () => {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [chartData, setChartData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [allChartData, setAllChartData] = useState([]);
  const [key, setKey] = useState(0); // Unique key to force remount

  // Load chart data from localStorage on component mount
  useEffect(() => {
    const storedChartData = localStorage.getItem('chartData');
    if (storedChartData) {
      setAllChartData(JSON.parse(storedChartData));
      console.log("Fetched Chart Data: ", JSON.parse(storedChartData));
    }
  }, []); // Key added to dependencies

  // Save chartData to localStorage when it changes
  // useEffect(() => {
  //   localStorage.setItem('chartData', JSON.stringify(chartData));
  // }, [chartData]);

  const handleFormSubmit = async (apiEndpoint, formData) => {
    try {
      console.log('Form data:', formData);
      let requestBody = null;
      if(formData.apiDesc === 'Entry/Exit Count'){
        requestBody =
          JSON.stringify({
            from_datetime: formData.fromDate,
            to_datetime: formData.toDate,
            feed_id: formData.feedId,
            sections: formData.sections,
          })
        };

       if(formData.apiDesc === 'Sales vs Footfall'){
        requestBody =
          JSON.stringify({
            from_datetime: formData.fromDate,
            to_datetime: formData.toDate,
            feed_id: formData.feedId,
            sections: formData.sections,
            detail_level: formData.detailLevel
          })
       }; 
      console.log('requestBody: ', requestBody);
    
      const response = await fetch('http://127.0.0.1:8000' + apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      });
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const jsonData = await response.json();
      // jsonData.chart_type = formData.chartType;
      // jsonData.api_desc = formData.apiDesc;
      // jsonData.feed_id = formData.feedId;
      const detailedJsonData = Object.assign({}, jsonData,  {
        metaData: {chart_type: formData.chartType,
        api_desc: formData.apiDesc,
        feed_id: formData.feedId
      }});

      const newAllChartData = [...allChartData, detailedJsonData];
      localStorage.setItem('chartData', JSON.stringify(newAllChartData));

      setAllChartData(newAllChartData);
      setShowPopup(false);
      setKey(prevKey => prevKey + 1); // Increment key to force remount
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const entryExitChartData = (graphData, metaData) => 
  {
      const chartType = metaData?.chart_type || 'line';
      const apiDesc = metaData.api_desc;
      const feedId = metaData.feed_id;

      console.log('Meta Data: ', metaData);

      const graphDataArray = Object.values(graphData);
      console.log('Graph Data: ', graphDataArray)
      

      const sectionIds = [...new Set(graphDataArray.map(item => item.section_id))];
      const labels = [...new Set(graphDataArray.map(item => item.date))].sort();

      console.log ('Labels: ', labels);
      const options = {
        chart: {
          type: 'bar',
          height: 350,
        },
        plotOptions: {
          bar: {
            horizontal: false
          }
        },
        xaxis: {
          categories: labels,
          type: 'datetime',
          tickAmount: getTickAmount(labels),
          tickFormatter: (value) => getTickFormatter(value, labels),
        },
        yaxis: {
          title: {
            text: 'Count'
          }
        },
        title: {
          text: 'Feed: ' + feedId + '\t' + apiDesc,
          align: 'left'
        },
      };

      const series = sectionIds.map(sectionId => {
        const entryData = graphDataArray.filter(data => data.attribute === 'entry' && data.section_id === sectionId);
        const exitData = graphDataArray.filter(data => data.attribute === 'exit' && data.section_id === sectionId);

        return [
          {
            name: `Entry - Section ${sectionId}`,
            data: labels.map(label => entryData.find(item => item.date === label)?.count || 0),
          },
          {
            name: `Exit - Section ${sectionId}`,
            data: labels.map(label => exitData.find(item => item.date === label)?.count || 0),
          },
        ];
      }).flat();

    return {
        'options': options, 
        'series': series, 
        'chartType': chartType};
  }

  const salesVsFootfallChartData = (graphData, metaData) => 
  {
      const chartType = 'line'; //metaData?.chart_type || 'line';
      const apiDesc = metaData.api_desc;
      const feedId = metaData.feed_id;


      console.log('Meta Data: ', metaData);

      const graphDataArray = Object.values(graphData);
      console.log('Graph Data: ', graphDataArray)
      
      
    const dates = [...new Set(graphDataArray.map(item => item.time))].sort();
    const footfallCount = graphDataArray.map(item => item.footfall_count);
    const totalSales = graphDataArray.map(item => item.tot_sales);
    const totalQuantity = graphDataArray.map(item => item.tot_qty);
    const totalInvoices = graphDataArray.map(item => item.tot_invoices);
    console.log('Dates: ', dates)
    console.log('Footfall Count', footfallCount)
    const options = {
      chart: {
        type: 'line',
        height: 350
      },
      title: {
        text: 'Feed: ' + feedId + '\t' + apiDesc,
        align: 'left'
      },
      xaxis: {
            categories: dates,
            type: 'datetime',
            labels:
            {
              datetimeFormatter:
              {
                year: 'YYYY',
                month: 'MMM \'yy',
                day: 'dd MMM',
                hour: 'HH:mm'
              }
            }
          },
        yaxis: [
          {
          title: {
            text: '',
            },
          },
          {
            opposite: true,
            title: {
              text: '',
            },
          },
        ],
        dataLabels: {
          enabled: true,
          enabledOnSeries: [0,1,2,3]
          },
    };

    const series = [
      {
        name: 'Footfall Count',
        type: 'bar',
        data: footfallCount
      },
      {
        name: 'Total Sales',
        type: 'line',
        data: totalSales
      },
      {
        name: 'Total Quantity',
        type: 'line',
        data: totalQuantity
      },
      {
        name: 'Total Invoices',
        type: 'line',
        data: totalInvoices
      }
    ];
    return {
        'options': options, 
        'series': series, 
        'chartType': chartType};
  }

  useEffect(() => {
    const newChartData = [];

    console.log(chartData);
    allChartData.forEach((chartData) => {
      const { metaData, ...graphData } = chartData;
      
      if(metaData.api_desc === 'Entry/Exit Count') chartData = entryExitChartData(graphData, metaData);
      if(metaData.api_desc === 'Sales vs Footfall') chartData = salesVsFootfallChartData(graphData, metaData);
      
      console.log('chartData: ', chartData);
     
      const options = chartData.options;
      const series = chartData.series;
      const chartType = chartData.chartType;
      newChartData.push({options, series, chartType});
      console.log('newChartData: ', newChartData);
    });

    setChartData(newChartData);
  }, [allChartData]);

  const getTickAmount = (labels) => {
    const dayDiff = (new Date(labels[labels.length - 1]) - new Date(labels[0])) / (1000 * 60 * 60 * 24);

    if (dayDiff < 7) {
      return 24; // Show hourly data
    } else if (dayDiff < 31) {
      return 7; // Show daily data
    } else {
      return 12; // Show monthly data
    }
  };

  const getTickFormatter = (value, labels) => {
    const date = new Date(value);

    if ((new Date(labels[labels.length - 1]) - new Date(labels[0])) / (1000 * 60 * 60 * 24) < 7) {
      return `${date.getHours()}:00`;
    } else if ((new Date(labels[labels.length - 1]) - new Date(labels[0])) / (1000 * 60 * 60 * 24) < 31) {
      return `${date.getDate()}/${date.getMonth() + 1}`;
    } else {
      return `${date.getMonth() + 1}/${date.getFullYear()}`;
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-header">Add Analytics</div>
            <div className="card-body">
              <button
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#analyticsPopup"
              >
                Add New Analytics
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-3">
        {chartData.map((data, index) => (
          <div className="col-lg-6 col-md-6" key={index}>
            <div className="card">
              <div className="card-header">Chart {index + 1}</div>
              <div className="card-body">
                <Chart options={data.options} series={data.series} type={data.chartType} height={350}/>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Popup form */}
      <div className="modal fade" id="analyticsPopup" tabIndex="-1" aria-labelledby="analyticsPopupLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="analyticsPopupLabel">Select API</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <AnalyticsPopupForm onFormSubmit={handleFormSubmit} />
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop for modal */}
      {showPopup && <div className="modal-backdrop fade show" onClick={() => setShowPopup(false)}></div>}
    </div>
  );
};

export default ApexDashboardAnalytics;
