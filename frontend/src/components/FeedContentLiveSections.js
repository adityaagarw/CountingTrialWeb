import React, { useState, useEffect, useRef } from 'react';
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

  const [activeFeedContainers, setActiveFeedContainers] = useState([]);
  const webSocketRef = useRef(null);

  // Establish WebSocket connection only once when the component mounts
  useEffect(() => {
    const webSocket = new WebSocket(`ws://127.0.0.1:8000/ws`);
    webSocketRef.current = webSocket;

    webSocket.onopen = () => {
      console.log('WebSocket connected');
    };

    webSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.message) {
        const messageData = JSON.parse(data.message);
        console.log('WebSocket message JSON:', messageData.uuid);
        handleWebSocketMessage(messageData);
      }
    };

    webSocket.onerror = (event) => {
      console.error('WebSocket error:', event);
    };

    webSocket.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      // Attempt to reconnect after a delay
      setTimeout(() => {
        webSocketRef.current = null;
      }, 5000);
    };

    // Clean up WebSocket on component unmount
    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close();
      }
    };
  }, []); // Empty dependency array ensures this effect runs only once

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

  const handleWebSocketMessage = (messageData) => {
    if (messageData.attribute === 'entry' && messageData.feed_id > 0 && messageData.section_id > 0) {
      console.log('Updating entry count for feed:', messageData.feed_id, 'section:', messageData.section_id);
      setActiveFeedContainers((prevContainers) =>
        prevContainers.map((container) =>
          container.feedId === messageData.feed_id && container.sectionId === messageData.section_id
            ? { ...container, entryCount: (container.entryCount || 0) + 1 }
            : container
        )
      );
    } else if (messageData.attribute === 'exit' && messageData.feed_id > 0 && messageData.section_id > 0) {
      console.log('Updating exit count for feed:', messageData.feed_id, 'section:', messageData.section_id);
      setActiveFeedContainers((prevContainers) =>
        prevContainers.map((container) =>
          container.feedId === messageData.feed_id && container.sectionId === messageData.section_id
            ? { ...container, exitCount: (container.exitCount || 0) + 1 }
            : container
        )
      );
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
        setActiveFeedContainers((prevContainers) =>
          prevContainers.filter((container) => container.feedId !== feedId)
        );
      } else {
        await axios.post(`${apiBaseUrl}/feed/start-feed/${feedId}`);
        setFeedStartStopStatus((prevStatus) => ({
          ...prevStatus,
          [feedId]: 'started',
        }));

        // Fetch the sections for the feed
        const response = await axios.get(`${apiBaseUrl}/feed/get-sections/${feedId}`);
        const sections = response.data;

        setActiveFeedContainers((prevContainers) => [
          ...prevContainers,
          ...sections.map((section) => ({
            feedId,
            sectionId: section.id,
            //videoSource: `${apiBaseUrl}/feed/view-feed/${feedId}/${section.id}`,
            entryCount: 0,
            exitCount: 0,
          })),
        ]);
      }
    } catch (error) {
      console.error('Error starting/stopping feed:', error);
    }
  };

  const handleAddRegion = (feed) => {
    navigate(`/region-selector/${feed.id}`);
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

      {activeFeedContainers.length > 0 && (
  <div className="container-fluid">
    {Array.from(
      new Map(activeFeedContainers.map((container) => [`feed-${container.feedId}`, container]))
    ).map(([key, containers]) => (
      <div key={key}>
        {Array.isArray(containers) && containers.length > 0 && (
          <h3>Feed ID: {containers[0].feedId}</h3>
        )}
        <div className="row">
          {Array.isArray(containers) ? (
            containers.map((container) => (
              <div className="col" key={`${container.feedId}-${container.sectionId}`}>
                <h5>Section ID: {container.sectionId}</h5>
                <video width="260" height="200" controls autoPlay>
                  <source src={container.videoSource} type="video/webm" />
                  <track kind="subtitles" />
                </video>
                <div className="row">
                  <div className="col">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">Entry Count</h5>
                        <p className="card-text">{container.entryCount || 0}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">Exit Count</h5>
                        <p className="card-text">{container.exitCount || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>No sections available</div>
          )}
        </div>
      </div>
    ))}
  </div>
)}

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