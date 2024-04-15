import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

const AnalyticsPopupForm = ({ onFormSubmit }) => {
  const [feedId, setFeedId] = useState('');
  const [sections, setSections] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [chartType, setChartType] = useState('line');
  const [apiType, setApiType] = useState('');

  useEffect(() => {
    const fetchSections = async () => {
      if (feedId) {
        try {
          const response = await axios.get(`http://localhost:8000/feed/get-sections/${feedId}`);
          setSections(response.data);
        } catch (error) {
          console.error('Error fetching sections:', error);
        }
      }
    };
    fetchSections();
  }, [feedId]);

  const handleSectionChange = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
    setSelectedSections(selectedOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let apiEndpoint, apiDesc;
    if (apiType === 'api1') {
      apiEndpoint = `/analytics/feed-attribute-count`;
      apiDesc = 'Entry/Exit Count';
    } else if (apiType === 'api2') {
      apiEndpoint = `/analytics/detection-summary/${feedId}`;
      apiDesc = 'API2';
    }
    const formData = {
      feedId,
      sections: selectedSections,
      fromDate: fromDate.toISOString(),
      toDate: toDate.toISOString(),
      chartType,
      apiType,
      apiDesc,
    };
    onFormSubmit(apiEndpoint, formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="feedId" className="form-label">Feed ID</label>
        <input type="text" className="form-control" id="feedId" value={feedId} onChange={(e) => setFeedId(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label htmlFor="sections" className="form-label">Sections</label>
        <select id="sections" className="form-control" multiple value={selectedSections} onChange={handleSectionChange}>
          {/*To be fixed*/}
          {sections.map((section) => (
            <option key={section.id} value={section.id}>
              {section.id} {section} {section.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="fromDate" className="form-label">From Date</label>
        <br />
        <DatePicker selected={fromDate} onChange={date => setFromDate(date)} dateFormat="dd-MM-yyyy" className="form-control" />
      </div>
      <div className="mb-3">
        <label htmlFor="toDate" className="form-label">To Date</label>
        <br />
        <DatePicker selected={toDate} onChange={date => setToDate(date)} dateFormat="dd-MM-yyyy" className="form-control" />
      </div>
      <div className="mb-3">
        <label htmlFor="chartType" className="form-label">Chart Type</label>
        <select id="chartType" className="form-select" value={chartType} onChange={(e) => setChartType(e.target.value)}>
          <option value="line">Line Chart</option>
          <option value="bar">Bar Chart</option>
          {/* Add more chart types as needed */}
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="apiType" className="form-label">API Type</label>
        <select id="apiType" className="form-select" value={apiType} onChange={(e) => setApiType(e.target.value, e.target.textContent)} required>
          <option value="">Select API Type</option>
          <option value="api1">Entry/Exit Count</option>
          <option value="api2">API 2</option>
          {/* Add more API types as needed */}
        </select>
      </div>
      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
  );
};

export default AnalyticsPopupForm;