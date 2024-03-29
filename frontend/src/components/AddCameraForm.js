import React, { useState, useEffect } from 'react';
import axios from 'axios';

const apiBaseUrl = 'http://127.0.0.1:8000';

const AddCameraForm = ({ isOpen, onClose, onCameraAdded }) => {
  const [cameraUrlId, setCameraUrlId] = useState('');
  const [cameraType, setCameraType] = useState('');
  const [resolution, setResolution] = useState('');
  const [fps, setFps] = useState('');
  const [focalLength, setFocalLength] = useState('');
  const [mac, setMac] = useState('');
  const [protocols, setProtocols] = useState('');
  const [uid, setUid] = useState('');
  const [pwd, setPwd] = useState('');
  const [port, setPort] = useState('');
  const [makeModel, setMakeModel] = useState('');
  const [formError, setFormError] = useState(false);

  useEffect(() => {
    // Reset the form fields when the component mounts
    resetFormFields();
  }, []);

  useEffect(() => {
    // Reset the form fields when the form is about to be opened
    if (isOpen) {
      resetFormFields();
    }
  }, [isOpen]);

  const resetFormFields = () => {
    setCameraUrlId('');
    setCameraType('');
    setResolution('');
    setFps('');
    setFocalLength('');
    setMac('');
    setProtocols('');
    setUid('');
    setPwd('');
    setPort('');
    setMakeModel('');
    setFormError(false);
  };

  useEffect(() => {
    // Reset the form fields when the component mounts
    resetFormFields();
  }, []);

  useEffect(() => {
    // Reset the form fields when the form is about to be opened
    if (isOpen) {
      resetFormFields();
    }
  }, [isOpen]);

  const handleAddCamera = async () => {
    try {
      await axios.post(`${apiBaseUrl}/addCamera`, {
        cameraUrlId,
        cameraType,
        resolution,
        fps,
        focalLength,
        mac,
        protocols,
        uid,
        pwd,
        port,
        makeModel,
      });
      onClose();
      onCameraAdded();
      // Refresh the cameras table
    } catch (error) {
      setFormError(true);
      console.error('Error adding camera:', error);
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
            <h5 className="modal-title">Add Camera</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="cameraUrlId" className="form-label">
                  Camera URL ID:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="cameraUrlId"
                  value={cameraUrlId}
                  onChange={(e) => setCameraUrlId(e.target.value)}
                  required
                />
              </div>
              <div className="col">
                <label htmlFor="cameraType" className="form-label">
                  Camera Type:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="cameraType"
                  value={cameraType}
                  onChange={(e) => setCameraType(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="resolution" className="form-label">
                  Resolution:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="resolution"
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  required
                />
              </div>
              <div className="col">
                <label htmlFor="fps" className="form-label">
                  FPS:
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="fps"
                  value={fps}
                  onChange={(e) => setFps(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="focalLength" className="form-label">
                  Focal Length:
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="focalLength"
                  value={focalLength}
                  onChange={(e) => setFocalLength(e.target.value)}
                  required
                />
              </div>
              <div className="col">
                <label htmlFor="mac" className="form-label">
                  MAC Address:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="mac"
                  value={mac}
                  onChange={(e) => setMac(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="protocols" className="form-label">
                  Protocols:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="protocols"
                  value={protocols}
                  onChange={(e) => setProtocols(e.target.value)}
                  required
                />
              </div>
              <div className="col">
                <label htmlFor="uid" className="form-label">
                  UserID:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="uid"
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="pwd" className="form-label">
                  Password:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="pwd"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  required
                />
              </div>
              <div className="col">
                <label htmlFor="port" className="form-label">
                  Port:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="port"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="makeModel" className="form-label">
                  Make & Model:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="makeModel"
                  value={makeModel}
                  onChange={(e) => setMakeModel(e.target.value)}
                  required
                />
              </div>
            </div>
            {formError && (
              <div className="alert alert-danger" role="alert">
                Please fill in all the required fields.
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={handleAddCamera}>
              Add Camera
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCameraForm;