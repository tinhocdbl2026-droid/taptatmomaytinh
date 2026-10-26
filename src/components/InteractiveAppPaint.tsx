import React, { useRef, useState, useEffect } from 'react';
import { Palette, Eraser, RotateCcw, X, Sparkles, Smile, Star, Heart } from 'lucide-react';
import { soundEngine } from '../audio/soundEffects';

interface Props {
  onClose: () => void;
}

const COLORS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#1e293b', // Dark Slate
  '#ffffff', // White
];

export const InteractiveAppPaint: React.FC<Props> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('#3b82f6');
  const [brushSize, setBrushSize] = useState<number>(6);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [mode, setMode] = useState<'brush' | 'eraser' | 'stamp'>('brush');
  const [selectedStamp, setSelectedStamp] = useState<string>('⭐');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    if (mode === 'stamp') {
      ctx.font = '28px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(selectedStamp, x, y);
      soundEngine.playKeyPress();
      return;
    }

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = mode === 'eraser' ? '#ffffff' : selectedColor;
    ctx.lineWidth = mode === 'eraser' ? brushSize * 2.5 : brushSize;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDraw = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    soundEngine.playResetClick();
  };

  return (
    <div className="absolute inset-2 sm:inset-4 bg-slate-100 rounded-lg shadow-2xl border-2 border-slate-300 flex flex-col overflow-hidden z-20">
      {/* Window title bar */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1.5 flex items-center justify-between text-white select-none">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-amber-300" />
          <span className="font-bold text-xs sm:text-sm tracking-wide">Bé Tập Vẽ Tranh (Paint)</span>
        </div>
        <button
          onClick={() => {
            soundEngine.playMouseClick();
            onClose();
          }}
          className="w-6 h-6 rounded flex items-center justify-center hover:bg-red-500 transition-colors text-white"
          title="Đóng cửa sổ"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-slate-200 px-2 py-1.5 flex flex-wrap items-center gap-2 text-xs">
        {/* Tool modes */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded border border-slate-200">
          <button
            onClick={() => {
              setMode('brush');
              soundEngine.playMouseClick();
            }}
            className={`px-2 py-1 rounded flex items-center gap-1 font-semibold transition-all ${
              mode === 'brush' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" /> Bút vẽ
          </button>
          <button
            onClick={() => {
              setMode('eraser');
              soundEngine.playMouseClick();
            }}
            className={`px-2 py-1 rounded flex items-center gap-1 font-semibold transition-all ${
              mode === 'eraser' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Eraser className="w-3.5 h-3.5" /> Tẩy
          </button>
          <button
            onClick={() => {
              setMode('stamp');
              soundEngine.playMouseClick();
            }}
            className={`px-2 py-1 rounded flex items-center gap-1 font-semibold transition-all ${
              mode === 'stamp' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Dán hình
          </button>
        </div>

        {/* Color Palette */}
        {mode === 'brush' && (
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded border border-slate-200">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setSelectedColor(c);
                  soundEngine.playMouseClick();
                }}
                className={`w-5 h-5 rounded-full border border-slate-300 transition-transform ${
                  selectedColor === c ? 'scale-125 ring-2 ring-blue-500 shadow' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
        )}

        {/* Stamp Palette */}
        {mode === 'stamp' && (
          <div className="flex items-center gap-1 bg-purple-50 p-1 rounded border border-purple-200">
            {['⭐', '❤️', '🌟', '🌸', '🚀', '🐱', '💻', '🍎'].map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  setSelectedStamp(emoji);
                  soundEngine.playMouseClick();
                }}
                className={`w-6 h-6 rounded flex items-center justify-center text-sm transition-transform ${
                  selectedStamp === emoji ? 'bg-purple-200 scale-125 ring-1 ring-purple-600' : 'hover:scale-110'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Brush Size */}
        <div className="flex items-center gap-1 ml-auto">
          <span className="text-[11px] text-slate-500 font-medium">Nét:</span>
          {[3, 6, 12].map((size) => (
            <button
              key={size}
              onClick={() => {
                setBrushSize(size);
                soundEngine.playMouseClick();
              }}
              className={`w-6 h-6 rounded flex items-center justify-center border font-bold text-xs ${
                brushSize === size ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              {size === 3 ? 'S' : size === 6 ? 'M' : 'L'}
            </button>
          ))}
          <button
            onClick={clearCanvas}
            className="px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded border border-red-200 flex items-center gap-1 font-semibold ml-1"
            title="Xóa trang vẽ"
          >
            <RotateCcw className="w-3 h-3" /> Xóa
          </button>
        </div>
      </div>

      {/* Drawing Canvas Area */}
      <div className="flex-1 bg-slate-200 p-2 flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          width={540}
          height={320}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
          className="bg-white rounded shadow-md border border-slate-300 cursor-crosshair max-w-full max-h-full object-contain touch-none"
        />
      </div>

      <div className="bg-slate-100 px-3 py-1 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between">
        <span>Bé hãy dùng chuột để vẽ tranh hoặc dán sticker nhé!</span>
        <span>Kích thước: 540 x 320 px</span>
      </div>
    </div>
  );
};
