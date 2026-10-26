import React, { useState } from 'react';
import { Power, RotateCcw, Disc3, Sparkles } from 'lucide-react';
import { soundEngine } from '../audio/soundEffects';
import { ComputerState } from '../types/computer';

interface Props {
  computerState: ComputerState;
  onPressPower: () => void;
  onPressReset: () => void;
  highlightPower?: boolean;
  highlightReset?: boolean;
}

export const ComputerTower: React.FC<Props> = ({
  computerState,
  onPressPower,
  onPressReset,
  highlightPower,
  highlightReset,
}) => {
  const [isPowerPressed, setIsPowerPressed] = useState<boolean>(false);
  const [isResetPressed, setIsResetPressed] = useState<boolean>(false);

  const isPoweredOn = computerState !== 'off';

  const handlePowerClick = () => {
    setIsPowerPressed(true);
    soundEngine.playPowerClick();
    setTimeout(() => setIsPowerPressed(false), 200);
    onPressPower();
  };

  const handleResetClick = () => {
    setIsResetPressed(true);
    soundEngine.playResetClick();
    setTimeout(() => setIsResetPressed(false), 200);
    onPressReset();
  };

  return (
    <div className="relative flex flex-col items-center select-none group">
      {/* Component Title badge for Kids */}
      <div className="mb-2 flex items-center gap-1.5 px-3 py-1 bg-slate-800/80 backdrop-blur rounded-full border border-slate-700/60 shadow-md">
        <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
        <span className="text-xs font-bold text-slate-200">Thân máy tính (CPU)</span>
      </div>

      {/* Main Tower Case Frame */}
      <div className="relative w-44 sm:w-52 h-[340px] sm:h-[400px] bg-gradient-to-b from-slate-800 via-slate-900 to-zinc-950 rounded-2xl shadow-2xl border-2 border-slate-700/80 p-3 sm:p-4 flex flex-col justify-between overflow-hidden">
        {/* Subtle metallic sheen & side chamfer */}
        <div className="absolute top-0 right-0 w-2.5 h-full bg-gradient-to-b from-slate-700/50 via-slate-800/30 to-black/80 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

        {/* TOP SECTION: Power & Reset control panel */}
        <div className="relative bg-slate-950/80 rounded-xl p-3 border border-slate-800 shadow-inner flex flex-col items-center">
          {/* Subtle brand tag */}
          <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-2">
            TIN HỌC TIỂU HỌC
          </div>

          <div className="flex items-center justify-around w-full px-1">
            {/* POWER BUTTON (MAIN HERO INTERACTION) */}
            <div className="flex flex-col items-center gap-1 relative">
              {/* Radial ambient glow behind button when powered on */}
              {isPoweredOn && (
                <div
                  className={`absolute -inset-3 rounded-full blur-md pointer-events-none transition-opacity duration-500 ${
                    computerState === 'sleep'
                      ? 'bg-amber-400/30 animate-pulse'
                      : 'bg-cyan-400/40 animate-pulse'
                  }`}
                />
              )}

              <button
                id="pc-power-button"
                onClick={handlePowerClick}
                title="Nhấn để bật / tắt máy tính"
                className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer ${
                  isPowerPressed
                    ? 'scale-90 shadow-inner translate-y-1 bg-gradient-to-br from-slate-900 to-black ring-4 ring-cyan-400'
                    : isPoweredOn
                    ? computerState === 'sleep'
                      ? 'bg-gradient-to-b from-amber-900/60 to-slate-900 ring-4 ring-amber-400 shadow-[0_0_20px_#f59e0b,0_0_40px_#d97706]'
                      : 'bg-gradient-to-b from-slate-800 to-slate-950 ring-4 ring-cyan-400 shadow-[0_0_25px_#22d3ee,0_0_50px_#06b6d4,inset_0_0_15px_#22d3ee] hover:scale-105 active:scale-95'
                    : 'bg-gradient-to-b from-slate-600 via-slate-700 to-slate-800 hover:from-slate-500 hover:to-slate-700 hover:scale-105 active:scale-95 ring-1 ring-white/20 shadow-lg'
                } ${
                  highlightPower
                    ? 'ring-4 ring-emerald-400 ring-offset-2 ring-offset-slate-900 animate-bounce'
                    : ''
                }`}
              >
                {/* 3D button bezel rim */}
                <div
                  className={`absolute inset-1 rounded-full flex items-center justify-center border transition-all ${
                    isPoweredOn
                      ? computerState === 'sleep'
                        ? 'bg-slate-950 border-amber-400/80 shadow-[inset_0_0_12px_#f59e0b]'
                        : 'bg-slate-950 border-cyan-300 shadow-[inset_0_0_14px_#22d3ee]'
                      : 'bg-gradient-to-b from-slate-800 via-slate-900 to-zinc-900 border-white/20'
                  }`}
                >
                  <Power
                    className={`w-7 h-7 sm:w-8 sm:h-8 transition-all duration-300 ${
                      isPoweredOn
                        ? computerState === 'sleep'
                          ? 'text-amber-300 drop-shadow-[0_0_12px_#f59e0b]'
                          : 'text-cyan-200 drop-shadow-[0_0_14px_#22d3ee] drop-shadow-[0_0_25px_#38bdf8]'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  />
                </div>
              </button>
              <span
                className={`text-[11px] font-bold mt-1 tracking-wide transition-colors ${
                  isPoweredOn
                    ? computerState === 'sleep'
                      ? 'text-amber-300 drop-shadow-[0_0_6px_#f59e0b]'
                      : 'text-cyan-300 drop-shadow-[0_0_8px_#22d3ee]'
                    : 'text-slate-400'
                }`}
              >
                Nút Nguồn (⏻)
              </span>
            </div>

            {/* RESET BUTTON */}
            <div className="flex flex-col items-center gap-1">
              <button
                id="pc-reset-button"
                onClick={handleResetClick}
                disabled={!isPoweredOn}
                title={isPoweredOn ? 'Nhấn để khởi động lại máy (Reset)' : 'Chỉ bấm khi máy đang bật'}
                className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-150 shadow-md ${
                  isResetPressed
                    ? 'scale-90 translate-y-0.5 bg-black'
                    : isPoweredOn
                    ? 'bg-gradient-to-b from-slate-700 to-slate-800 hover:from-amber-600 hover:to-amber-700 hover:scale-105 active:scale-95 cursor-pointer ring-2 ring-amber-400/80 shadow-[0_0_10px_#f59e0b]'
                    : 'bg-slate-800 opacity-40 cursor-not-allowed'
                } ${highlightReset ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-slate-900 animate-pulse' : ''}`}
              >
                <div className="absolute inset-0.5 rounded-full bg-slate-900 flex items-center justify-center border border-white/10">
                  <RotateCcw className={`w-4 h-4 ${isPoweredOn ? 'text-amber-400' : 'text-slate-500'}`} />
                </div>
              </button>
              <span className="text-[10px] font-semibold text-slate-400 mt-1">
                Nút Reset (🔄)
              </span>
            </div>
          </div>

          {/* STATUS LED INDICATORS (Ultra bright glow when on) */}
          <div className="mt-3 w-full bg-slate-900/90 rounded-lg py-1.5 px-3 border border-slate-800/80 flex items-center justify-between text-[10px]">
            {/* Power LED */}
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  !isPoweredOn
                    ? 'bg-slate-700'
                    : computerState === 'sleep'
                    ? 'bg-amber-400 shadow-[0_0_12px_#f59e0b,0_0_25px_#d97706] animate-pulse ring-2 ring-amber-200'
                    : 'bg-emerald-300 shadow-[0_0_14px_#34d399,0_0_28px_#10b981,0_0_40px_#059669] ring-2 ring-emerald-100 animate-pulse'
                }`}
              />
              <span className={isPoweredOn ? 'text-emerald-300 font-extrabold' : 'text-slate-500 font-medium'}>
                {computerState === 'sleep' ? 'Đèn ngủ (Cam)' : isPoweredOn ? 'Đèn nguồn (Sáng xanh)' : 'Đèn nguồn (Tắt)'}
              </span>
            </div>

            {/* HDD / SSD activity LED */}
            <div className="flex items-center gap-1.5">
              <div
                className={`w-2 h-2 rounded-full transition-all duration-150 ${
                  isPoweredOn && (computerState === 'booting_windows' || computerState === 'booting_bios')
                    ? 'bg-amber-400 shadow-[0_0_10px_#f59e0b] animate-ping'
                    : isPoweredOn
                    ? 'bg-amber-500/60'
                    : 'bg-slate-800'
                }`}
              />
              <span className="text-slate-500">Ổ đĩa</span>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: Optical drive slot + Front I/O Ports */}
        <div className="my-2 space-y-2">
          {/* CD/DVD Tray simulation */}
          <div className="h-6 bg-slate-950 rounded-md border border-slate-800 flex items-center justify-between px-2.5 text-[9px] text-slate-500">
            <span className="flex items-center gap-1">
              <Disc3 className="w-3 h-3 text-slate-600" /> Ổ ĐĨA CD/DVD
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
          </div>

          {/* USB & Audio Ports */}
          <div className="h-7 bg-slate-950/70 rounded-md border border-slate-800 flex items-center justify-around px-2">
            <div className="w-3.5 h-1.5 bg-blue-600/80 rounded-xs border border-blue-400/50 shadow-inner" title="USB 3.0" />
            <div className="w-3.5 h-1.5 bg-blue-600/80 rounded-xs border border-blue-400/50 shadow-inner" title="USB 3.0" />
            <div className="w-2 h-2 rounded-full bg-pink-500/80 border border-pink-400" title="Cổng Mic" />
            <div className="w-2 h-2 rounded-full bg-emerald-500/80 border border-emerald-400" title="Cổng Tai nghe" />
          </div>
        </div>

        {/* BOTTOM SECTION: Cooling Fan & Grille with Spinning blades & RGB glow */}
        <div className="relative h-28 sm:h-32 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden">
          {/* Subtle intake glow */}
          <div
            className={`absolute inset-0 transition-opacity duration-700 ${
              isPoweredOn
                ? 'opacity-80 bg-gradient-to-tr from-cyan-900/30 via-transparent to-blue-900/20'
                : 'opacity-0'
            }`}
          />

          {/* Fan circular frame */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-slate-700/60 bg-slate-900/90 flex items-center justify-center shadow-inner">
            {/* Spinning Fan Blades */}
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center transition-all ${
                isPoweredOn ? 'animate-spin' : ''
              }`}
              style={{
                animationDuration: isPoweredOn ? '0.4s' : '0s',
                animationTimingFunction: 'linear',
              }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* 7 curved cooling fan blades */}
                {[0, 51.4, 102.8, 154.2, 205.7, 257.1, 308.5].map((angle, i) => (
                  <path
                    key={i}
                    d="M 50 50 Q 65 30 85 45 Q 65 60 50 50"
                    fill={isPoweredOn ? '#38bdf8' : '#475569'}
                    fillOpacity={isPoweredOn ? '0.75' : '0.4'}
                    transform={`rotate(${angle} 50 50)`}
                  />
                ))}
                {/* Central hub */}
                <circle cx="50" cy="50" r="14" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                {isPoweredOn && (
                  <circle cx="50" cy="50" r="5" fill="#38bdf8" className="animate-ping" />
                )}
              </svg>
            </div>

            {/* Honeycomb protection mesh overlay */}
            <div className="absolute inset-0 rounded-full border border-slate-600/40 pointer-events-none flex items-center justify-center">
              <div className="w-full h-full rounded-full opacity-30 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:6px_6px]" />
            </div>
          </div>

          {/* Fan status indicator caption */}
          <div className="absolute bottom-1 text-[9px] font-semibold text-slate-500">
            {isPoweredOn ? 'Quạt tản nhiệt đang chạy' : 'Quạt đang nghỉ'}
          </div>
        </div>

        {/* Rubber Feet */}
        <div className="absolute -bottom-1 left-4 w-6 h-1.5 bg-black rounded-b-md" />
        <div className="absolute -bottom-1 right-4 w-6 h-1.5 bg-black rounded-b-md" />
      </div>
    </div>
  );
};
