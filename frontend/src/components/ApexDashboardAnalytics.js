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
        console.log('Request Body:', {
            from_datetime: formData.fromDate,
            to_datetime: formData.toDate,
            feed_id: formData.feedId,
            chart_type: formData.chartType,
          });

      const response = await fetch('http://127.0.0.1:8000' + apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from_datetime: formData.fromDate,
          to_datetime: formData.toDate,
          feed_id: formData.feedId,
          chart_type: formData.chartType,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const jsonData = await response.json();
      setAllChartData(prevData => [...prevData, jsonData]);
      setShowPopup(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const newChartData = [];
  
    allChartData.forEach((chartData, index) => {
      const chartType = chartData?.chart_type || 'line';
        

      // Separate entry and exit data
      const entryData = chartData.filter(data => data.attribute === 'entry');
      const exitData = chartData.filter(data => data.attribute === 'exit');
  
      // Combine entry and exit data for chart labels
      const labels = [...new Set([...entryData.map(item => item.date), ...exitData.map(item => item.date)])].sort();
  
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
        },
      };

      console.log('Options:', options);
  
      const series = [
        {
          name: 'Entry',
          data: labels.map(label => entryData.find(item => item.date === label)?.count || 0),
        },
        {
          name: 'Exit',
          data: labels.map(label => exitData.find(item => item.date === label)?.count || 0),
        },
      ];
  
      newChartData.push({ options, series });
    });
  
    setChartData(newChartData);
  }, [allChartData]);

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
                <Chart options={data.options} series={data.series} type="line" height={350} />
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