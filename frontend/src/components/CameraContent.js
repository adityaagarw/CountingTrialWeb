import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddCameraForm from './AddCameraForm';

const apiBaseUrl = 'http://127.0.0.1:8000';

const CameraContent = () => {
  const [showAddCameraForm, setShowAddCameraForm] = useState(false);
  const [cameras, setCameras] = useState([]);

  useEffect(() => {
    // Fetch camera data when the component mounts
    fetchCameraData();
  }, []);

  const fetchCameraData = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/getCameras`);
      console.log('Camera data:', response.data);
      setCameras(response.data);
    } catch (error) {
      console.error('Error fetching camera data:', error);
    }
  };

  const handleOpenAddCameraForm = () => {
    setShowAddCameraForm(true);
  };

  const handleCloseAddCameraForm = () => {
    setShowAddCameraForm(false);
  };

  const handleCameraAdded = () => {
    // Refresh the camera data after a new camera is added
    fetchCameraData();
  };

  const handleCameraDelete = async (camera_id) => {
    try {
      await axios.delete(`${apiBaseUrl}/deleteCamera/${camera_id}`);
      // Refresh the camera data after a camera is deleted
      fetchCameraData();
    } catch (error) {
      console.error('Error deleting camera:', error);
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-sm-flex justify-content-between align-items-center mb-4">
        <h3 className="text-dark mb-0">Cameras</h3>
        <button
          className="btn btn-primary btn-sm d-none d-sm-inline-block"
          role="button"
          onClick={handleOpenAddCameraForm}
        >
          <i className="fas fa-eye fa-sm text-white-50" />&nbsp;Add cameras
        </button>
      </div>

      <AddCameraForm isOpen={showAddCameraForm} onClose={handleCloseAddCameraForm} onCameraAdded={handleCameraAdded} />

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Camera</th>
              <th>Type</th>
              <th>Resolution</th>
              <th>FPS</th>
              <th>Focal length</th>
              <th>Hardware Address</th>
              <th>Protocols</th>
              <th>Make</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {cameras.map((camera) => (
              <tr key={camera.id}>
                <td>{camera.id}</td>
                <td>{camera.camera_type}</td>
                <td>{camera.resolution}</td>
                <td>{camera.fps}</td>
                <td>{camera.focal_length}</td>
                <td>{camera.mac}</td>
                <td>{camera.protocols}</td>
                <td>{camera.make_model}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleCameraDelete(camera.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CameraContent;
