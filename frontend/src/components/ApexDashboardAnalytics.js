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

  const handleFormSubmit = async (apiEndpoint, formData) => {
    try {
      console.log('Form data:', formData);
      const response = await fetch('http://127.0.0.1:8000' + apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from_datetime: formData.fromDate,
          to_datetime: formData.toDate,
          feed_id: formData.feedId,
          //section_id = formData.sections,
          sections: formData.sections,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const jsonData = await response.json();
      //add chart_type to json data
      jsonData.chart_type = formData.chartType;
      jsonData.api_desc = formData.apiDesc;
      jsonData.feed_id = formData.feedId;
      

      console.log(jsonData)
      setAllChartData(prevData => [...prevData, jsonData]);
      setShowPopup(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const newChartData = [];
  
    allChartData.forEach((chartData) => {
      const chartType = chartData?.chart_type || 'line';
      const apiDesc = chartData.api_desc
      const feedId = chartData.feed_id
        

      // Separate entry and exit data
      // const entryData = chartData.filter(data => data.attribute === 'entry');
      // const exitData = chartData.filter(data => data.attribute === 'exit');
      
      const sectionIds = [...new Set(chartData.map(item => item.section_id))];
      // Combine entry and exit data for chart labels
      //const labels = [...new Set([...entryData.map(item => item.date), ...exitData.map(item => item.date)])].sort();
      const labels = [...new Set(chartData.map(item => item.date))].sort();
  
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
  
    //   const series = [
    //     {
    //       name: 'Entry',
    //       data: labels.map(label => entryData.find(item => item.date === label)?.count || 0),
    //     },
    //     {
    //       name: 'Exit',
    //       data: labels.map(label => exitData.find(item => item.date === label)?.count || 0),
    //     },
    //   ];
  
    //   newChartData.push({ options, series, chartType });
    // });
  
          // Create separate series for each section
          const series = sectionIds.map(sectionId => {  // Modified this line
            // Separate entry and exit data for each section
            const entryData = chartData.filter(data => data.attribute === 'entry' && data.section_id === sectionId);  // Modified this line
            const exitData = chartData.filter(data => data.attribute === 'exit' && data.section_id === sectionId);  // Modified this line
            
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
          }).flat();  // Added this line
      
          newChartData.push({ options, series, chartType });
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