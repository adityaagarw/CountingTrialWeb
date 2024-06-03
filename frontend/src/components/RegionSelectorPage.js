// RegionSelectorPage.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from '../config';

const apiBaseUrl = backendUrl;

const RegionSelectorPage = () => {
  const { feedId } = useParams();
  const [image, setImage] = useState(null);
  const [targetWidth, setTargetWidth] = useState(0);
  const [targetHeight, setTargetHeight] = useState(0);
  const [regions, setRegions] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPoint, setDragStartPoint] = useState(null);
  const [draggedRegion, setDraggedRegion] = useState(null);
  const [draggedPoint, setDraggedPoint] = useState(null);
  const [isResizing, setIsResizing] = useState(false); // Add this line
  const [isCreating, setIsCreating] = useState(false); // Add this line
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  //const isCreating = useRef(false);

  useEffect(() => {
    fetchImageData();
  }, [feedId]);

  const fetchImageData = async () => {
    try {
      let response = await axios.get(`${apiBaseUrl}/feed/feed-target-resolution/${feedId}`);
      const targetHeight = response.data.targetHeight;
      const targetWidth = response.data.targetWidth;
      response = await axios.get(`${apiBaseUrl}/feed/feed-image/${feedId}`, { responseType: 'blob' });
      const imageUrl = URL.createObjectURL(response.data);
      setImage(imageUrl);
      setTargetWidth(targetWidth);
      setTargetHeight(targetHeight);
    } catch (error) {
      console.error('Error fetching image data:', error);
    }
  };

  const handleMouseDown = (event) => {
    const x = event.nativeEvent.offsetX;
    const y = event.nativeEvent.offsetY;
    setDragStartPoint({ x, y });
    
    if (!isResizing) {
      setIsCreating(true);
      setDraggedPoint('bottomRight');
      setRegions((prevRegions) => {
        const newRegion = {
          topLeft: { x, y },
          topRight: { x, y },
          bottomRight: { x, y },
          bottomLeft: { x, y },
        };
        const updatedRegions = [...prevRegions, newRegion];
        setDraggedRegion(updatedRegions.length - 1);
        return updatedRegions;
      });
    }
    setIsDragging(true);
  };
  
  const handleMouseMove = (event) => {
    if (isDragging) {
      const x = event.nativeEvent.offsetX;
      const y = event.nativeEvent.offsetY;
      setRegions((prevRegions) => {
        const updatedRegions = prevRegions.map((region, index) => {
          if (index === draggedRegion) {
            if (isCreating) {
              return {
                topLeft: { x: dragStartPoint.x, y: dragStartPoint.y },
                topRight: { x, y: dragStartPoint.y },
                bottomRight: { x, y },
                bottomLeft: { x: dragStartPoint.x, y },
              };
            } else {
              const updatedRegion = { ...region };
              updatedRegion[draggedPoint] = { x, y };
  
              // Update the other points based on the dragged point
              switch (draggedPoint) {
                case 'topLeft':
                  updatedRegion.topRight.y = y;
                  updatedRegion.bottomLeft.x = x;
                  break;
                case 'topRight':
                  updatedRegion.topLeft.y = y;
                  updatedRegion.bottomRight.x = x;
                  break;
                case 'bottomRight':
                  updatedRegion.topRight.y = y;
                  updatedRegion.bottomLeft.x = x;
                  break;
                case 'bottomLeft':
                  updatedRegion.topLeft.y = y;
                  updatedRegion.bottomRight.x = x;
                  break;
                default:
                  break;
              }
  
              return updatedRegion;
            }
          }
          return region;
        });
        return updatedRegions;
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsCreating(false); // We have finished creating
    setDraggedPoint(null);
    setDraggedRegion(null);
    setIsResizing(false); // We have finished resizing
  };
  
  const handlePointMouseDown = (regionIndex, pointName, event) => {
    event.stopPropagation();
    setIsDragging(true);
    setDraggedRegion(regionIndex);
    setDraggedPoint(pointName);
    setIsResizing(true); // We are starting to resize
  };

  const handleUndo = () => {
    if (regions.length > 0) {
      setRegions(regions.slice(0, -1));
    }
  };

  const handleSave = async () => {
    try {
      console.log('Saved regions:', regions);
      // Print type of regions
      console.log(typeof regions);
      await axios.post(`${apiBaseUrl}/feed/save-regions/${feedId}`, { regions });
      navigate(-1);
    } catch (error) {
      console.error('Error saving regions:', error);
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  const renderRegions = () => {
    return regions.map((region, index) => {
      const xs = [region.topLeft.x, region.topRight.x, region.bottomRight.x, region.bottomLeft.x];
      const ys = [region.topLeft.y, region.topRight.y, region.bottomRight.y, region.bottomLeft.y];
      const left = Math.min(...xs);
      const top = Math.min(...ys);
      const width = Math.max(...xs) - left;
      const height = Math.max(...ys) - top;
  
      return (
        <svg key={index} style={{ position: 'absolute', left, top, width, height, overflow: 'visible' }}>
          <polygon
            points={`${region.topLeft.x - left},${region.topLeft.y - top} ${region.topRight.x - left},${region.topRight.y - top} ${region.bottomRight.x - left},${region.bottomRight.y - top} ${region.bottomLeft.x - left},${region.bottomLeft.y - top}`}
            style={{ fill: 'transparent', stroke: 'red', strokeWidth: 1 }}
          />
          {Object.entries(region).map(([pointName, point]) => (
            <g
              key={pointName}
              onMouseDown={(event) => { 
                event.stopPropagation(); // prevent trigger handleMouseDown of the canvas
                handlePointMouseDown(index, pointName, event);
              }}
            >
              <circle
                cx={point.x - left}
                cy={point.y - top}
                r={5}
                fill="green"
                style={{ cursor: 'pointer' }}
              />
              <text 
                x={point.x - left} 
                y={point.y - top - 10} 
                fill="black" 
                style={{ fontSize: '12px', textAnchor: 'middle' }}
              >
                {pointName}
              </text>
            </g>
          ))}
        </svg>
      );
    });
  };

  return (
    <div className="region-selector-page">
      <div
        className="canvas-container"
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {image && (
          <img
            src={image}
            alt="Region Selector"
            style={{ width: targetWidth, height: targetHeight, pointerEvents: 'none' }}
          />
        )}
        {renderRegions()}
      </div>
      <div className="controls">
        <button onClick={handleUndo}>Undo</button>
        <button onClick={handleSave}>Save</button>
        <button onClick={handleClose}>Close</button>
      </div>
    </div>
  );
};

export default RegionSelectorPage;