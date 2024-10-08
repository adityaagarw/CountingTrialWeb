import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AddFeedForm from './AddFeedForm';
import RegionSelectorPage from './RegionSelectorPage';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import { backendUrl, notificationWebSocketUrl, streamWebSocketUrl, webSocketBaseUrl } from '../config';

const apiBaseUrl = backendUrl;

const FeedContent = () => {
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [isRegionSelectorOpen, setIsRegionSelectorOpen] = useState(false);
  const [showAddFeedForm, setShowAddFeedForm] = useState(false);
  const [feeds, setFeeds] = useState([]);
  const [feedStartStopStatus, setFeedStartStopStatus] = useState({});
  const navigate = useNavigate();
  const [activeFeedContainers, setActiveFeedContainers] = useState([]);
  const webSocketRef = useRef(null);
  const streamSocketRef = useRef(null);
  const [streamSocket, setStreamSocket] = useState(null);
  const [receivedImageData, setReceivedImageData] = useState(null);

  const fetchFeedStatus = async (feedId) => {
    try {
      const response = await axios.get(`${apiBaseUrl}/feed/get-feed-status/${feedId}`);
      console.log('Feed status:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching feed status:', error);
      return 'stopped';
    }
  };

  const fetchFeedSections = async (feedId) => {
    try {
      const response = await axios.get(`${apiBaseUrl}/feed/get-sections/${feedId}`);
      console.log('Feed sections:', response.data);
      return response.data;  // Return the sections
    } catch (error) {
      console.error('Error fetching feed sections:', error);
      return [];  // Return an empty array in case of error
    }
  };

  // Establish WebSocket connection only once when the component mounts
  useEffect(() => {
    const webSocket = new WebSocket(notificationWebSocketUrl);
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

  // Effect to establish the /stream WebSocket connection
  useEffect(() => {
    const socket = new WebSocket(streamWebSocketUrl);
    setStreamSocket(socket);
    streamSocketRef.current = streamSocket;

    socket.onopen = () => {
      console.log('Streamsocket connected');
    };

    socket.onmessage = (event) => {
      const data = event.data;
      if (data.image) {
        const imageData = data.image;
        const binaryData = Uint8Array.from(atob(imageData), (c) => c.charCodeAt(0));
        const blob = new Blob([binaryData], { type: 'image/jpeg' });
        const imageUrl = URL.createObjectURL(blob);
        setReceivedImageData(imageUrl);
      }
    };

    // ... (Other event handlers for /stream socket)
    socket.onclose = (event) => {
      console.log('StreamSocket disconnected:', event.code, event.reason);
      // Attempt to reconnect after a delay
      setTimeout(() => {
        streamSocketRef.current = null;
      }, 5000);
    };

    return () => {
      if (streamSocketRef.current) {
        streamSocketRef.current.close();
      }
    };
  }, []);

  const fetchFeedData = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/feed/get-feeds`);
      console.log('Feed data:', response.data);

      // Initialize the feedStartStopStatus object
      const initialStatus = {};
      for (const feed of response.data) {
        const status = await fetchFeedStatus(feed.id);
        initialStatus[feed.id] = status;
      }
      setFeedStartStopStatus(initialStatus);

      // Check if a container already exists for each feed
      const existingFeedIds = activeFeedContainers.map(container => container.feedId);
      const newFeedIds = response.data.filter(
        feed => !existingFeedIds.includes(feed.id)
      ).map(feed => feed.id);

      // Create a container for each new feed
      await Promise.all(newFeedIds.map(createNewContainerForFeed));

      setFeeds(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching feed data:', error);
    }
  };

  const createNewContainerForFeed = async (feedId) => {
    // Fetch the sections for this feed
    const existingContainer = activeFeedContainers.find(container => container.feedId === feedId);
    if (existingContainer) {
      console.log('Container already exists for feed:', feedId);
      return;
    }

    const sections = await fetchFeedSections(feedId);

    // Create a container for the feed with sections
    const newContainer = {
      feedId,
      videoSource: '', // Set the video source URL for the feed
      sections: sections.map(sectionId => ({
        sectionId,
        entryCount: 0,
        exitCount: 0,
      })),
    };

    setActiveFeedContainers(prevContainers => [...prevContainers, newContainer]);
  };

  const handleWebSocketMessage = (messageData) => {
    const { feed_id: feedId, section_id: sectionId, attribute, count } = messageData;

    if (attribute === 'entry' && feedId > 0) {
      console.log('Updating entry count for feed:', feedId, 'and section:', sectionId);
      setActiveFeedContainers(prevContainers =>
        prevContainers.map(container =>
          container.feedId === feedId
            ? {
                ...container,
                sections: container.sections.map(section =>
                  section.sectionId === sectionId
                  ? { ...section, entryCount: (section.entryCount || 0) + 1, highlighted: true, highlightType: 'entry' }
                    : section
                ),
              }
            : container
        )
      );
      setTimeout(() => {
        setActiveFeedContainers((prevContainers) =>
          prevContainers.map((container) =>
            container.feedId === feedId
              ? {
                  ...container,
                  sections: container.sections.map((section) =>
                    section.sectionId === sectionId
                      ? { ...section, highlighted: false }
                      : section
                  ),
                }
              : container
          )
        );
      }, 400); // Duration in milliseconds
    } else if (attribute === 'exit' && feedId > 0) {
      console.log('Updating exit count for feed:', feedId, 'and section:', sectionId);
      setActiveFeedContainers(prevContainers =>
        prevContainers.map(container =>
          container.feedId === feedId
            ? {
                ...container,
                sections: container.sections.map(section =>
                  section.sectionId === sectionId
                  ? { ...section, exitCount: (section.exitCount || 0) + 1, highlighted: true, highlightType: 'exit' }
                    : section
                ),
              }
            : container
        )
      );
      // Set timeout to reset highlighted flag after 3 seconds (adjust the duration as needed)
    setTimeout(() => {
      setActiveFeedContainers((prevContainers) =>
        prevContainers.map((container) =>
          container.feedId === feedId
            ? {
                ...container,
                sections: container.sections.map((section) =>
                  section.sectionId === sectionId
                    ? { ...section, highlighted: false }
                    : section
                ),
              }
            : container
        )
      );
    }, 400); // Duration in milliseconds
    }
  };

  const handleOpenAddFeedForm = () => {
    setShowAddFeedForm(true);
  };

  const handleCloseAddFeedForm = () => {
    setShowAddFeedForm(false);
  };

  const handleFeedAdded = async () => {
    await fetchFeedData();
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
    const sections = await fetchFeedSections(feedId);
    const status = feedStartStopStatus[feedId];

    if (sections.length === 0) {
      alert('No regions exist for this feed. Please add regions before starting the feed.');
      return;
    }

    if (status === 'started') {
      const response = await axios.post(`${apiBaseUrl}/feed/stop-feed/${feedId}`);
      if (response.data === 'success') {
        setFeedStartStopStatus(prevStatus => ({
          ...prevStatus,
          [feedId]: 'stopped',
        }));
      }
      setActiveFeedContainers(prevContainers =>
        prevContainers.filter(container => container.feedId !== feedId)
      );
    } else {
      const response = await axios.post(`${apiBaseUrl}/feed/start-feed/${feedId}`);
      if (response.data === 'success') {
        setFeedStartStopStatus(prevStatus => ({
         ...prevStatus,
         [feedId]: 'started',
        }));
      }
    }
  };

  const handleAddRegion = (feed) => {
    setSelectedFeed(feed);
    setIsRegionSelectorOpen(true);
  };

  const handleRegionSave = () => {
    setIsRegionSelectorOpen(false);
    fetchFeedData();
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
      {receivedImageData && (
  <div>
    <h4>Received Image</h4>
    <img src={receivedImageData} alt="Received" />
    {console.log('Rendering received image:', receivedImageData)}
  </div>
)}
          {activeFeedContainers.map((container) => (
            <div className="row" key={container.feedId}>
              <div className="col">
                <h5>Feed: {container.feedId}</h5>
                <video width="260" height="200" controls autoPlay>
                  <source src={container.videoSource} type="video/webm" />
                  <track kind="subtitles" />
                </video>
              </div>
              {container.sections.map((section) => (
                <React.Fragment key={section.sectionId}>
                  <div className="col">
                    <h5 className="card-title">Section : {section.sectionId}</h5>
                    <div className={`card ${section.highlighted && section.highlightType === 'entry' ? 'green-shadow' : ''} ${section.highlighted && section.highlightType === 'exit' ? 'red-shadow' : ''}`}>
                      <div className="card-body">
                        <p className="card-text">Entry: {section.entryCount || 0}</p>
                        <p className="card-text">Exit: {section.exitCount || 0}</p>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              ))}
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
