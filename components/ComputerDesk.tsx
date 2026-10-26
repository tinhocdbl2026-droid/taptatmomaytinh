import React from 'react';
import { ComputerTower } from './ComputerTower';
import { ComputerMonitor } from './ComputerMonitor';
import { ComputerKeyboard } from './ComputerKeyboard';
import { ComputerMouse } from './ComputerMouse';
import { ComputerState } from '../types/computer';
import { ShieldCheck, Info } from 'lucide-react';

interface Props {
  computerState: ComputerState;
  onPressPower: () => void;
  onPressReset: () => void;
  onInitiateShutdown: () => void;
  onInitiateRestart: () => void;
  onInitiateSleep: () => void;
  onWakeFromSleep: () => void;
  onOpenSleepExplainer: () => void;
  bootCountdown?: number;
  onSkipBoot?: () => void;
  onKeyPress: (key: string) => void;
  lastPhysicalKey?: string | null;
  highlightPower?: boolean;
  highlightReset?: boolean;
  highlightStartButton?: boolean;
}

export const ComputerDesk: React.FC<Props> = ({
  computerState,
  onPressPower,
  onPressReset,
  onInitiateShutdown,
  onInitiateRestart,
  onInitiateSleep,
  onWakeFromSleep,
  onOpenSleepExplainer,
  bootCountdown = 0,
  onSkipBoot,
  onKeyPress,
  lastPhysicalKey,
  highlightPower,
  highlightReset,
  highlightStartButton,
}) => {
  return (
    <div className="relative w-full flex-1 flex flex-col justify-between overflow-hidden bg-gradient-to-b from-sky-900 via-slate-900 to-amber-950">
      {/* 1. CLASSROOM WALL BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-90">
        {/* Classroom Wall texture & light */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800 via-slate-850 to-slate-900" />

        {/* Classroom Blackboard / Banner in distance */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[92%] max-w-4xl bg-emerald-950 border-4 border-amber-800 rounded-xl py-1.5 px-4 shadow-xl flex items-center justify-between opacity-85">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏫</span>
            <div>
              <div className="text-amber-300 font-extrabold text-xs sm:text-sm tracking-wide">
                PHÒNG TIN HỌC TIỂU HỌC - KHỐI LỚP 1
              </div>
              <div className="text-emerald-200 text-[10px] hidden sm:block">
                Quy tắc: 1. Ngồi thẳng lưng · 2. Bật tắt đúng cách · 3. Giữ trật tự
              </div>
            </div>
          </div>
          <div className="text-amber-200/80 text-[11px] font-bold hidden md:block">
            "Mỗi ngày đến trường là một ngày vui"
          </div>
        </div>

        {/* Classroom Window on left */}
        <div className="absolute top-8 left-4 w-24 sm:w-32 h-28 sm:h-36 border-4 border-amber-900 rounded-t-lg bg-gradient-to-b from-sky-300 via-sky-200 to-amber-100 opacity-60 shadow-inner flex items-center justify-center overflow-hidden">
          {/* Window pane crosses */}
          <div className="absolute w-full h-1 bg-amber-900" />
          <div className="absolute h-full w-1 bg-amber-900" />
          <div className="text-2xl opacity-40">🌳</div>
        </div>

        {/* Classroom Wall Clock on right */}
        <div className="absolute top-8 right-6 w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-white border-4 border-amber-800 shadow-md flex items-center justify-center opacity-75">
          <div className="w-1 h-3.5 bg-slate-900 rounded-full -translate-y-1.5" />
          <div className="w-2.5 h-1 bg-slate-900 rounded-full translate-x-1" />
          <div className="absolute w-2 h-2 rounded-full bg-red-500" />
        </div>
      </div>

      {/* 2. MAIN COMPUTER STAGE (MONITOR + CPU TOWER) */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-2 sm:px-4 pt-14 sm:pt-16 pb-2 flex-1 flex flex-col justify-center">
        {/* Main Unit: Monitor and Tower side-by-side */}
        <div className="flex flex-row items-end justify-center gap-3 sm:gap-6 md:gap-8">
          {/* Main Large Monitor */}
          <div className="shrink-0">
            <ComputerMonitor
              computerState={computerState}
              onInitiateShutdown={onInitiateShutdown}
              onInitiateRestart={onInitiateRestart}
              onInitiateSleep={onInitiateSleep}
              onWakeFromSleep={onWakeFromSleep}
              onOpenSleepExplainer={onOpenSleepExplainer}
              bootCountdown={bootCountdown}
              onSkipBoot={onSkipBoot}
              lastPhysicalKey={lastPhysicalKey}
              highlightStartButton={highlightStartButton}
            />
          </div>

          {/* Desktop CPU Tower on the right */}
          <div className="shrink-0">
            <ComputerTower
              computerState={computerState}
              onPressPower={onPressPower}
              onPressReset={onPressReset}
              highlightPower={highlightPower}
              highlightReset={highlightReset}
            />
          </div>
        </div>
      </div>

      {/* 3. SOLID WOODEN STUDY DESK SURFACE */}
      <div className="relative z-20 w-full bg-gradient-to-b from-amber-800 via-amber-900 to-yellow-950 border-t-8 border-amber-700 shadow-2xl pt-2 pb-3 px-2 sm:px-4">
        {/* Wood grain pattern overlay */}
        <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(45deg,#000_0,#000_2px,transparent_0,transparent_8px)] pointer-events-none" />

        {/* Front Input peripherals: Keyboard + Mouse on the desk */}
        <div className="relative max-w-4xl mx-auto flex flex-row items-center justify-center gap-4 sm:gap-8">
          {/* Interactive Keyboard */}
          <ComputerKeyboard
            onKeyPress={onKeyPress}
            activeKey={lastPhysicalKey}
          />

          {/* Interactive Mouse */}
          <ComputerMouse />
        </div>
      </div>
    </div>
  );
};
