import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import { Stage, Layer, Rect, Transformer } from 'react-konva';

const DrawRegionModal = ({ isOpen, onClose, image, targetWidth, targetHeight, onRegionsDrawn }) => {
  const canvasRef = useRef(null);
  const [regions, setRegions] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const trRef = React.useRef(null);

  useEffect(() => {
    if (selectedId !== null && trRef.current) {
      // we need to attach transformer manually
      trRef.current.nodes([document.getElementById(selectedId)]);
      trRef.current.getLayer().batchDraw();
    }
  }, [selectedId]);

  const handleStageMouseDown = (e) => {
    // clicked on stage - remove selection
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
      return;
    }

    // clicked on transformer - do nothing
    const clickedOnTransformer = e.target.getParent().className === 'Transformer';
    if (clickedOnTransformer) {
      return;
    }

    // find clicked rect by its id
    const id = e.target.id();
    if (id === '') {
      // if clicked on empty area - remove selection
      setSelectedId(null);
    } else {
      setSelectedId(id);
    }
  };

  const handleAddRegion = () => {
    const newRegion = {
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      id: `rect-${regions.length}`,
    };
    setRegions([...regions, newRegion]);
  };

  const handleRegionTransform = (index, newAttrs) => {
    const updatedRegions = [...regions];
    updatedRegions[index] = newAttrs;
    setRegions(updatedRegions);
  };

  const handleRegionDelete = (index) => {
    const updatedRegions = [...regions];
    updatedRegions.splice(index, 1);
    setRegions(updatedRegions);
  };

  const handleSave = () => {
    onRegionsDrawn(
      regions.map((region) => ({
        x1: region.x,
        y1: region.y,
        x2: region.x + region.width,
        y2: region.y,
        x3: region.x + region.width,
        y3: region.y + region.height,
        x4: region.x,
        y4: region.y + region.height,
      }))
    );
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Draw Region"
      className="modal"
      overlayClassName="modal-overlay"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Draw Region</h5>
            <button type="button" className="close" onClick={onClose}>
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <Stage
              ref={canvasRef}
              width={targetWidth}
              height={targetHeight}
              onMouseDown={handleStageMouseDown}
            >
              <Layer>
                <Rect
                  image={new Image(image)}
                  width={targetWidth}
                  height={targetHeight}
                />
                {regions.map((region, index) => (
                  <Rect
                    key={region.id}
                    id={region.id}
                    x={region.x}
                    y={region.y}
                    width={region.width}
                    height={region.height}
                    stroke={selectedId === region.id ? 'blue' : 'green'}
                    strokeWidth={2}
                    draggable
                    onDragEnd={(e) => handleRegionTransform(index, e.target.attrs)}
                    onTransformEnd={(e) => handleRegionTransform(index, {
                      x: e.target.x(),
                      y: e.target.y(),
                      width: e.target.width() * e.target.scaleX(),
                      height: e.target.height() * e.target.scaleY(),
                    })}
                    onClick={() => setSelectedId(region.id)}
                    onDblClick={() => handleRegionDelete(index)}
                  />
                ))}
              </Layer>
              {selectedId && (
                <Layer>
                  <Transformer
                    ref={trRef}
                    boundBoxFunc={(oldBox, newBox) => {
                      // limit resize
                      if (newBox.width < 5 || newBox.height < 5) {
                        return oldBox;
                      }
                      return newBox;
                    }}
                  />
                </Layer>
              )}
            </Stage>
            <button className="btn btn-primary" onClick={handleAddRegion}>
              Add Region
            </button>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary" onClick={handleSave}>
              Save
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DrawRegionModal;