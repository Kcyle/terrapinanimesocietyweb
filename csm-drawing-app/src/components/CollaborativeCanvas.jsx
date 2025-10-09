import { useEffect, useRef, useState } from 'react';
import { ref, onValue, set, get, push } from 'firebase/database';
import { database } from '../firebase';

function CollaborativeCanvas({ teamId, round, userName }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#DC143C');
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState('brush');
  const contextRef = useRef(null);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const lastProcessedStrokeCount = useRef(0);

  const drawingKey = `round${round}-${teamId}`;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size - SAME for everyone so mobile sees full canvas
    const isMobile = window.innerWidth <= 768;
    const width = isMobile
      ? Math.min(window.innerWidth - 40, 600)
      : 800;
    const height = isMobile
      ? Math.min((window.innerWidth - 40) * 0.75, 450)
      : 600;

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.lineJoin = 'round';
    contextRef.current = context;

    // Fill with white background
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);

    // Load existing drawing
    loadDrawing();

    // Listen for remote updates
    const drawingRef = ref(database, `drawings/${drawingKey}/strokes`);
    const unsubscribe = onValue(drawingRef, (snapshot) => {
      const strokes = snapshot.val();
      if (strokes) {
        const strokeArray = Object.values(strokes);
        // Only redraw if we have new strokes
        if (strokeArray.length !== lastProcessedStrokeCount.current) {
          lastProcessedStrokeCount.current = strokeArray.length;
          redrawCanvas(strokeArray);
        }
      } else {
        // Canvas was cleared
        lastProcessedStrokeCount.current = 0;
        const ctx = contextRef.current;
        if (ctx && canvas) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
    });

    // Handle resize
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      const newWidth = isMobile
        ? Math.min(window.innerWidth - 40, 600)
        : 800;
      const newHeight = isMobile
        ? Math.min((window.innerWidth - 40) * 0.75, 450)
        : 600;

      if (canvas.width !== newWidth || canvas.height !== newHeight) {
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        canvas.width = newWidth;
        canvas.height = newHeight;
        context.putImageData(imageData, 0, 0);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      unsubscribe();
      window.removeEventListener('resize', handleResize);
    };
  }, [drawingKey]);

  const loadDrawing = async () => {
    try {
      const drawingRef = ref(database, `drawings/${drawingKey}/imageData`);
      const snapshot = await get(drawingRef);
      const imageDataUrl = snapshot.val();

      if (imageDataUrl) {
        const img = new Image();
        img.onload = () => {
          contextRef.current.drawImage(img, 0, 0);
        };
        img.src = imageDataUrl;
      }
    } catch (err) {
      console.error('Error loading drawing:', err);
    }
  };

  const redrawCanvas = (strokes) => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!ctx || !canvas) return;

    // Clear and reset
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Redraw all strokes
    strokes.forEach(stroke => {
      if (!stroke || !stroke.points || stroke.points.length < 2) return;

      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.globalCompositeOperation = stroke.tool === 'eraser' ? 'destination-out' : 'source-over';

      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }

      ctx.stroke();
    });

    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over';
  };

  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    return { x, y };
  };

  const currentStrokeRef = useRef([]);

  const startDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(true);

    const pos = getCanvasCoordinates(e);
    lastPosRef.current = pos;
    currentStrokeRef.current = [pos];

    const ctx = contextRef.current;
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = brushSize;
    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();

    const pos = getCanvasCoordinates(e);
    const ctx = contextRef.current;

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    currentStrokeRef.current.push(pos);
    lastPosRef.current = pos;
  };

  const stopDrawing = async (e) => {
    if (!isDrawing) return;
    e.preventDefault();

    setIsDrawing(false);

    const ctx = contextRef.current;
    ctx.closePath();
    ctx.globalCompositeOperation = 'source-over';

    // Save stroke to Firebase for real-time sync
    if (currentStrokeRef.current.length > 1) {
      await saveStroke(currentStrokeRef.current);
    }

    currentStrokeRef.current = [];
  };

  const saveStroke = async (points) => {
    try {
      const strokesRef = ref(database, `drawings/${drawingKey}/strokes`);
      const newStrokeRef = push(strokesRef);

      const strokeData = {
        points,
        color: tool === 'eraser' ? '#ffffff' : color,
        size: brushSize,
        tool,
        timestamp: Date.now(),
        user: userName
      };

      await set(newStrokeRef, strokeData);

      // Also save the full image as backup
      await saveDrawing();
    } catch (err) {
      console.error('Error saving stroke:', err);
    }
  };

  const saveDrawing = async () => {
    try {
      const canvas = canvasRef.current;
      const imageData = canvas.toDataURL('image/png', 0.8);

      const drawingRef = ref(database, `drawings/${drawingKey}/imageData`);
      await set(drawingRef, imageData);
    } catch (err) {
      console.error('Error saving drawing:', err);
    }
  };

  const handleClear = async () => {
    if (!confirm('Are you sure you want to clear the canvas? This affects all team members!')) return;

    const canvas = canvasRef.current;
    const ctx = contextRef.current;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    try {
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

  const colors = [
    '#DC143C', '#000000', '#FFFFFF', '#FF6B6B',
    '#4ECDC4', '#FFE66D', '#A8E6CF', '#FF8B94',
    '#C7CEEA', '#FFDAC1'
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
            cursor: tool === 'eraser' ? 'crosshair' : 'crosshair',
            touchAction: 'none'
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
