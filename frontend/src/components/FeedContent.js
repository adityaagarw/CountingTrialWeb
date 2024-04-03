import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddFeedForm from './AddFeedForm';
import RegionSelectorPage from './RegionSelectorPage';
import { useNavigate } from 'react-router-dom';
const apiBaseUrl = 'http://127.0.0.1:8000';

const FeedContent = () => {
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [isRegionSelectorOpen, setIsRegionSelectorOpen] = useState(false);
  const [showAddFeedForm, setShowAddFeedForm] = useState(false);
  const [feeds, setFeeds] = useState([]);
  const [feedStartStopStatus, setFeedStartStopStatus] = useState({});
  const navigate = useNavigate();

  const [videoSources, setVideoSources] = useState({});

  useEffect(() => {
    // Fetch feed data when the component mounts
    fetchFeedData();
  }, []);

  const fetchFeedData = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/feed/get-feeds`);
      console.log('Feed data:', response.data);
      setFeeds(response.data);

      // Initialize the feedStartStopStatus object
      const initialStatus = {};
      response.data.forEach((feed) => {
        initialStatus[feed.id] = 'stopped';
      });
      setFeedStartStopStatus(initialStatus);
    } catch (error) {
      console.error('Error fetching feed data:', error);
    }
  };

  const handleOpenAddFeedForm = () => {
    setShowAddFeedForm(true);
  };

  const handleCloseAddFeedForm = () => {
    setShowAddFeedForm(false);
  };

  const handleFeedAdded = () => {
    // Refresh the feed data after a new feed is added
    fetchFeedData();
  };

  const handleFeedDelete = async (feedId) => {
    try {
      await axios.delete(`${apiBaseUrl}/feed/delete-feed/${feedId}`);
      // Refresh the feed data after a feed is deleted
      fetchFeedData();
    } catch (error) {
      console.error('Error deleting feed:', error);
    }
  };

  const handleFeedStartStop = async (feedId) => {
    try {
      if (feedStartStopStatus[feedId] === 'started') {
        await axios.post(`${apiBaseUrl}/feed/stop-feed/${feedId}`);
        setFeedStartStopStatus((prevStatus) => ({
          ...prevStatus,
          [feedId]: 'stopped',
        }));
        setVideoSources((prevSources) => ({
          ...prevSources,
          [feedId]: '', // Set the video source URL to an empty string when stopping
        }));
      } else {
        await axios.post(`${apiBaseUrl}/feed/start-feed/${feedId}`);
        setFeedStartStopStatus((prevStatus) => ({
          ...prevStatus,
          [feedId]: 'started',
        }));
        setVideoSources((prevSources) => ({
          ...prevSources,
          [feedId]: `${apiBaseUrl}/feed/view-feed/${feedId}`, // Set the video source URL when starting
        }));
      }
    } catch (error) {
      console.error('Error starting/stopping feed:', error);
    }
  };

  const handleAddRegion = (feed) => {
    navigate(`/region-selector/${feed.id}`);
    //setSelectedFeed(feed);
    //setIsRegionSelectorOpen(true);
  };
  
  const handleRegionSave = () => {
    // Refresh feed data
    setIsRegionSelectorOpen(false);
  };
  
  const handleRegionSelectorClose = () => {
    setIsRegionSelectorOpen(false);
  };

  return (
    <div className="container-fluid">
      <div className="d-sm-flex justify-content-between align-items-center mb-4">
        <h3 className="text-dark mb-0">Feed Table</h3>
        <button
          className="btn btn-primary btn-sm d-none d-sm-inline-block"
          role="button"
          onClick={handleOpenAddFeedForm}
        >
          <i className="fas fa-eye fa-sm text-white-50" />&nbsp;Add feeds
        </button>
      </div>

      <AddFeedForm isOpen={showAddFeedForm} onClose={handleCloseAddFeedForm} onFeedAdded={handleFeedAdded} />

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Feed</th>
              <th>Camera</th>
              <th>Name</th>
              <th>Location</th>
              <th>Sections</th>
              <th>Area covered</th>
              <th>URL</th>
              <th>Feature List</th>
              <th>Feed Type</th>
              <th>Add Region</th>
              <th>Start/Stop</th>
              <th>Delete</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {feeds.map((feed) => (
              <tr key={feed.id}>
                <td>{feed.id}</td>
                <td>{feed.camera_id}</td>
                <td>{feed.name}</td>
                <td>{feed.location}</td>
                <td>{feed.sections}</td>
                <td>{feed.area_covered}</td>
                <td>{feed.url}</td>
                <td>{feed.feature_list}</td>
                <td>{feed.feed_type}</td>
                <td>
                  <button className="btn btn-primary btn-sm text-center" type="button" onClick={() => handleAddRegion(feed)}>
                    Add region
                  </button>
                </td>
                <td>
                  <button
                    className={`btn btn-${feedStartStopStatus[feed.id] === 'started' ? 'warning' : 'success'} btn-sm`}
                    onClick={() => handleFeedStartStop(feed.id)}
                  >
                    {feedStartStopStatus[feed.id] === 'started' ? 'Stop' : 'Start'}
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleFeedDelete(feed.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr />

      <div className="d-sm-flex justify-content-between align-items-center mb-4">
        <div className="container-fluid">
          <div className="d-sm-flex justify-content-between align-items-center mb-4">
            <h3 className="text-dark mb-0">Live Feeds</h3>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
        {feeds.map((feed) => (
          <div key={feed.id} className="col">
            <video width="260" height="200" controls autoPlay>
              <source src={videoSources[feed.id]} type="video/webm" />
              <track kind="subtitles" />
            </video>
          </div>
        ))}
        </div>
        <div className="row">
          <div className="col">
            <video width="260" height="200" controls></video>
          </div>
        </div>
      </div>
      {isRegionSelectorOpen && (
        <RegionSelectorPage
          feedId={selectedFeed.id}
          onSave={handleRegionSave}
          onClose={handleRegionSelectorClose} 
        />
      )}
    </div>
  );
};

export default FeedContent;