import { FaArrowUp, FaArrowDown, FaUserFriends, FaRupeeSign } from 'react-icons/fa';
import './Trends.css';
import axios from 'axios';

import React, { useState, useEffect } from 'react';
import { backendUrl } from '../config';

const apiBaseUrl = backendUrl;

const Trends = () => {
  const [footfallData, setFootfallData] = useState({
    monthly_footfall: { current: 0, previous: 0 },
    weekly_footfall: { current: 0, previous: 0 },
    daily_footfall: { current: 0, previous: 0 },
    hourly_footfall: { current: 0, previous: 0 },
  });

  const [salesData, setSalesData] = useState({
    monthly_sales: { current: 0, previous: 0 },
    weekly_sales: { current: 0, previous: 0 },
    daily_sales: { current: 0, previous: 0 },
    hourly_sales: { current: 0, previous: 0 },
  });

  const [showPercentage, setShowPercentage] = useState(true);

  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/analytics/trend-data`);
        const data = response.data;
        
        console.log(data)

        setFootfallData({
          monthly_footfall: data.monthly_footfall,
          weekly_footfall: data.weekly_footfall,
          daily_footfall: data.daily_footfall,
          hourly_footfall: data.hourly_footfall,
        });
  
        setSalesData({
          monthly_sales: data.monthly_sales,
          weekly_sales: data.weekly_sales,
          daily_sales: data.daily_sales,
          hourly_sales: data.hourly_sales,
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
                {footfallData.monthly_footfall.current} visitors {renderTrend(footfallData.monthly_footfall.current, footfallData.monthly_footfall.previous, showPercentage)}
              </p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card card-trend">
            <div className="card-body">
              <h5 className="card-title">Weekly</h5>
              <p className="card-text trend-value" onClick={handleToggle}>
                {footfallData.weekly_footfall.current} visitors {renderTrend(footfallData.weekly_footfall.current, footfallData.weekly_footfall.previous, showPercentage)}
              </p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card card-trend">
            <div className="card-body">
              <h5 className="card-title">Daily</h5>
              <p className="card-text trend-value" onClick={handleToggle}>
                {footfallData.daily_footfall.current} visitors {renderTrend(footfallData.daily_footfall.current, footfallData.daily_footfall.previous, showPercentage)}
              </p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card card-trend">
            <div className="card-body">
              <h5 className="card-title">Hourly</h5>
              <p className="card-text trend-value" onClick={handleToggle}>
                {footfallData.hourly_footfall.current} visitors {renderTrend(footfallData.hourly_footfall.current, footfallData.hourly_footfall.previous, showPercentage)}
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
                <FaRupeeSign /> {salesData.monthly_sales.current} {renderTrend(salesData.monthly_sales.current, salesData.monthly_sales.previous, showPercentage)}
              </p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card card-trend">
            <div className="card-body">
              <h5 className="card-title">Weekly</h5>
              <p className="card-text trend-value" onClick={handleToggle}>
                <FaRupeeSign /> {salesData.weekly_sales.current} {renderTrend(salesData.weekly_sales.current, salesData.weekly_sales.previous, showPercentage)}
              </p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card card-trend">
            <div className="card-body">
              <h5 className="card-title">Daily</h5>
              <p className="card-text trend-value" onClick={handleToggle}>
                <FaRupeeSign /> {salesData.daily_sales.current} {renderTrend(salesData.daily_sales.current, salesData.daily_sales.previous, showPercentage)}
              </p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card card-trend">
            <div className="card-body">
              <h5 className="card-title">Hourly</h5>
              <p className="card-text trend-value" onClick={handleToggle}>
                <FaRupeeSign /> {salesData.hourly_sales.current} {renderTrend(salesData.hourly_sales.current, salesData.hourly_sales.previous, showPercentage)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trends;
