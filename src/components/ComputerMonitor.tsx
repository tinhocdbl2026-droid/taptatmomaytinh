import React, { useState, useEffect } from 'react';
import {
  Power,
  RotateCcw,
  Moon,
  Monitor as MonitorIcon,
  HelpCircle,
  Clock,
  Wifi,
  Volume2,
  Sparkles,
  Trash2,
  FastForward,
  Bell,
  Zap,
} from 'lucide-react';
import { ComputerState, ActiveApp } from '../types/computer';
import { soundEngine } from '../audio/soundEffects';
import { InteractiveAppPaint } from './InteractiveAppPaint';
import { InteractiveAppTyping } from './InteractiveAppTyping';
import { InteractiveAppLesson } from './InteractiveAppLesson';

interface Props {
  computerState: ComputerState;
  onInitiateShutdown: () => void;
  onInitiateRestart: () => void;
  onInitiateSleep: () => void;
  onWakeFromSleep: () => void;
  onOpenSleepExplainer: () => void;
  bootCountdown?: number;
  onSkipBoot?: () => void;
  lastPhysicalKey?: string | null;
  highlightStartButton?: boolean;
}

export const ComputerMonitor: React.FC<Props> = ({
  computerState,
  onInitiateShutdown,
  onInitiateRestart,
  onInitiateSleep,
  onWakeFromSleep,
  onOpenSleepExplainer,
  bootCountdown = 0,
  onSkipBoot,
  lastPhysicalKey,
  highlightStartButton,
}) => {
  const [monitorPower, setMonitorPower] = useState<boolean>(true);
  const [startMenuOpen, setStartMenuOpen] = useState<boolean>(false);
  const [powerSubmenuOpen, setPowerSubmenuOpen] = useState<boolean>(false);
  const [activeApp, setActiveApp] = useState<ActiveApp>('none');
  const [currentTime, setCurrentTime] = useState<string>('08:30');

  // Real clock ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close menus if PC shuts down or sleeps
  useEffect(() => {
    if (computerState === 'off' || computerState === 'shutting_down' || computerState === 'sleep') {
      setStartMenuOpen(false);
      setPowerSubmenuOpen(false);
    }
  }, [computerState]);

  const toggleMonitorPower = () => {
    soundEngine.playPowerClick();
    setMonitorPower((prev) => !prev);
  };

  const handleStartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playMouseClick();
    setStartMenuOpen((prev) => !prev);
    setPowerSubmenuOpen(false);
  };

  const handlePowerMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playMouseClick();
    setPowerSubmenuOpen((prev) => !prev);
  };

  const handleSelectShutdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playMouseClick();
    setStartMenuOpen(false);
    setPowerSubmenuOpen(false);
    onInitiateShutdown();
  };

  const handleSelectRestart = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playMouseClick();
    setStartMenuOpen(false);
    setPowerSubmenuOpen(false);
    onInitiateRestart();
  };

  const handleSelectSleep = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playMouseClick();
    setStartMenuOpen(false);
    setPowerSubmenuOpen(false);
    onInitiateSleep();
  };

  // Determine monitor screen display status
  const isScreenLit = monitorPower && computerState !== 'off';
  const isStandby = monitorPower && computerState === 'off';

  // Compute boot progress percent (45s total)
  const bootProgressPercent = Math.min(100, Math.round(((45 - bootCountdown) / 45) * 100));

  return (
    <div className="relative flex flex-col items-center select-none group">
      {/* Component Title badge for Kids */}
      <div className="mb-2 flex items-center gap-1.5 px-3 py-1 bg-slate-800/80 backdrop-blur rounded-full border border-slate-700/60 shadow-md">
        <span className="w-2 h-2 rounded-full bg-blue-400"></span>
        <span className="text-xs font-bold text-slate-200">Màn hình máy tính (Monitor)</span>
      </div>

      {/* Outer Monitor Frame (Chassis) */}
      <div className="relative w-[340px] sm:w-[540px] md:w-[620px] lg:w-[680px] h-[230px] sm:h-[350px] md:h-[390px] lg:h-[430px] bg-gradient-to-b from-slate-800 via-slate-900 to-black rounded-2xl shadow-2xl border-4 border-slate-700/80 p-2 sm:p-3 flex flex-col justify-between">
        {/* Subtle camera at top bezel */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center">
            <div className="w-0.5 h-0.5 rounded-full bg-blue-900" />
          </div>
        </div>

        {/* INNER SCREEN DISPLAY AREA (16:9 Glass Panel) */}
        <div
          onClick={() => {
            if (computerState === 'sleep') {
              onWakeFromSleep();
              return;
            }
            if (startMenuOpen) {
              setStartMenuOpen(false);
              setPowerSubmenuOpen(false);
            }
          }}
          className={`relative w-full h-[calc(100%-26px)] rounded-lg overflow-hidden transition-all duration-500 shadow-inner ${
            !monitorPower
              ? 'bg-black'
              : computerState === 'off'
              ? 'bg-gradient-to-b from-slate-950 to-black'
              : computerState === 'sleep'
              ? 'bg-slate-950'
              : 'bg-slate-900'
          }`}
        >
          {/* Glass glare effect */}
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/5 via-transparent to-transparent pointer-events-none z-30" />

          {/* 1. MONITOR OFF */}
          {!monitorPower && (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-700">
              <span className="text-xs">Màn hình đang tắt nguồn</span>
            </div>
          )}

          {/* 2. COMPUTER OFF (Standby) */}
          {monitorPower && computerState === 'off' && (
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
              <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-3">
                <Power className="w-6 h-6 text-slate-600" />
              </div>
              <p className="text-amber-400/90 font-bold text-sm sm:text-base animate-pulse">
                Em hãy nhấn nút nguồn trên thân máy để bật máy tính nhé!
              </p>
              <p className="text-slate-500 text-xs mt-1">
                (Nút tròn to có biểu tượng ⏻ trên thùng máy bên cạnh)
              </p>
            </div>
          )}

          {/* 3. COMPUTER IN SLEEP MODE (CHẾ ĐỘ NGỦ) */}
          {monitorPower && computerState === 'sleep' && (
            <div
              onClick={onWakeFromSleep}
              className="w-full h-full bg-gradient-to-b from-slate-950 via-indigo-950/70 to-slate-950 text-white flex flex-col items-center justify-center p-4 sm:p-6 cursor-pointer select-none relative overflow-hidden"
            >
              {/* Starry night & Moon */}
              <div className="w-16 h-16 rounded-full bg-amber-200/90 shadow-[0_0_35px_#fde68a] flex items-center justify-center text-3xl mb-3 animate-pulse">
                🌙
              </div>

              <div className="flex items-center gap-2 text-indigo-300 font-extrabold text-xs sm:text-sm tracking-wider uppercase mb-1">
                <span>💤 Máy tính đang trong chế độ ngủ (Sleep)</span>
              </div>

              <p className="text-slate-300 text-xs text-center max-w-md leading-relaxed mb-4">
                Màn hình tạm nghỉ để <strong className="text-amber-300">tiết kiệm điện</strong> và bảo vệ mắt.
                Các bài vẽ và tài liệu của bé vẫn được giữ nguyên an toàn!
              </p>

              {/* Wake up prompt */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onWakeFromSleep();
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2 animate-bounce"
              >
                <Bell className="w-4 h-4" />
                <span>Nhấp chuột hoặc gõ phím để đánh thức máy tính</span>
              </button>
            </div>
          )}

          {/* 4. BOOTING SCREEN (~45 SECONDS OBSERVATION SEQUENCE) */}
          {monitorPower && (computerState === 'booting_bios' || computerState === 'booting_windows') && (
            <div className="w-full h-full bg-slate-950 text-white flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden select-none">
              {/* Top Countdown Banner for 45s observation */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 z-10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-xs font-bold text-cyan-300">
                    Đang khởi động ({bootCountdown} giây còn lại)
                  </span>
                </div>

                {onSkipBoot && (
                  <button
                    onClick={onSkipBoot}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors border border-slate-700 shadow"
                    title="Bỏ qua chờ đợi và vào màn hình Desktop ngay"
                  >
                    <FastForward className="w-3.5 h-3.5 text-amber-400" />
                    <span>Tua nhanh</span>
                  </button>
                )}
              </div>

              {/* Center Stage: BIOS Hardware Inspection (first 13s) vs Windows Loader (next 25s) vs Welcome (last 7s) */}
              <div className="flex-1 flex flex-col items-center justify-center my-2">
                {bootCountdown > 32 ? (
                  /* Stage 1: Hardware Self-Test (BIOS) */
                  <div className="font-mono text-left max-w-md w-full bg-black/60 p-3 sm:p-4 rounded-xl border border-slate-800 text-xs space-y-1.5">
                    <div className="text-cyan-400 font-bold text-sm sm:text-base flex items-center gap-2 pb-1 border-b border-slate-800">
                      <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                      <span>KIỂM TRA PHẦN CỨNG MÁY TÍNH (BIOS)</span>
                    </div>
                    <div className="text-emerald-400">✓ Bộ vi xử lý CPU: Hoạt động tốt</div>
                    <div className="text-emerald-400">✓ Bộ nhớ RAM 8GB: Sẵn sàng</div>
                    <div className="text-emerald-400">✓ Ổ cứng SSD: Đã kết nối</div>
                    <div className="text-emerald-400">✓ Bàn phím & Chuột: Đã nhận tín hiệu</div>
                    <div className="text-amber-300 animate-pulse mt-2">
                      ► Đang nạp hệ điều hành Windows... Vui lòng quan sát kỹ!
                    </div>
                  </div>
                ) : bootCountdown > 6 ? (
                  /* Stage 2: Windows Booting Screen with Rotating Dots */
                  <div className="flex flex-col items-center text-center">
                    {/* Windows 4-Square Logo */}
                    <div className="grid grid-cols-2 gap-1.5 mb-6">
                      <div className="w-7 h-7 sm:w-9 sm:h-9 bg-blue-500 rounded-xs shadow-md" />
                      <div className="w-7 h-7 sm:w-9 sm:h-9 bg-blue-400 rounded-xs shadow-md" />
                      <div className="w-7 h-7 sm:w-9 sm:h-9 bg-blue-600 rounded-xs shadow-md" />
                      <div className="w-7 h-7 sm:w-9 sm:h-9 bg-blue-300 rounded-xs shadow-md" />
                    </div>

                    {/* Windows Spinning Dots */}
                    <div className="relative w-11 h-11 sm:w-13 sm:h-13 mb-4">
                      <div className="w-full h-full animate-spin [animation-duration:1.4s]">
                        <svg viewBox="0 0 50 50" className="w-full h-full">
                          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                            <circle
                              key={i}
                              cx={25 + 18 * Math.cos((deg * Math.PI) / 180)}
                              cy={25 + 18 * Math.sin((deg * Math.PI) / 180)}
                              r={2.5}
                              fill="#ffffff"
                              opacity={0.2 + (i / 8) * 0.8}
                            />
                          ))}
                        </svg>
                      </div>
                    </div>

                    <div className="text-sm sm:text-base font-bold text-slate-100">
                      {bootCountdown > 20
                        ? 'Đang khởi động hệ điều hành Windows...'
                        : 'Đang chuẩn bị môi trường học tập Tin học Lớp 1...'}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Học sinh kiên nhẫn quan sát, không bấm lung tung khi máy đang tải nhé!
                    </div>
                  </div>
                ) : (
                  /* Stage 3: Welcome Screen */
                  <div className="flex flex-col items-center text-center animate-in fade-in">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 to-rose-400 flex items-center justify-center text-3xl mb-3 shadow-lg">
                      👧
                    </div>
                    <div className="text-lg sm:text-xl font-black text-amber-300">
                      Xin chào các bạn học sinh Lớp 1!
                    </div>
                    <div className="text-xs text-slate-300 mt-1">
                      Chào mừng bé bước vào thế giới Tin học kỳ thú...
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom 45-second Progress Bar */}
              <div className="w-full bg-slate-900 rounded-xl p-2.5 border border-slate-800">
                <div className="flex justify-between text-[11px] text-slate-400 mb-1 font-mono">
                  <span>Tiến trình khởi động: {bootProgressPercent}%</span>
                  <span>Thời gian quan sát: 45 giây</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full transition-all duration-1000 ease-linear rounded-full"
                    style={{ width: `${bootProgressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 5. SHUTTING DOWN SCREEN */}
          {monitorPower && computerState === 'shutting_down' && (
            <div className="w-full h-full bg-blue-900 text-white flex flex-col items-center justify-center p-6 select-none">
              {/* Windows Spinning Dots */}
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 mb-4 animate-spin [animation-duration:1.4s]">
                <svg viewBox="0 0 50 50" className="w-full h-full">
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                    <circle
                      key={i}
                      cx={25 + 18 * Math.cos((deg * Math.PI) / 180)}
                      cy={25 + 18 * Math.sin((deg * Math.PI) / 180)}
                      r={2.5}
                      fill="#ffffff"
                      opacity={0.2 + (i / 8) * 0.8}
                    />
                  ))}
                </svg>
              </div>
              <div className="text-base sm:text-xl font-bold tracking-wide">
                Đang tắt máy tính...
              </div>
              <div className="text-xs text-blue-200 mt-1">Tạm biệt bé yêu! Hẹn gặp lại bé!</div>
            </div>
          )}

          {/* 6. DESKTOP WORKSPACE (MÀN HÌNH LÀM VIỆC CHÍNH) */}
          {monitorPower && computerState === 'desktop' && (
            <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-gradient-to-br from-sky-400 via-indigo-300 to-amber-100 select-none">
              {/* Cheerful desktop wallpaper background graphics */}
              <div className="absolute inset-0 pointer-events-none opacity-40">
                {/* Rolling Green Hills & Clouds */}
                <div className="absolute bottom-6 left-0 right-0 h-28 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-[100px]" />
                <div className="absolute bottom-0 -left-10 w-96 h-24 bg-emerald-600 rounded-t-[80px]" />
                {/* Sun & Clouds */}
                <div className="absolute top-4 right-10 w-16 h-16 rounded-full bg-amber-300 shadow-[0_0_30px_#f59e0b]" />
                <div className="absolute top-8 left-16 w-24 h-8 bg-white/80 rounded-full blur-xs" />
                <div className="absolute top-12 left-28 w-20 h-7 bg-white/70 rounded-full blur-xs" />
              </div>

              {/* DESKTOP ICONS GRID */}
              <div className="relative p-2 sm:p-4 grid grid-cols-2 gap-2 sm:gap-3 w-fit z-10">
                {/* 1. Paint App */}
                <button
                  onDoubleClick={() => {
                    soundEngine.playMouseClick();
                    setActiveApp('paint');
                  }}
                  onClick={() => soundEngine.playMouseClick()}
                  className="flex flex-col items-center group/icon p-1.5 rounded-lg hover:bg-white/30 backdrop-blur-xs transition-all w-20 sm:w-22 text-center cursor-pointer"
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-white/90 rounded-xl shadow-md border border-white flex items-center justify-center group-hover/icon:scale-105 transition-transform">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] mt-1 leading-tight">
                    Bé tập vẽ
                  </span>
                </button>

                {/* 2. Typing Practice */}
                <button
                  onDoubleClick={() => {
                    soundEngine.playMouseClick();
                    setActiveApp('typing');
                  }}
                  onClick={() => soundEngine.playMouseClick()}
                  className="flex flex-col items-center group/icon p-1.5 rounded-lg hover:bg-white/30 backdrop-blur-xs transition-all w-20 sm:w-22 text-center cursor-pointer"
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-white/90 rounded-xl shadow-md border border-white flex items-center justify-center group-hover/icon:scale-105 transition-transform">
                    <span className="text-2xl">⌨️</span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] mt-1 leading-tight">
                    Tập gõ phím
                  </span>
                </button>

                {/* 3. Tin học 1 Lesson */}
                <button
                  onDoubleClick={() => {
                    soundEngine.playMouseClick();
                    setActiveApp('lesson_viewer');
                  }}
                  onClick={() => soundEngine.playMouseClick()}
                  className="flex flex-col items-center group/icon p-1.5 rounded-lg hover:bg-white/30 backdrop-blur-xs transition-all w-20 sm:w-22 text-center cursor-pointer"
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-white/90 rounded-xl shadow-md border border-white flex items-center justify-center group-hover/icon:scale-105 transition-transform">
                    <span className="text-2xl">📖</span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] mt-1 leading-tight">
                    Sổ tay Tin học
                  </span>
                </button>

                {/* 4. Sleep Explainer Shortcut on Desktop */}
                <button
                  onClick={() => {
                    soundEngine.playMouseClick();
                    onOpenSleepExplainer();
                  }}
                  className="flex flex-col items-center group/icon p-1.5 rounded-lg hover:bg-indigo-500/30 backdrop-blur-xs transition-all w-20 sm:w-22 text-center cursor-pointer"
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-indigo-600/90 text-white rounded-xl shadow-md border border-indigo-300 flex items-center justify-center group-hover/icon:scale-105 transition-transform">
                    <span className="text-xl">🌙</span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-amber-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] mt-1 leading-tight">
                    Nút Sleep là gì?
                  </span>
                </button>
              </div>

              {/* Quick Educational Floating Widget on Desktop */}
              {activeApp === 'none' && !startMenuOpen && (
                <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur rounded-xl p-2.5 border border-white/80 shadow-md text-slate-800 text-xs hidden sm:flex flex-col gap-1.5 max-w-[240px]">
                  <div className="font-bold text-indigo-900 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Các nút nguồn chính:</span>
                  </div>
                  <div className="text-[11px] text-slate-600 space-y-1">
                    <p>• <strong>Start / Power:</strong> Mở các tùy chọn nguồn</p>
                    <p>• <strong>Shut down:</strong> Tắt máy sau buổi học</p>
                    <p>• <strong>Restart:</strong> Khởi động lại khi máy đơ</p>
                    <p>• <strong>Sleep:</strong> Máy chợp mắt nghỉ giải lao</p>
                  </div>
                  <button
                    onClick={onOpenSleepExplainer}
                    className="mt-0.5 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 underline text-left"
                  >
                    👉 Bấm để xem chi tiết nút Sleep
                  </button>
                </div>
              )}

              {/* Active Windows Inside Monitor */}
              {activeApp === 'paint' && (
                <InteractiveAppPaint onClose={() => setActiveApp('none')} />
              )}
              {activeApp === 'typing' && (
                <InteractiveAppTyping
                  onClose={() => setActiveApp('none')}
                  lastPhysicalKey={lastPhysicalKey}
                />
              )}
              {activeApp === 'lesson_viewer' && (
                <InteractiveAppLesson onClose={() => setActiveApp('none')} />
              )}

              {/* START MENU POPUP */}
              {startMenuOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-9 left-2 w-64 sm:w-72 bg-slate-900/95 backdrop-blur-md rounded-xl shadow-2xl border border-slate-700 p-3 z-30 flex flex-col justify-between text-white animate-in fade-in slide-in-from-bottom-3 duration-150"
                >
                  <div>
                    {/* Header profile */}
                    <div className="flex items-center gap-2.5 pb-2.5 mb-2.5 border-b border-slate-800">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-rose-400 flex items-center justify-center text-sm font-bold shadow">
                        👧
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-100">Bé Lớp 1 Yêu Tin Học</div>
                        <div className="text-[10px] text-emerald-400">Đang hoạt động</div>
                      </div>
                    </div>

                    {/* App items in Start */}
                    <div className="space-y-1 text-xs">
                      <button
                        onClick={() => {
                          setActiveApp('paint');
                          setStartMenuOpen(false);
                          soundEngine.playMouseClick();
                        }}
                        className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-800 transition-colors text-left"
                      >
                        <span className="text-lg">🎨</span>
                        <span>Bé tập vẽ (Paint)</span>
                      </button>
                      <button
                        onClick={() => {
                          setActiveApp('typing');
                          setStartMenuOpen(false);
                          soundEngine.playMouseClick();
                        }}
                        className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-800 transition-colors text-left"
                      >
                        <span className="text-lg">⌨️</span>
                        <span>Bé tập gõ phím</span>
                      </button>
                      <button
                        onClick={() => {
                          setActiveApp('lesson_viewer');
                          setStartMenuOpen(false);
                          soundEngine.playMouseClick();
                        }}
                        className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-800 transition-colors text-left"
                      >
                        <span className="text-lg">📖</span>
                        <span>Sách Tin học Lớp 1</span>
                      </button>
                    </div>
                  </div>

                  {/* BOTTOM FOOTER OF START MENU: POWER OPTIONS */}
                  <div className="relative pt-2.5 mt-2.5 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Tùy chọn nguồn điện:</span>

                    {/* Power Action Button */}
                    <div className="relative">
                      <button
                        onClick={handlePowerMenuToggle}
                        id="start-menu-power-btn"
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-bold ring-1 ring-white/10 text-white"
                        title="Bấm để mở tùy chọn Tắt máy, Reset hoặc Ngủ"
                      >
                        <Power className="w-4 h-4 text-cyan-400" />
                        <span>Nút Nguồn</span>
                      </button>

                      {/* Power Submenu Flyout (Shut Down / Restart / Sleep) */}
                      {powerSubmenuOpen && (
                        <div className="absolute right-0 bottom-full mb-1.5 w-52 bg-slate-800 rounded-xl shadow-2xl border border-slate-600 p-1.5 flex flex-col gap-1 z-40">
                          {/* 1. Shut down */}
                          <button
                            id="shutdown-menu-option"
                            onClick={handleSelectShutdown}
                            className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-bold text-red-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors text-left bg-red-950/40"
                          >
                            <Power className="w-4 h-4 text-red-400" />
                            <div>
                              <div>Tắt máy (Shut down)</div>
                              <div className="text-[9px] font-normal opacity-80">Tắt an toàn khi tan học</div>
                            </div>
                          </button>

                          {/* 2. Restart / Reset */}
                          <button
                            onClick={handleSelectRestart}
                            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs font-semibold text-amber-200 hover:bg-amber-600 hover:text-white rounded-lg transition-colors text-left"
                          >
                            <RotateCcw className="w-4 h-4 text-amber-400" />
                            <div>
                              <div>Khởi động lại (Reset)</div>
                              <div className="text-[9px] font-normal opacity-80">Tắt và tự bật lại</div>
                            </div>
                          </button>

                          {/* 3. Sleep Mode */}
                          <button
                            onClick={handleSelectSleep}
                            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs font-semibold text-indigo-200 hover:bg-indigo-600 hover:text-white rounded-lg transition-colors text-left"
                          >
                            <Moon className="w-4 h-4 text-indigo-300" />
                            <div>
                              <div>Chế độ ngủ (Sleep)</div>
                              <div className="text-[9px] font-normal opacity-80">Nghỉ giải lao tiết kiệm điện</div>
                            </div>
                          </button>

                          {/* 4. Help Link for Sleep */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              soundEngine.playMouseClick();
                              setStartMenuOpen(false);
                              setPowerSubmenuOpen(false);
                              onOpenSleepExplainer();
                            }}
                            className="w-full text-center py-1 text-[10px] text-amber-300 hover:text-white flex items-center justify-center gap-1 font-semibold border-t border-slate-700/60 mt-0.5"
                          >
                            <HelpCircle className="w-3 h-3" />
                            <span>Nút Sleep để làm gì?</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* WINDOWS TASKBAR AT BOTTOM */}
              <div className="relative h-8 sm:h-9 bg-slate-900/90 backdrop-blur-md border-t border-white/20 px-2 flex items-center justify-between z-20">
                {/* Left side: START BUTTON + POWER DIRECT SHORTCUTS + Pinned Apps */}
                <div className="flex items-center gap-1.5">
                  {/* START BUTTON */}
                  <button
                    id="desktop-start-button"
                    onClick={handleStartClick}
                    className={`h-6 sm:h-7 px-2 sm:px-2.5 rounded-md flex items-center gap-1.5 font-extrabold text-xs transition-all ${
                      startMenuOpen
                        ? 'bg-blue-600 text-white shadow'
                        : highlightStartButton
                        ? 'bg-blue-600 text-white animate-bounce ring-2 ring-amber-300 shadow-lg'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    {/* Windows 4 square icon */}
                    <div className="grid grid-cols-2 gap-0.5">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-xs" />
                      <div className="w-1.5 h-1.5 bg-blue-300 rounded-xs" />
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-xs" />
                      <div className="w-1.5 h-1.5 bg-cyan-300 rounded-xs" />
                    </div>
                    <span>Start</span>
                  </button>

                  {/* DIRECT TASKBAR POWER MENU BUTTON */}
                  <button
                    onClick={handlePowerMenuToggle}
                    className="h-6 sm:h-7 px-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-md text-[11px] font-bold flex items-center gap-1 border border-slate-700"
                    title="Nút Nguồn trên thanh tác vụ"
                  >
                    <Power className="w-3 h-3" />
                    <span className="hidden sm:inline">Nguồn</span>
                  </button>

                  <div className="h-4 w-px bg-white/20 mx-0.5" />

                  {/* Quick launch icons */}
                  <button
                    onClick={() => {
                      setActiveApp('paint');
                      soundEngine.playMouseClick();
                    }}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                    title="Mở Vẽ tranh"
                  >
                    🎨
                  </button>
                  <button
                    onClick={() => {
                      setActiveApp('typing');
                      soundEngine.playMouseClick();
                    }}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                    title="Mở Tập gõ"
                  >
                    ⌨️
                  </button>
                  <button
                    onClick={() => {
                      setActiveApp('lesson_viewer');
                      soundEngine.playMouseClick();
                    }}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                    title="Mở Sổ tay Tin học"
                  >
                    📖
                  </button>
                </div>

                {/* Right side: Sleep explainer shortcut + System Tray */}
                <div className="flex items-center gap-2 text-white/80 text-[11px] font-mono">
                  <button
                    onClick={onOpenSleepExplainer}
                    className="hidden sm:flex items-center gap-1 px-2 py-0.5 bg-indigo-900/60 hover:bg-indigo-800 text-amber-300 rounded text-[10px] font-bold border border-indigo-700"
                    title="Giải thích nút Sleep"
                  >
                    <Moon className="w-3 h-3 text-amber-300" />
                    <span>Nút Sleep?</span>
                  </button>
                  <Wifi className="w-3.5 h-3.5 hidden sm:block" />
                  <Volume2 className="w-3.5 h-3.5 hidden sm:block" />
                  <span className="font-semibold text-white">{currentTime}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM BEZEL OF MONITOR: Power LED + Monitor Brand & Monitor Power Switch */}
        <div className="relative h-6 flex items-center justify-between px-3 text-slate-400 text-[10px]">
          {/* Brand mark */}
          <div className="flex items-center gap-1 font-bold tracking-wider text-slate-500 text-[9px] uppercase">
            <MonitorIcon className="w-3 h-3 text-slate-600" /> MÀN HÌNH VI TÍNH
          </div>

          {/* Right corner: Monitor Power LED & Monitor physical switch */}
          <div className="flex items-center gap-2">
            {/* Monitor Power LED */}
            <div className="flex items-center gap-1">
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  !monitorPower
                    ? 'bg-slate-700'
                    : isStandby
                    ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-pulse'
                    : computerState === 'sleep'
                    ? 'bg-amber-400 shadow-[0_0_10px_#f59e0b] animate-pulse'
                    : 'bg-emerald-400 shadow-[0_0_10px_#34d399]'
                }`}
              />
              <span className="text-[9px] hidden sm:inline">
                {!monitorPower
                  ? 'Đèn tắt'
                  : isStandby
                  ? 'Đèn chờ (Cam)'
                  : computerState === 'sleep'
                  ? 'Đèn ngủ (Cam)'
                  : 'Đèn sáng (Xanh)'}
              </span>
            </div>

            {/* Monitor Power Button */}
            <button
              onClick={toggleMonitorPower}
              title="Bật/Tắt công tắc màn hình"
              className="p-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <Power className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Monitor Stand (Stem & Solid Base) */}
      <div className="flex flex-col items-center">
        {/* Stand neck */}
        <div className="w-10 sm:w-14 h-6 sm:h-8 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-800 shadow-md border-x border-slate-600" />
        {/* Base plate */}
        <div className="w-32 sm:w-48 h-3 sm:h-4 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-t-xl shadow-xl border-t border-slate-600" />
      </div>
    </div>
  );
};
