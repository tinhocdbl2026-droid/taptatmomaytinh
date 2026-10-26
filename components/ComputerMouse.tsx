import React, { useState } from 'react';
import { Mouse as MouseIcon } from 'lucide-react';
import { soundEngine } from '../audio/soundEffects';

interface Props {
  onMouseClick?: () => void;
}

export const ComputerMouse: React.FC<Props> = ({ onMouseClick }) => {
  const [activeButton, setActiveButton] = useState<'left' | 'right' | 'wheel' | null>(null);

  const handleLeftClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveButton('left');
    soundEngine.playMouseClick();
    if (onMouseClick) onMouseClick();
    setTimeout(() => setActiveButton(null), 150);
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveButton('right');
    soundEngine.playMouseClick();
    setTimeout(() => setActiveButton(null), 150);
  };

  const handleWheel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveButton('wheel');
    soundEngine.playKeyPress();
    setTimeout(() => setActiveButton(null), 150);
  };

  return (
    <div className="flex flex-col items-center select-none">
      {/* Label Badge */}
      <div className="mb-1.5 flex items-center gap-1.5 px-3 py-0.5 bg-slate-800/80 backdrop-blur rounded-full border border-slate-700/60 shadow-sm">
        <MouseIcon className="w-3 h-3 text-amber-400" />
        <span className="text-[11px] font-bold text-slate-200">Chuột máy tính (Mouse)</span>
      </div>

      {/* Mousepad Base */}
      <div className="relative w-32 sm:w-36 h-40 sm:h-44 bg-gradient-to-tr from-indigo-900 to-purple-900 rounded-2xl shadow-xl border-2 border-indigo-700/50 p-2 flex items-center justify-center overflow-hidden">
        {/* Mousepad playful graphic */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:8px_8px]" />
        <div className="absolute bottom-1 right-2 text-[9px] font-bold text-indigo-300">
          LÓT CHUỘT
        </div>

        {/* Optical Mouse Body */}
        <div className="relative w-20 sm:w-22 h-32 sm:h-34 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 rounded-t-3xl rounded-b-[2rem] shadow-2xl border border-slate-600 flex flex-col items-center p-1 cursor-pointer">
          {/* Mouse Wire / Cord */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-1 h-5 bg-slate-900 rounded-full" />

          {/* Top Buttons Split */}
          <div className="w-full h-14 flex gap-1 relative z-10">
            {/* Left Button */}
            <button
              onClick={handleLeftClick}
              title="Nút chuột trái: Thao tác chọn, nhấp mở"
              className={`flex-1 rounded-tl-2xl rounded-bl-sm transition-all duration-75 flex flex-col items-center justify-center ${
                activeButton === 'left'
                  ? 'bg-slate-950 translate-y-0.5 shadow-inner'
                  : 'bg-slate-800 hover:bg-slate-700 border-b border-slate-900 shadow'
              }`}
            >
              <span className="text-[9px] font-bold text-slate-300">Trái</span>
            </button>

            {/* Middle Scroll Wheel */}
            <div className="w-4 flex flex-col items-center justify-center">
              <button
                onClick={handleWheel}
                title="Bánh lăn chuột: Cuộn trang lên xuống"
                className={`w-3.5 h-8 rounded-full border border-slate-900 flex items-center justify-center transition-all ${
                  activeButton === 'wheel' ? 'bg-amber-400 scale-95' : 'bg-slate-900 hover:bg-slate-700'
                }`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
              </button>
            </div>

            {/* Right Button */}
            <button
              onClick={handleRightClick}
              onContextMenu={handleRightClick}
              title="Nút chuột phải: Mở bảng chọn phụ"
              className={`flex-1 rounded-tr-2xl rounded-br-sm transition-all duration-75 flex flex-col items-center justify-center ${
                activeButton === 'right'
                  ? 'bg-slate-950 translate-y-0.5 shadow-inner'
                  : 'bg-slate-800 hover:bg-slate-700 border-b border-slate-900 shadow'
              }`}
            >
              <span className="text-[9px] font-bold text-slate-300">Phải</span>
            </button>
          </div>

          {/* Mouse Palm Rest */}
          <div className="flex-1 w-full flex flex-col items-center justify-center mt-1">
            <div className="w-6 h-6 rounded-full border border-slate-700/60 bg-slate-900 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
            </div>
            <span className="text-[8px] font-semibold text-slate-500 mt-1 uppercase tracking-wider">
              OPTICAL
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
