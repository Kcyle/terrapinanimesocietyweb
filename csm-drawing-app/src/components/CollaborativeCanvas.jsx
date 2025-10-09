import { useEffect, useRef, useState } from 'react';
import { ref, onValue, set, push } from 'firebase/database';
import { database } from '../firebase';

function CollaborativeCanvas({ teamId, round, userName }) {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#DC143C');
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState('brush');
  const lastPoint = useRef(null);
  const ignoreNextUpdate = useRef(false);

  const drawingKey = `round${round}-${teamId}`;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = window.innerWidth > 768 ? 800 : window.innerWidth - 40;
    const height = window.innerWidth > 768 ? 600 : 400;

    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);
    contextRef.current = context;

    const drawingRef = ref(database, `drawings/${drawingKey}`);
    const unsubscribe = onValue(drawingRef, (snapshot) => {
      if (ignoreNextUpdate.current) {
        ignoreNextUpdate.current = false;
        return;
      }

      const data = snapshot.val();
      if (data && data.imageData) {
        const img = new Image();
        img.onload = () => {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.fillStyle = '#ffffff';
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = data.imageData;
      }
    });

    return () => unsubscribe();
  }, [drawingKey]);

  const redrawCanvas = (strokes) => {
    const context = contextRef.current;
    const canvas = canvasRef.current;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    Object.values(strokes).forEach(stroke => {
      if (!stroke || !stroke.points || stroke.points.length < 2) return;

      context.strokeStyle = stroke.color;
      context.lineWidth = stroke.size;
      context.globalCompositeOperation = stroke.tool === 'eraser' ? 'destination-out' : 'source-over';

      context.beginPath();
      context.moveTo(stroke.points[0].x, stroke.points[0].y);

      for (let i = 1; i < stroke.points.length; i++) {
        context.lineTo(stroke.points[i].x, stroke.points[i].y);
      }

      context.stroke();
    });

    context.globalCompositeOperation = 'source-over';
  };

  const startDrawing = (e) => {
    const { offsetX, offsetY } = getMousePos(e);
    setIsDrawing(true);
    lastPoint.current = { x: offsetX, y: offsetY };
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();

    const { offsetX, offsetY } = getMousePos(e);
    const context = contextRef.current;

    context.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    context.lineWidth = brushSize;
    context.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';

    context.beginPath();
    context.moveTo(lastPoint.current.x, lastPoint.current.y);
    context.lineTo(offsetX, offsetY);
    context.stroke();

    lastPoint.current = { x: offsetX, y: offsetY };
  };

  const stopDrawing = async (e) => {
    if (!isDrawing) return;

    setIsDrawing(false);

    const canvas = canvasRef.current;
    const context = contextRef.current;
    const imageData = canvas.toDataURL('image/png', 0.8);

    try {
      ignoreNextUpdate.current = true;

      const drawingRef = ref(database, `drawings/${drawingKey}`);
      await set(drawingRef, {
        imageData: imageData,
        updatedAt: Date.now(),
        updatedBy: userName
      });
    } catch (err) {
      console.error('Error saving drawing:', err);
    }

    context.globalCompositeOperation = 'source-over';
  };

  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    if (e.touches) {
      return {
        offsetX: e.touches[0].clientX - rect.left,
        offsetY: e.touches[0].clientY - rect.top
      };
    }

    return {
      offsetX: e.nativeEvent.offsetX,
      offsetY: e.nativeEvent.offsetY
    };
  };

  const handleClear = async () => {
    if (!confirm('Clear the canvas? This affects all team members!')) return;

    const context = contextRef.current;
    const canvas = canvasRef.current;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    try {
      const drawingRef = ref(database, `drawings/${drawingKey}`);
      await set(drawingRef, {
        imageData: null,
        strokes: {},
        clearedAt: Date.now(),
        clearedBy: userName
      });
    } catch (err) {
      console.error('Error clearing canvas:', err);
    }
  };

  const colors = [
    '#DC143C',
    '#000000',
    '#FFFFFF',
    '#FF6B6B',
    '#4ECDC4',
    '#FFE66D',
    '#A8E6CF',
    '#FF8B94',
    '#C7CEEA',
    '#FFDAC1',
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
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          style={{
            border: '2px solid #DC143C',
            cursor: tool === 'eraser' ? 'crosshair' : 'crosshair',
            touchAction: 'none',
            backgroundColor: '#ffffff'
          }}
        />
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
