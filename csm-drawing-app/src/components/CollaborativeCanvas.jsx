import { useEffect, useRef, useState } from 'react';
import { ref, onValue, set, push, get } from 'firebase/database';
import { database } from '../firebase';
import * as fabric from 'fabric';

function CollaborativeCanvas({ teamId, round, userName }) {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const [color, setColor] = useState('#DC143C');
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState('brush');
  const [isDrawing, setIsDrawing] = useState(false);
  const processingRemoteUpdate = useRef(false);
  const localDrawingKey = useRef(null);

  const drawingKey = `round${round}-${teamId}`;

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth > 768 ? 800 : window.innerWidth - 40,
      height: window.innerWidth > 768 ? 600 : 400,
      backgroundColor: '#ffffff',
      isDrawingMode: true
    });

    fabricCanvasRef.current = canvas;

    canvas.freeDrawingBrush.color = color;
    canvas.freeDrawingBrush.width = brushSize;

    loadDrawing(canvas);

    const drawingRef = ref(database, `drawings/${drawingKey}/strokes`);
    const unsubscribe = onValue(drawingRef, (snapshot) => {
      if (processingRemoteUpdate.current) return;

      const strokes = snapshot.val();
      if (strokes) {
        processingRemoteUpdate.current = true;
        updateCanvasFromStrokes(canvas, strokes);
        processingRemoteUpdate.current = false;
      }
    });

    const handlePathCreated = (e) => {
      if (!isDrawing) {
        saveStroke(e.path);
      }
    };

    canvas.on('path:created', handlePathCreated);

    const handleResize = () => {
      const newWidth = window.innerWidth > 768 ? 800 : window.innerWidth - 40;
      const newHeight = window.innerWidth > 768 ? 600 : 400;
      canvas.setDimensions({ width: newWidth, height: newHeight });
      canvas.renderAll();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      unsubscribe();
      canvas.off('path:created', handlePathCreated);
      window.removeEventListener('resize', handleResize);
      canvas.dispose();
    };
  }, [drawingKey]);

  useEffect(() => {
    if (fabricCanvasRef.current) {
      const canvas = fabricCanvasRef.current;
      canvas.freeDrawingBrush.color = tool === 'eraser' ? '#ffffff' : color;
      canvas.freeDrawingBrush.width = brushSize;
    }
  }, [color, brushSize, tool]);

  useEffect(() => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.isDrawingMode = tool === 'brush' || tool === 'eraser';
    }
  }, [tool]);

  const loadDrawing = async (canvas) => {
    try {
      const drawingRef = ref(database, `drawings/${drawingKey}`);
      const snapshot = await get(drawingRef);
      const data = snapshot.val();

      if (data && data.imageData) {
        fabric.Image.fromURL(data.imageData, (img) => {
          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
            scaleX: canvas.width / img.width,
            scaleY: canvas.height / img.height
          });
        });
      }
    } catch (err) {
      console.error('Error loading drawing:', err);
    }
  };

  const updateCanvasFromStrokes = (canvas, strokes) => {
    const objects = canvas.getObjects();
    objects.forEach(obj => canvas.remove(obj));

    Object.values(strokes).forEach((strokeData) => {
      if (strokeData && strokeData.path) {
        fabric.Path.fromObject(strokeData, (path) => {
          canvas.add(path);
          canvas.renderAll();
        });
      }
    });
  };

  const saveStroke = async (path) => {
    try {
      const strokesRef = ref(database, `drawings/${drawingKey}/strokes`);
      const newStrokeRef = push(strokesRef);

      const strokeData = {
        path: path.path,
        stroke: path.stroke,
        strokeWidth: path.strokeWidth,
        fill: path.fill,
        left: path.left,
        top: path.top,
        timestamp: Date.now(),
        user: userName
      };

      await set(newStrokeRef, strokeData);

      saveImage();
    } catch (err) {
      console.error('Error saving stroke:', err);
    }
  };

  const saveImage = async () => {
    if (!fabricCanvasRef.current) return;

    try {
      const imageData = fabricCanvasRef.current.toDataURL({
        format: 'png',
        quality: 0.8
      });

      const drawingRef = ref(database, `drawings/${drawingKey}/imageData`);
      await set(drawingRef, imageData);
    } catch (err) {
      console.error('Error saving image:', err);
    }
  };

  const handleClear = async () => {
    if (!fabricCanvasRef.current) return;
    if (!confirm('Are you sure you want to clear the canvas? This affects all team members!')) return;

    try {
      fabricCanvasRef.current.clear();
      fabricCanvasRef.current.backgroundColor = '#ffffff';
      fabricCanvasRef.current.renderAll();

      const drawingRef = ref(database, `drawings/${drawingKey}`);
      await set(drawingRef, {
        strokes: {},
        imageData: null,
        clearedAt: Date.now(),
        clearedBy: userName
      });
    } catch (err) {
      console.error('Error clearing canvas:', err);
    }
  };

  const handleUndo = async () => {
    if (!fabricCanvasRef.current) return;

    try {
      const canvas = fabricCanvasRef.current;
      const objects = canvas.getObjects();

      if (objects.length > 0) {
        canvas.remove(objects[objects.length - 1]);
        canvas.renderAll();

        const drawingRef = ref(database, `drawings/${drawingKey}/strokes`);
        const snapshot = await get(drawingRef);
        const strokes = snapshot.val() || {};

        const strokeKeys = Object.keys(strokes);
        if (strokeKeys.length > 0) {
          const lastKey = strokeKeys[strokeKeys.length - 1];
          const updatedStrokes = { ...strokes };
          delete updatedStrokes[lastKey];

          await set(drawingRef, updatedStrokes);
          saveImage();
        }
      }
    } catch (err) {
      console.error('Error undoing:', err);
    }
  };

  const colors = [
    '#DC143C', // Crimson
    '#000000', // Black
    '#FFFFFF', // White
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#FFE66D', // Yellow
    '#A8E6CF', // Green
    '#FF8B94', // Pink
    '#C7CEEA', // Purple
    '#FFDAC1', // Peach
  ];

  const brushSizes = [2, 5, 10, 20, 30];

  return (
    <div className="collaborative-canvas-container">
      <div className="canvas-toolbar">
        <div className="tool-group">
          <label>Tool:</label>
          <button
            className={`tool-button ${tool === 'brush' ? 'active' : ''}`}
            onClick={() => setTool('brush')}
            title="Brush"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 19l7-7 3 3-7 7-3-3z" />
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
              <path d="M2 2l7.586 7.586" />
            </svg>
          </button>
          <button
            className={`tool-button ${tool === 'eraser' ? 'active' : ''}`}
            onClick={() => setTool('eraser')}
            title="Eraser"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20 20H7L3 16L12 7L21 16V20Z" />
              <path d="M7 20L12 15" />
            </svg>
          </button>
        </div>

        <div className="tool-group">
          <label>Color:</label>
          <div className="color-palette">
            {colors.map((c) => (
              <button
                key={c}
                className={`color-button ${color === c ? 'active' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
                title={c}
              />
            ))}
          </div>
        </div>

        <div className="tool-group">
          <label>Size:</label>
          <div className="size-selector">
            {brushSizes.map((size) => (
              <button
                key={size}
                className={`size-button ${brushSize === size ? 'active' : ''}`}
                onClick={() => setBrushSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="tool-group">
          <button className="action-button undo-button" onClick={handleUndo} title="Undo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 7v6h6" />
              <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13" />
            </svg>
            Undo
          </button>
          <button className="action-button clear-button" onClick={handleClear} title="Clear All">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 6h18" />
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
            Clear
          </button>
        </div>
      </div>

      <div className="canvas-wrapper">
        <canvas ref={canvasRef} />
      </div>

      <div className="canvas-info">
        <p className="team-drawing-info">
          Team members can see your drawings in real-time!
        </p>
      </div>
    </div>
  );
}

export default CollaborativeCanvas;
