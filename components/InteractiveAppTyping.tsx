import React, { useState, useEffect } from 'react';
import { Keyboard, X, Sparkles, Volume2, RotateCcw } from 'lucide-react';
import { soundEngine } from '../audio/soundEffects';

interface Props {
  onClose: () => void;
  lastPhysicalKey?: string | null;
}

const SAMPLE_WORDS = ['BA', 'ME', 'BE', 'HOA', 'CA', 'BAN', 'BUT', 'MAY', 'TINH'];

export const InteractiveAppTyping: React.FC<Props> = ({ onClose, lastPhysicalKey }) => {
  const [text, setText] = useState<string>('CHAO BE LOP 1');
  const [targetWordIndex, setTargetWordIndex] = useState<number>(0);

  const currentTarget = SAMPLE_WORDS[targetWordIndex];

  // Update when user presses physical keyboard while app is open
  useEffect(() => {
    if (!lastPhysicalKey) return;
    handleKeyPress(lastPhysicalKey);
  }, [lastPhysicalKey]);

  const handleKeyPress = (key: string) => {
    soundEngine.playKeyPress();
    if (key === 'Backspace') {
      setText((prev) => prev.slice(0, -1));
    } else if (key === 'Space' || key === ' ') {
      setText((prev) => prev + ' ');
    } else if (key.length === 1) {
      setText((prev) => (prev + key).toUpperCase().slice(-30));
    }
  };

  const handleNextWord = () => {
    soundEngine.playCelebration();
    setTargetWordIndex((prev) => (prev + 1) % SAMPLE_WORDS.length);
    setText('');
  };

  const clearText = () => {
    soundEngine.playResetClick();
    setText('');
  };

  return (
    <div className="absolute inset-2 sm:inset-4 bg-slate-50 rounded-lg shadow-2xl border-2 border-indigo-400 flex flex-col overflow-hidden z-20">
      {/* Title Bar */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-1.5 flex items-center justify-between text-white select-none">
        <div className="flex items-center gap-2">
          <Keyboard className="w-4 h-4 text-amber-300" />
          <span className="font-bold text-xs sm:text-sm tracking-wide">Bé Tập Gõ Bàn Phím (Typing)</span>
        </div>
        <button
          onClick={() => {
            soundEngine.playMouseClick();
            onClose();
          }}
          className="w-6 h-6 rounded flex items-center justify-center hover:bg-red-500 transition-colors text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Interactive Screen */}
      <div className="flex-1 p-3 flex flex-col items-center justify-between bg-gradient-to-b from-teal-50 to-emerald-50">
        {/* Practice Challenge Card */}
        <div className="w-full bg-white rounded-xl p-3 border border-emerald-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-emerald-800">Từ mẫu bé hãy tập gõ:</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-widest mt-0.5">
              {currentTarget}
            </div>
          </div>
          <button
            onClick={handleNextWord}
            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-xs shadow transition-transform active:scale-95 flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" /> Đổi từ khác
          </button>
        </div>

        {/* Big Display Area */}
        <div className="w-full my-2 bg-white rounded-xl border-2 border-emerald-300 p-3 min-h-[90px] flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
          <div className="text-2xl sm:text-4xl font-black text-slate-800 tracking-wider break-all text-center">
            {text ? text : <span className="text-slate-300 font-normal text-lg italic">Bấm phím để gõ chữ vào đây nhé...</span>}
            <span className="inline-block w-2 sm:w-3 h-6 sm:h-8 bg-emerald-500 ml-1 animate-pulse" />
          </div>
        </div>

        {/* Quick Letter Buttons for touch/click */}
        <div className="w-full bg-white/80 backdrop-blur rounded-xl p-2 border border-emerald-100 flex flex-col gap-1.5">
          <div className="text-[11px] text-slate-500 font-medium text-center">
            Bé có thể gõ trực tiếp bàn phím bên dưới hoặc bấm các chữ cái này:
          </div>
          <div className="flex flex-wrap justify-center gap-1">
            {['A', 'B', 'C', 'D', 'E', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Y'].map((char) => (
              <button
                key={char}
                onClick={() => handleKeyPress(char)}
                className="w-7 h-7 sm:w-8 sm:h-8 bg-white hover:bg-emerald-100 active:bg-emerald-200 border-b-2 border-emerald-300 rounded font-bold text-slate-700 text-xs sm:text-sm shadow-sm transition-transform active:translate-y-0.5 flex items-center justify-center"
              >
                {char}
              </button>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-1">
            <button
              onClick={() => handleKeyPress(' ')}
              className="px-6 py-1 bg-amber-100 hover:bg-amber-200 border-b-2 border-amber-300 rounded text-xs font-bold text-amber-900 active:translate-y-0.5"
            >
              Phím Cách (Space)
            </button>
            <button
              onClick={() => handleKeyPress('Backspace')}
              className="px-3 py-1 bg-slate-200 hover:bg-slate-300 border-b-2 border-slate-400 rounded text-xs font-bold text-slate-700 active:translate-y-0.5"
            >
              Xóa (Backspace)
            </button>
            <button
              onClick={clearText}
              className="px-3 py-1 bg-red-100 hover:bg-red-200 border-b-2 border-red-300 rounded text-xs font-bold text-red-700 active:translate-y-0.5 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Làm mới
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
