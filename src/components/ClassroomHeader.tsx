import React from 'react';
import { Volume2, VolumeX, Sparkles, BookOpen, HelpCircle, Laptop } from 'lucide-react';
import { soundEngine } from '../audio/soundEffects';
import { AppMode } from '../types/computer';

interface Props {
  mode: AppMode;
  onSetMode: (mode: AppMode) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  onOpenQuiz: () => void;
}

export const ClassroomHeader: React.FC<Props> = ({
  mode,
  onSetMode,
  soundEnabled,
  onToggleSound,
  voiceEnabled,
  onToggleVoice,
  onOpenQuiz,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-4 sm:px-6 py-2.5 bg-slate-900/95 border-b border-slate-800 text-white z-40 select-none">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
        <span className="text-xl">💻</span>
        <h1 className="text-base sm:text-lg font-black tracking-tight text-amber-300">
          Bé Học Bật Và Tắt Máy Tính
        </h1>
      </div>

      {/* Zone 2: Navigation Links / Mode Segmented Controller */}
      <nav className="flex items-center gap-2 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 overflow-x-auto">
        <button
          onClick={() => {
            soundEngine.playMouseClick();
            onSetMode('sandbox');
          }}
          className={`px-3 py-1 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            mode === 'sandbox'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
          }`}
        >
          <Laptop className="w-3.5 h-3.5" />
          <span>Tự do thực hành</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playMouseClick();
            onSetMode('guided');
            soundEngine.speakVietnamese('Chào mừng bé đến với bài học bật và tắt máy tính!');
          }}
          className={`px-3 py-1 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            mode === 'guided'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Bài học theo bước</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playMouseClick();
            onOpenQuiz();
          }}
          className="px-3 py-1 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 text-slate-300 hover:text-white hover:bg-slate-700/50"
        >
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Đố vui có thưởng</span>
        </button>
      </nav>

      {/* Zone 3: 1 Primary Actions Group (Sound + Speech toggle) */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Voice hint toggle */}
        <button
          onClick={onToggleVoice}
          title={voiceEnabled ? 'Tắt đọc tiếng Việt' : 'Bật đọc tiếng Việt'}
          className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all whitespace-nowrap shrink-0 flex items-center gap-1 ${
            voiceEnabled
              ? 'bg-indigo-600/50 border-indigo-400 text-indigo-200'
              : 'bg-slate-800 border-slate-700 text-slate-400'
          }`}
        >
          <span>🗣️</span>
          <span className="hidden sm:inline">{voiceEnabled ? 'Giọng đọc: Bật' : 'Giọng đọc: Tắt'}</span>
        </button>

        {/* Audio FX toggle */}
        <button
          onClick={onToggleSound}
          title={soundEnabled ? 'Tắt âm thanh hiệu ứng' : 'Bật âm thanh hiệu ứng'}
          className={`p-1.5 rounded-lg border transition-all whitespace-nowrap shrink-0 ${
            soundEnabled
              ? 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700'
              : 'bg-slate-800 border-slate-700 text-slate-500'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
