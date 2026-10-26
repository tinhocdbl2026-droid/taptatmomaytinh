import React from 'react';
import { Moon, Power, RotateCcw, X, Sparkles, Zap, Eye, CheckCircle2, Volume2 } from 'lucide-react';
import { soundEngine } from '../audio/soundEffects';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onTrySleepMode: () => void;
}

export const SleepExplainerModal: React.FC<Props> = ({ isOpen, onClose, onTrySleepMode }) => {
  if (!isOpen) return null;

  const handleReadAloud = () => {
    soundEngine.speakVietnamese(
      'Chế độ Ngủ Sleep giống như máy tính chợp mắt đi ngủ trưa một lát vậy! Khi bé nghỉ giải lao để uống nước hoặc ra chơi, màn hình sẽ tạm tắt để tiết kiệm điện. Khi bé quay lại, chỉ cần bấm một phím hoặc lắc nhẹ chuột là máy tính thức dậy ngay lập tức!'
    );
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-3 animate-in fade-in duration-150">
      <div className="bg-slate-900 border-2 border-indigo-400 rounded-3xl max-w-lg w-full p-4 sm:p-6 text-white shadow-2xl relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => {
            soundEngine.playMouseClick();
            onClose();
          }}
          className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400 flex items-center justify-center text-amber-300 text-2xl shrink-0 shadow-inner">
            🌙
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-amber-300">
                Nút Sleep (Chế độ Ngủ) Để Làm Gì?
              </h2>
              <button
                onClick={handleReadAloud}
                className="p-1 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white"
                title="Nghe cô giáo đọc"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="text-xs text-indigo-200">
              Dành riêng cho các bạn học sinh Lớp 1
            </span>
          </div>
        </div>

        {/* Kid-friendly Definition */}
        <div className="bg-indigo-950/60 border border-indigo-800 rounded-2xl p-3.5 mb-3 space-y-2 text-xs sm:text-sm text-slate-200 leading-relaxed">
          <div className="flex items-start gap-2">
            <span className="text-lg shrink-0">😴</span>
            <p>
              <strong>Chế độ Ngủ (Sleep)</strong> giống như chiếc máy tính được{' '}
              <span className="text-amber-300 font-bold">chợp mắt đi ngủ trưa một lát</span> khi bé tạm dừng học!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-indigo-900">
              <Zap className="w-4 h-4 text-amber-400 mb-1" />
              <div className="font-bold text-amber-300">Tiết kiệm điện</div>
              <div className="text-[11px] text-slate-400">Màn hình tạm tắt, máy tính chỉ dùng rất ít điện.</div>
            </div>

            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-indigo-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mb-1" />
              <div className="font-bold text-emerald-300">Giữ nguyên bài tập</div>
              <div className="text-[11px] text-slate-400">Tranh vẽ và chữ bé vừa gõ không bị mất đi.</div>
            </div>

            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-indigo-900">
              <Sparkles className="w-4 h-4 text-cyan-400 mb-1" />
              <div className="font-bold text-cyan-300">Thức dậy tức thì</div>
              <div className="text-[11px] text-slate-400">Chỉ cần bấm một phím hoặc lắc chuột là mở lại ngay!</div>
            </div>
          </div>
        </div>

        {/* Comparison: Sleep vs Shut Down */}
        <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-3 mb-4 text-xs space-y-1.5">
          <div className="font-bold text-slate-200 flex items-center gap-1.5">
            <span>💡 Khi nào dùng Sleep và khi nào dùng Shut down?</span>
          </div>
          <div className="text-slate-300 text-[11px] space-y-1">
            <p>
              • <strong className="text-indigo-300">Dùng Sleep (Ngủ):</strong> Khi bé nghỉ giải lao 5 - 15 phút để uống nước, đi vệ sinh hoặc ra chơi giữa tiết.
            </p>
            <p>
              • <strong className="text-red-300">Dùng Shut down (Tắt máy):</strong> Khi hết giờ học, bé tắt máy tính hoàn toàn để tan học ra về.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={() => {
              soundEngine.playMouseClick();
              onClose();
            }}
            className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
          >
            Đóng lại
          </button>

          <button
            onClick={() => {
              soundEngine.playMouseClick();
              onClose();
              onTrySleepMode();
            }}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-1.5"
          >
            <Moon className="w-4 h-4 text-amber-300" />
            <span>Thử cho máy tính đi ngủ (Sleep)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
