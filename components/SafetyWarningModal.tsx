import React from 'react';
import { AlertTriangle, X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../audio/soundEffects';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirmHardPowerOff: () => void;
}

export const SafetyWarningModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirmHardPowerOff,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-3 animate-in fade-in duration-150">
      <div className="bg-slate-900 border-2 border-red-500 rounded-3xl max-w-md w-full p-5 text-white shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500 flex items-center justify-center text-red-400 shrink-0">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-red-400">
              CẢNH BÁO AN TOÀN!
            </h3>
            <span className="text-xs text-slate-300">
              Nhấn giữ hoặc bấm nút nguồn khi máy đang chạy
            </span>
          </div>
        </div>

        <div className="bg-red-950/40 border border-red-900/60 rounded-xl p-3 text-xs text-slate-200 space-y-2 mb-4 leading-relaxed">
          <p>
            Bé ơi, khi máy tính đang hoạt động bình thường,{' '}
            <strong className="text-red-300">KHÔNG ĐƯỢC</strong> bấm nút nguồn trên thân máy hoặc tự ý rút dây điện nhé!
          </p>
          <p className="text-amber-300">
            ⚠️ <strong>Tác hại:</strong> Máy tính sẽ bị tắt đột ngột, có thể làm mất bài vẽ, bài gõ chữ và làm hỏng ổ cứng bên trong thân máy.
          </p>
          <div className="pt-1 text-emerald-300 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Cách đúng: Nhấp chuột vào nút Start → Chọn Power → Chọn Tắt máy (Shut down).</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 text-xs font-bold">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow transition-transform active:scale-95"
          >
            Con đã hiểu rồi ạ!
          </button>
          <button
            onClick={() => {
              onConfirmHardPowerOff();
              onClose();
            }}
            className="px-3 py-2 bg-slate-800 hover:bg-red-950 hover:text-red-300 text-slate-400 rounded-xl border border-slate-700 transition-colors"
          >
            Thử tắt cưỡng bức
          </button>
        </div>
      </div>
    </div>
  );
};
