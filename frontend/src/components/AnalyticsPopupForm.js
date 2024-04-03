import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AnalyticsPopupForm = ({ onFormSubmit }) => {
  const [feedId, setFeedId] = useState('');
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [chartType, setChartType] = useState('line');
  const [apiType, setApiType] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    let apiEndpoint;
    if (apiType === 'api1') {
      apiEndpoint = `/analytics/feed-attribute-count`;
    } else if (apiType === 'api2') {
      apiEndpoint = `/analytics/detection-summary/${feedId}`;
    }
    const formData = {
      feedId,
      fromDate: fromDate.toISOString(),
      toDate: toDate.toISOString(),
      chartType,
      apiType,
    };
    onFormSubmit(apiEndpoint, formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="feedId" className="form-label">Feed ID</label>
        <input
          type="text"
          className="form-control"
          id="feedId"
          value={feedId}
          onChange={(e) => setFeedId(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="fromDate" className="form-label">From Date</label>
        <br />
        <DatePicker
          selected={fromDate}
          onChange={date => setFromDate(date)}
          dateFormat="dd-MM-yyyy"
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="toDate" className="form-label">To Date</label>
        <br />
        <DatePicker
          selected={toDate}
          onChange={date => setToDate(date)}
          dateFormat="dd-MM-yyyy"
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="chartType" className="form-label">Chart Type</label>
        <select
          id="chartType"
          className="form-select"
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
        >
          <option value="line">Line Chart</option>
          <option value="bar">Bar Chart</option>
          {/* Add more chart types as needed */}
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="apiType" className="form-label">API Type</label>
        <select
          id="apiType"
          className="form-select"
          value={apiType}
          onChange={(e) => setApiType(e.target.value)}
          required
        >
          <option value="">Select API Type</option>
          <option value="api1">API 1</option>
          <option value="api2">API 2</option>
          {/* Add more API types as needed */}
        </select>
      </div>
      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
  );
};

export default AnalyticsPopupForm;
