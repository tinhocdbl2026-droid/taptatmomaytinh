import React, { useState } from 'react';
import { Keyboard as KeyboardIcon } from 'lucide-react';
import { soundEngine } from '../audio/soundEffects';

interface Props {
  onKeyPress: (key: string) => void;
  activeKey?: string | null;
}

const KEYBOARD_ROWS = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Backspace'],
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Enter'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Space'],
];

export const ComputerKeyboard: React.FC<Props> = ({ onKeyPress, activeKey }) => {
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const handleKeyClick = (key: string) => {
    setPressedKey(key);
    soundEngine.playKeyPress();
    onKeyPress(key);
    setTimeout(() => {
      setPressedKey(null);
    }, 150);
  };

  return (
    <div className="flex flex-col items-center select-none">
      {/* Label Badge */}
      <div className="mb-1.5 flex items-center gap-1.5 px-3 py-0.5 bg-slate-800/80 backdrop-blur rounded-full border border-slate-700/60 shadow-sm">
        <KeyboardIcon className="w-3 h-3 text-emerald-400" />
        <span className="text-[11px] font-bold text-slate-200">Bàn phím máy tính (Keyboard)</span>
      </div>

      {/* Keyboard Body Frame */}
      <div className="w-[310px] sm:w-[460px] md:w-[500px] bg-gradient-to-b from-slate-800 via-slate-800 to-slate-900 rounded-xl p-2 sm:p-2.5 shadow-2xl border-2 border-slate-700/70">
        <div className="flex flex-col gap-1 sm:gap-1.5">
          {KEYBOARD_ROWS.map((row, rowIdx) => (
            <div key={rowIdx} className="flex justify-center gap-1 sm:gap-1.5">
              {row.map((k) => {
                const isSpecial = k === 'Backspace' || k === 'Enter' || k === 'Space';
                const isCurrentlyActive =
                  pressedKey === k ||
                  (activeKey &&
                    (activeKey.toUpperCase() === k ||
                      (activeKey === ' ' && k === 'Space') ||
                      (activeKey === 'Backspace' && k === 'Backspace') ||
                      (activeKey === 'Enter' && k === 'Enter')));

                return (
                  <button
                    key={k}
                    onClick={() => handleKeyClick(k)}
                    className={`h-7 sm:h-8 rounded-md font-bold text-[10px] sm:text-xs transition-all duration-75 flex items-center justify-center shadow ${
                      k === 'Space'
                        ? 'w-32 sm:w-44 bg-slate-700 hover:bg-slate-600 text-slate-300'
                        : isSpecial
                        ? 'px-2 sm:px-3 bg-slate-700 hover:bg-slate-600 text-slate-200'
                        : 'w-6 sm:w-8 bg-slate-800 hover:bg-slate-700 text-slate-100'
                    } ${
                      isCurrentlyActive
                        ? 'translate-y-0.5 bg-emerald-600 text-white shadow-inner ring-2 ring-emerald-400'
                        : 'border-b-2 border-slate-950 active:translate-y-0.5'
                    }`}
                  >
                    {k === 'Space' ? 'DẤU CÁCH (SPACE)' : k}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Foot bumpers */}
        <div className="mt-1 flex justify-between px-2 text-[9px] text-slate-500 font-mono">
          <span>● BÉ CÓ THỂ GÕ PHÍM TRÊN BÀN PHÍM THẬT HOẶC NHẤP VÀO ĐÂY</span>
          <span>USB ⌨</span>
        </div>
      </div>
    </div>
  );
};
