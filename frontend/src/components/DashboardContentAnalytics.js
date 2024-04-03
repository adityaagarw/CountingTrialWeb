import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Chart from 'chart.js/auto';
import AnalyticsPopupForm from './AnalyticsPopupForm';

const DashboardContentAnalytics = () => {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [chartData, setChartData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [allChartData, setAllChartData] = useState([]);

  

  const handleFormSubmit = async (apiEndpoint, formData) => {
    try {
      const response = await fetch('http://127.0.0.1:8000' + apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from_datetime: formData.fromDate,
          to_datetime: formData.toDate,
          feed_id: formData.feedId,
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
    allChartData.forEach((chartData, index) => {
      // Separate entry and exit data
      const entryData = chartData.filter(data => data.attribute === 'entry');
      const exitData = chartData.filter(data => data.attribute === 'exit');
  
      // Combine entry and exit data for chart labels
      const labels = [...new Set([...entryData.map(item => item.date), ...exitData.map(item => item.date)])].sort();
        
      const ctx = document.getElementById(`myChart${index}`);
      if (ctx) {
        new Chart(ctx, {
          type: 'line',
          data: {
            labels,
            datasets: [
              {
                label: 'Entry',
                data: labels.map(label => entryData.find(item => item.date === label)?.count || 0),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
              },
              {
                label: 'Exit',
                data: labels.map(label => exitData.find(item => item.date === label)?.count || 0),
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1,
              },
            ],
          },
        });
      }
    });
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

      {allChartData.map((data, index) => (
  <div className="row mt-3" key={index}>
    <div className="col-lg-3 col-md-6" style={{ width: '45%' }}>
      <div className="card">
        <div className="card-header">Chart {index + 1}</div>
        <div className="card-body">
          <canvas id={`myChart${index}`} width="400" height="200"></canvas>
        </div>
      </div>
    </div>
  </div>
))}

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

export default DashboardContentAnalytics;
