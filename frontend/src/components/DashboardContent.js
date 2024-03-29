import React, { useState } from 'react';
import ChartComponent from './ChartComponent';
import ReportForm from './ReportForm';

const DashboardContent = () => {
  const [showReportForm, setShowReportForm] = useState(false);

  const handleGetReport = () => {
    setShowReportForm((prevState) => !prevState);
  };

  return (
    <div className="container-fluid">
      <div className="d-sm-flex justify-content-between align-items-center mb-4">
        <h3 className="text-dark mb-0">Dashboard</h3>
        {/*<button className="btn btn-primary btn-sm d-none d-sm-inline-block" role="button" onClick={handleGetReport}>*/}
        <button
          className="btn btn-primary btn-sm d-none d-sm-inline-block"
          role="button"
          // data-bs-toggle="modal"
          // data-bs-target="#reportModal"
          onClick={handleGetReport}
        >
          <i className="fas fa-download fa-sm text-white-50" />&nbsp;Get Report 
        </button>
      </div>

      <div className="row">
        <div className="col-md-6 col-xl-3 mb-4">
          <div className="card shadow border-start-primary py-2">
            <div className="card-body">
              <div className="row align-items-center no-gutters">
                <div className="col me-2">
                  <div className="text-uppercase text-primary fw-bold text-xs mb-1">
                    <span>TOTAL ENTRIES</span>
                  </div>
                  <div className="text-dark fw-bold h5 mb-0">
                    <span>12</span>
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-chevron-circle-up fa-2x text-gray-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-6 col-xl-3 mb-4">
          <div className="card shadow border-start-success py-2">
            <div className="card-body">
              <div className="row align-items-center no-gutters">
                <div className="col me-2">
                  <div className="text-uppercase text-success fw-bold text-xs mb-1">
                    <span style={{color: "rgb(78,115,223)"}}>TOTAL EXITS</span>
                  </div>
                  <div className="text-dark fw-bold h5 mb-0"><span>12</span></div>
                </div>
                <div className="col-auto"><i className="fas fa-chevron-circle-down fa-2x text-gray-300" /></div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
      
      <div className="row">
        <ChartComponent />
      </div>

      <ReportForm isOpen={showReportForm} onClose={handleGetReport} />
    </div>
  );
};

export default DashboardContent;