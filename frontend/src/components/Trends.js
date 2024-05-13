import { FaArrowUp, FaArrowDown, FaUserFriends, FaRupeeSign } from 'react-icons/fa';
import './Trends.css';
import axios from 'axios';

import React, { useState, useEffect } from 'react';

const apiBaseUrl = 'http://127.0.0.1:8000';

const Trends = () => {
  const [footfallData, setFootfallData] = useState({
    monthly: { current: 0, previous: 0 },
    weekly: { current: 0, previous: 0 },
    daily: { current: 0, previous: 0 },
    hourly: { current: 0, previous: 0 },
  });

  const [salesData, setSalesData] = useState({
    monthly: { current: 0, previous: 0 },
    weekly: { current: 0, previous: 0 },
    daily: { current: 0, previous: 0 },
    hourly: { current: 0, previous: 0 },
  });

  const [showPercentage, setShowPercentage] = useState(true);

  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/analytics/trend-data`);
        const data = response.data;
  
        setFootfallData({
          monthly: data.monthly,
          weekly: data.weekly,
          daily: data.daily,
          hourly: data.hourly,
        });
  
        setSalesData({
          monthly: data.monthly,
          weekly: data.weekly,
          daily: data.daily,
          hourly: data.hourly,
        });
      } catch (error) {
        console.error('Error fetching trend data:', error);
      }
    };
  
    fetchTrendData();
  }, []);

  const renderTrend = (current, previous, showPercentage) => {
    const diff = current - previous;
    const percentageDiff = previous === 0 ? diff : diff === 0 ? 0 : ((diff / previous) * 100).toFixed(2);
    const trendValue = showPercentage ? `${percentageDiff}%` : Math.abs(diff);
    const trendIcon = diff > 0 ? <FaArrowUp className="text-success" /> : <FaArrowDown className="text-danger" />;
    const trendClass = diff > 0 ? 'bg-success text-white' : 'bg-danger text-green';
    return (    
        <div className="trend-container">
        <div className="trend-icon-container">
          {trendIcon}
        </div>
        <span className={`badge rounded-pill ${trendClass}`}>
          {trendValue}
        </span>
      </div>
    );
  };

  const handleToggle = () => {
    setShowPercentage(prevState => !prevState);
  };

  return (
    <div className="container-fluid">
      <h1 className="text-center my-4">Trends</h1>
      <div className="row mb-4">
        <div className="col-1 icon-col">
          <FaUserFriends className="text-muted" size={36} />
          <h5 className="mt-2">Footfall</h5>
        </div>
        <div className="col">
          <div className="card card-trend">
            <div className="card-body">
              <h5 className="card-title">Monthly</h5>
              <p className="card-text trend-value" onClick={handleToggle}>
                {footfallData.monthly.current} visitors {renderTrend(footfallData.monthly.current, footfallData.monthly.previous, showPercentage)}
              </p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card card-trend">
            <div className="card-body">
              <h5 className="card-title">Weekly</h5>
              <p className="card-text trend-value" onClick={handleToggle}>
                {footfallData.weekly.current} visitors {renderTrend(footfallData.weekly.current, footfallData.weekly.previous, showPercentage)}
              </p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card card-trend">
            <div className="card-body">
              <h5 className="card-title">Daily</h5>
              <p className="card-text trend-value" onClick={handleToggle}>
                {footfallData.daily.current} visitors {renderTrend(footfallData.daily.current, footfallData.daily.previous, showPercentage)}
              </p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card card-trend">
            <div className="card-body">
              <h5 className="card-title">Hourly</h5>
              <p className="card-text trend-value" onClick={handleToggle}>
                {footfallData.hourly.current} visitors {renderTrend(footfallData.hourly.current, footfallData.hourly.previous, showPercentage)}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-1 icon-col">
          <FaRupeeSign className="text-muted" size={36} />
          <h5 className="mt-2">Sales</h5>
        </div>
        <div className="col">
          <div className="card card-trend">
            <div className="card-body">
              <h5 className="card-title">Monthly</h5>
              <p className="card-text trend-value" onClick={handleToggle}>
                <FaRupeeSign /> {salesData.monthly.current} {renderTrend(salesData.monthly.current, salesData.monthly.previous, showPercentage)}
              </p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card card-trend">
            <div className="card-body">
              <h5 className="card-title">Weekly</h5>
              <p className="card-text trend-value" onClick={handleToggle}>
                <FaRupeeSign /> {salesData.weekly.current} {renderTrend(salesData.weekly.current, salesData.weekly.previous, showPercentage)}
              </p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card card-trend">
            <div className="card-body">
              <h5 className="card-title">Daily</h5>
              <p className="card-text trend-value" onClick={handleToggle}>
                <FaRupeeSign /> {salesData.daily.current} {renderTrend(salesData.daily.current, salesData.daily.previous, showPercentage)}
              </p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card card-trend">
            <div className="card-body">
              <h5 className="card-title">Hourly</h5>
              <p className="card-text trend-value" onClick={handleToggle}>
                <FaRupeeSign /> {salesData.hourly.current} {renderTrend(salesData.hourly.current, salesData.hourly.previous, showPercentage)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trends;
