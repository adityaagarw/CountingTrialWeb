import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

const ReportForm = ({ isOpen, onClose }) => {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());

  const handleExportToExcel = async () => {
    try {
      const response = await axios.get('/api/export_to_excel', {
        params: {
          from: fromDate.toISOString(),
          to: toDate.toISOString(),
        },
      });

      // Download the file from the backend
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'report.xlsx');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error exporting to Excel:', error);
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
          maxWidth: '500px',
          margin: '1.75rem auto',
        }}
      >
        <div className="modal-content" style={{ boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.15)' }}>
          <div className="modal-header">
            <h5 className="modal-title" id="reportModalLabel">
              Get Report
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="fromDate" className="form-label">
                  From:
                </label>
                <DatePicker
                  id="fromDate"
                  selected={fromDate}
                  onChange={(date) => setFromDate(date)}
                  className="form-control"
                  dateFormat="MM/dd/yyyy"
                />
              </div>
              <div className="col">
                <label htmlFor="toDate" className="form-label">
                  To:
                </label>
                <DatePicker
                  id="toDate"
                  selected={toDate}
                  onChange={(date) => setToDate(date)}
                  className="form-control"
                  dateFormat="MM/dd/yyyy"
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={handleExportToExcel}>
              Export to Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportForm;