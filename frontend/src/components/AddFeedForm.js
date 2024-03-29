import React, { useState, useEffect } from 'react';
import axios from 'axios';

const apiBaseUrl = 'http://127.0.0.1:8000';

const AddFeedForm = ({ isOpen, onClose, onFeedAdded }) => {
  const [cameraOptions, setCameraOptions] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [areaCovered, setAreaCovered] = useState('');
  const [url, setUrl] = useState('');
  const [featureList, setFeatureList] = useState('');
  const [feedType, setFeedType] = useState('');
  const [modelName, setModelName] = useState('yolov8n.pt');
  const [classesToCount, setClassesToCount] = useState('[0]');
  const [saveFrames, setSaveFrames] = useState('1000');
  const [trackLength, setTrackLength] = useState('100');
  const [bufferSize, setBufferSize] = useState('0');
  const [targetWidth, setTargetWidth] = useState('1024');
  const [targetHeight, setTargetHeight] = useState('576');
  const [trackConfidence, setTrackConfidence] = useState('0.15');

  useEffect(() => {
    // Fetch camera options from the backend
    const fetchCameraOptions = async () => {
      const response = await axios.get(`${apiBaseUrl}/getCameraIds`);
      setCameraOptions(response.data);
      console.log(response.data);
      console.log("CameraOptions:",cameraOptions);
    };
    fetchCameraOptions();
  }, []);

  useEffect(() => {
    // Reset the form fields when the form is about to be opened
    if (isOpen) {
      resetFormFields();
    }
  }, [isOpen]);

  const resetFormFields = () => {
    setSelectedCamera('');
    setName('');
    setLocation('');
    setAreaCovered('');
    setUrl('');
    setFeatureList('');
    setFeedType('');
    setModelName('yolov8n.pt');
    setClassesToCount('0');
    setSaveFrames('1000');
    setTrackLength('100');
    setBufferSize('0');
    setTargetWidth('1024');
    setTargetHeight('576');
    setTrackConfidence('0.15');
  };
  const handleAddFeed = async () => {
    try {
      const cameraId = selectedCamera;
      const model_name = modelName;
      const classes_to_count = classesToCount;
      const save_frames = saveFrames;
      const track_length = trackLength;
      const buffer_size = bufferSize;
      const target_width = targetWidth;
      const target_height = targetHeight;
      const track_confidence = trackConfidence;

      const config = JSON.stringify({model_name, classes_to_count, save_frames, track_length, buffer_size, target_width, target_height, track_confidence});

      await axios.post(`${apiBaseUrl}/addFeed`, {
        cameraId,
        name,
        location,
        areaCovered,
        url,
        featureList,
        feedType,
        config,
      });
      onClose();
      onFeedAdded();
      // Refresh the feeds table
    } catch (error) {
      console.error('Error adding feed:', error);
    }
  };

  return (
    <div
      className={`modal ${isOpen ? 'show' : ''}`}
      style={{
        display: isOpen ? 'block' : 'none',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'auto',
        zIndex: 1050,
      }}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        style={{
          maxWidth: '600px',
          margin: '1.75rem auto',
        }}
      >
        <div className="modal-content" style={{ boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.15)' }}>
          <div className="modal-header">
            <h5 className="modal-title">Add Feed</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="camera" className="form-label">
                  Camera:
                </label>
                <select
                  className="form-control"
                  id="camera"
                  value={selectedCamera}
                  onChange={(e) => setSelectedCamera(e.target.value)}
                  required
                >
                  <option value="">Select a camera</option>
                  {cameraOptions.map((camera) => (
                    <option key={camera} value={camera}>
                      {camera}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col">
                <label htmlFor="name" className="form-label">
                  Name:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="location" className="form-label">
                  Location:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
              <div className="col">
                <label htmlFor="areaCovered" className="form-label">
                  Area Covered:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="areaCovered"
                  value={areaCovered}
                  onChange={(e) => setAreaCovered(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="url" className="form-label">
                  URL:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
              </div>
              <div className="col">
                <label htmlFor="featureList" className="form-label">
                  Feature List:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="featureList"
                  value={featureList}
                  onChange={(e) => setFeatureList(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="feedType" className="form-label">
                  Feed Type:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="feedType"
                  value={feedType}
                  onChange={(e) => setFeedType(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="modelName" className="form-label">
                  Model Name:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="modelName"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  required
                />
              </div>
              <div className="col">
                <label htmlFor="classesToCount" className="form-label">
                  Classes to Count:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="classesToCount"
                  value={classesToCount}
                  onChange={(e) => setClassesToCount(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="saveFrames" className="form-label">
                  Save Frames:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="saveFrames"
                  value={saveFrames}
                  onChange={(e) => setSaveFrames(e.target.value)}
                  required
                />
              </div>
              <div className="col">
                <label htmlFor="trackLength" className="form-label">
                  Track Length:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="trackLength"
                  value={trackLength}
                  onChange={(e) => setTrackLength(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="bufferSize" className="form-label">
                  Buffer Size:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="bufferSize"
                  value={bufferSize}
                  onChange={(e) => setBufferSize(e.target.value)}
                  required
                />
              </div>
              <div className="col">
                <label htmlFor="targetWidth" className="form-label">
                  Target Width:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="targetWidth"
                  value={targetWidth}
                  onChange={(e) => setTargetWidth(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="targetHeight" className="form-label">
                  Target Height:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="targetHeight"
                  value={targetHeight}
                  onChange={(e) => setTargetHeight(e.target.value)}
                  required
                />
              </div>
              <div className="col">
                <label htmlFor="trackConfidence" className="form-label">
                  Track Confidence:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="trackConfidence"
                  value={trackConfidence}
                  onChange={(e) => setTrackConfidence(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={handleAddFeed}>
              Add Feed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFeedForm;