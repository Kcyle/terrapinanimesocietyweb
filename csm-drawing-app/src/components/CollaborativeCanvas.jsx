import { useEffect, useRef, useState } from 'react';
import { ref, onValue, set, get, push } from 'firebase/database';
import { database } from '../firebase';

function CollaborativeCanvas({ teamId, round, userName }) {
  const canvasRef = useRef(null);
  const cursorCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#DC143C');
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState('brush');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const contextRef = useRef(null);
  const cursorContextRef = useRef(null);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const lastProcessedStrokeCount = useRef(0);

  const drawingKey = `round${round}-${teamId}`;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size - fixed size that works on both desktop and mobile
    canvas.width = 800;
    canvas.height = 600;

    // Set CSS display size
    if (window.innerWidth <= 768) {
      // Mobile: scale to fit screen width while maintaining aspect ratio
      const maxWidth = window.innerWidth - 50; // Account for padding
      const scale = maxWidth / 800;
      canvas.style.width = maxWidth + 'px';
      canvas.style.height = (600 * scale) + 'px';
    } else {
      canvas.style.width = '800px';
      canvas.style.height = '600px';
    }

    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.lineJoin = 'round';
    contextRef.current = context;

    // Fill with white background
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);

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

    // Handle resize - canvas stays 800x600, adjust CSS display size
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        const maxWidth = window.innerWidth - 50;
        const scale = maxWidth / 800;
        canvas.style.width = maxWidth + 'px';
        canvas.style.height = (600 * scale) + 'px';
      } else {
        canvas.style.width = '800px';
        canvas.style.height = '600px';
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

      if (imageDataUrl && contextRef.current) {
        const img = new Image();
        img.onload = () => {
          if (contextRef.current) {
            contextRef.current.drawImage(img, 0, 0);
          }
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

    // Get the actual click position
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;

    // Scale coordinates from display size to canvas size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    return { x, y };
  };

  const currentStrokeRef = useRef([]);

  const floodFill = (startX, startY, fillColor) => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    const startPos = (Math.floor(startY) * canvas.width + Math.floor(startX)) * 4;
    const startR = pixels[startPos];
    const startG = pixels[startPos + 1];
    const startB = pixels[startPos + 2];
    const startA = pixels[startPos + 3];

    const fillR = parseInt(fillColor.slice(1, 3), 16);
    const fillG = parseInt(fillColor.slice(3, 5), 16);
    const fillB = parseInt(fillColor.slice(5, 7), 16);

    if (startR === fillR && startG === fillG && startB === fillB) return;

    const stack = [[Math.floor(startX), Math.floor(startY)]];
    const visited = new Set();

    while (stack.length > 0) {
      const [x, y] = stack.pop();
      const key = `${x},${y}`;

      if (visited.has(key)) continue;
      if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;

      const pos = (y * canvas.width + x) * 4;
      const r = pixels[pos];
      const g = pixels[pos + 1];
      const b = pixels[pos + 2];
      const a = pixels[pos + 3];

      if (r !== startR || g !== startG || b !== startB || a !== startA) continue;

      visited.add(key);
      pixels[pos] = fillR;
      pixels[pos + 1] = fillG;
      pixels[pos + 2] = fillB;
      pixels[pos + 3] = 255;

      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const startDrawing = (e) => {
    e.preventDefault();

    const pos = getCanvasCoordinates(e);

    if (tool === 'bucket') {
      floodFill(pos.x, pos.y, color);
      saveDrawing();
      return;
    }

    setIsDrawing(true);
    lastPosRef.current = pos;
    currentStrokeRef.current = [pos];

    const ctx = contextRef.current;
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = brushSize;
    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const handleMouseMove = (e) => {
    if (tool === 'eraser' || tool === 'brush' || tool === 'bucket') {
      const pos = getCanvasCoordinates(e);
      setCursorPos(pos);
    }

    if (!isDrawing) return;
    draw(e);
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

  // Chainsaw Man themed colors
  const colors = [
    '#DC143C', // Crimson red (Chainsaw Man's iconic color)
    '#000000', // Black
    '#FFFFFF', // White
    '#8B0000', // Dark red (blood)
    '#FFA500', // Orange (chainsaw blade)
    '#FFD700', // Gold (Pochita)
    '#4A4A4A', // Dark gray (chainsaw body)
    '#FF4500', // Orange-red (fire/action)
    '#8B4513', // Brown (wood handle)
    '#FF69B4', // Pink (Power)
    '#1E90FF', // Blue (Aki)
    '#32CD32'  // Green (Denji's shirt)
  ];

  const brushSizes = [2, 5, 10, 20, 30];

  return (
    <div className="collaborative-canvas-container">
      <div className="canvas-toolbar">
        <div className="tool-group">
          <button
            className={`tool-button ${tool === 'brush' ? 'active' : ''}`}
            onClick={() => setTool('brush')}
            title="Brush"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/>
              <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"/>
            </svg>
          </button>
          <button
            className={`tool-button ${tool === 'eraser' ? 'active' : ''}`}
            onClick={() => setTool('eraser')}
            title="Eraser"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 21h10"/>
              <path d="M3.5 14.5 9 9l5 5"/>
              <path d="M11 7l6-6 6 6-6 6z"/>
            </svg>
          </button>
          <button
            className={`tool-button ${tool === 'bucket' ? 'active' : ''}`}
            onClick={() => setTool('bucket')}
            title="Bucket Fill"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 4L5 8v12l4 4h6l4-4V8l-4-4z"/>
              <path d="M12 3v4"/>
              <path d="M8 3h8"/>
              <circle cx="18" cy="20" r="2" fill="currentColor"/>
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
            <button
              className="color-picker-wrapper"
              onClick={() => document.getElementById('color-picker-input').click()}
              title="Custom Color Picker"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="13.5" cy="6.5" r=".5"/>
                <circle cx="17.5" cy="10.5" r=".5"/>
                <circle cx="8.5" cy="7.5" r=".5"/>
                <circle cx="6.5" cy="12.5" r=".5"/>
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
              </svg>
              <input
                id="color-picker-input"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="color-picker-input-hidden"
                title="Custom Color"
              />
            </button>
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

      <div className="canvas-wrapper" style={{ position: 'relative' }}>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDrawing}
          onMouseLeave={() => { stopDrawing; setCursorPos({ x: -100, y: -100 }); }}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          style={{
            cursor: tool === 'bucket' ? 'pointer' : 'none',
            touchAction: 'none'
          }}
        />
        {tool === 'eraser' && cursorPos.x > 0 && (
          <div
            className="eraser-cursor"
            style={{
              position: 'absolute',
              left: `${(cursorPos.x / 800) * 100}%`,
              top: `${(cursorPos.y / 600) * 100}%`,
              width: `${brushSize}px`,
              height: `${brushSize}px`,
              border: '2px solid #000',
              borderRadius: '50%',
              pointerEvents: 'none',
              transform: 'translate(-50%, -50%)',
              zIndex: 1000
            }}
          />
        )}
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
