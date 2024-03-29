import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ChartComponent = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = document.getElementById('myChart');
    if (ctx) {
      // Destroy the previous chart instance, if any
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00'],
          datasets: [
            {
              label: 'Entry & Exits',
              fill: true,
              data: [0, 1, 2, 3, 7, 8, 9, 10],
              backgroundColor: 'rgba(78, 115, 223, 0.05)',
              borderColor: 'rgba(78, 115, 223, 1)'
            }
          ]
        },
        options: {
          maintainAspectRatio: false,
          legend: {
            display: false,
            labels: {
              fontStyle: 'normal'
            }
          },
          title: {
            fontStyle: 'normal'
          },
          scales: {
            xAxes: [
              {
                gridLines: {
                  color: 'rgb(234, 236, 244)',
                  zeroLineColor: 'rgb(234, 236, 244)',
                  drawBorder: false,
                  drawTicks: false,
                  borderDash: ['2'],
                  zeroLineBorderDash: ['2'],
                  drawOnChartArea: false
                },
                ticks: {
                  fontColor: '#858796',
                  fontStyle: 'normal',
                  padding: 20
                }
              }
            ],
            yAxes: [
              {
                gridLines: {
                  color: 'rgb(234, 236, 244)',
                  zeroLineColor: 'rgb(234, 236, 244)',
                  drawBorder: false,
                  drawTicks: false,
                  borderDash: ['2'],
                  zeroLineBorderDash: ['2']
                },
                ticks: {
                  fontColor: '#858796',
                  fontStyle: 'normal',
                  padding: 20
                }
              }
            ]
          }
        }
      });
    }

    // Clean up the chart instance when the component is unmounted
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="row">
      <div className="col-lg-7 col-xl-8">
        <div className="card shadow mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h6 className="text-primary fw-bold m-0">Today's Overview</h6>
            <div className="dropdown no-arrow">
              <button
                className="btn btn-link btn-sm dropdown-toggle"
                aria-expanded="false"
                data-bs-toggle="dropdown"
                type="button"
              >
                <i className="fas fa-ellipsis-v text-gray-400"></i>
              </button>
              <div className="dropdown-menu shadow dropdown-menu-end animated--fade-in">
                <p className="text-center dropdown-header">dropdown header:</p>
                <a className="dropdown-item" href="#">
                  &nbsp;Action
                </a>
                <a className="dropdown-item" href="#">
                  &nbsp;Another action
                </a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" href="#">
                  &nbsp;Something else here
                </a>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="chart-area">
              <canvas id="myChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;