/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ClassroomHeader } from './components/ClassroomHeader';
import { ComputerDesk } from './components/ComputerDesk';
import { GuidedLessons } from './components/GuidedLessons';
import { QuizGame } from './components/QuizGame';
import { SafetyWarningModal } from './components/SafetyWarningModal';
import { SleepExplainerModal } from './components/SleepExplainerModal';
import { ComputerState, AppMode } from './types/computer';
import { soundEngine } from './audio/soundEffects';
import { CheckCircle2, Sparkles, AlertCircle, Moon } from 'lucide-react';

export default function App() {
  const [computerState, setComputerState] = useState<ComputerState>('off');
  const [mode, setMode] = useState<AppMode>('guided');
  const [guidedStep, setGuidedStep] = useState<number>(1);
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);
  const [isSafetyWarningOpen, setIsSafetyWarningOpen] = useState<boolean>(false);
  const [isSleepExplainerOpen, setIsSleepExplainerOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [lastPhysicalKey, setLastPhysicalKey] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'warning' } | null>(null);
  const [bootCountdown, setBootCountdown] = useState<number>(0);

  const bootTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync sound & voice
  useEffect(() => {
    soundEngine.soundEnabled = soundEnabled;
    soundEngine.voiceEnabled = voiceEnabled;
  }, [soundEnabled, voiceEnabled]);

  // Show transient toast messages
  const showToast = useCallback((text: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 4500);
  }, []);

  // WAKE FROM SLEEP HANDLER
  const handleWakeFromSleep = useCallback(() => {
    if (computerState === 'sleep') {
      soundEngine.playStartupChime();
      soundEngine.speakVietnamese('Máy tính đã thức dậy rồi! Tiếp tục học thôi nào bé ơi!');
      setComputerState('desktop');
      showToast('Máy tính đã thức dậy tức thì! Bài vẽ và tài liệu của bé vẫn nguyên vẹn.', 'success');
    }
  }, [computerState, showToast]);

  // Listen to physical keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'Tab') return;

      // If in sleep mode, any key wakes the computer!
      if (computerState === 'sleep') {
        handleWakeFromSleep();
        return;
      }

      setLastPhysicalKey(e.key);
      setTimeout(() => {
        setLastPhysicalKey(null);
      }, 200);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [computerState, handleWakeFromSleep]);

  // CLEANUP BOOT TIMER ON UNMOUNT
  useEffect(() => {
    return () => {
      if (bootTimerRef.current) clearInterval(bootTimerRef.current);
    };
  }, []);

  // FINISH BOOT SEQUENCE & ENTER DESKTOP
  const finishBoot = useCallback(() => {
    if (bootTimerRef.current) {
      clearInterval(bootTimerRef.current);
      bootTimerRef.current = null;
    }
    setBootCountdown(0);
    setComputerState('desktop');
    soundEngine.playStartupChime();
    soundEngine.speakVietnamese('Máy tính đã khởi động xong rồi! Chào mừng các em đến với phòng Tin học!');
    showToast('Khởi động thành công! Em hãy dùng chuột và bàn phím để khám phá nhé.', 'success');

    if (guidedStep === 3) {
      setGuidedStep(4);
    }
  }, [guidedStep, showToast]);

  // START 45-SECOND BOOTING PROCESS
  const start45SecondBoot = useCallback(() => {
    if (bootTimerRef.current) clearInterval(bootTimerRef.current);

    setComputerState('booting_bios');
    setBootCountdown(45);
    soundEngine.startFanNoise();

    showToast('Máy tính đang khởi động trong 45 giây để học sinh quan sát kỹ từng bước!', 'info');
    soundEngine.speakVietnamese('Đang bật máy tính. Quá trình khởi động diễn ra trong 45 giây, các em hãy quan sát kỹ nhé!');

    bootTimerRef.current = setInterval(() => {
      setBootCountdown((prev) => {
        const next = prev - 1;

        if (next === 32) {
          // Transition to Windows boot screen with rotating dots
          setComputerState('booting_windows');
        } else if (next === 6) {
          // Play Windows pleasant chime as welcome screen appears
          soundEngine.playStartupChime();
        } else if (next <= 0) {
          if (bootTimerRef.current) {
            clearInterval(bootTimerRef.current);
            bootTimerRef.current = null;
          }
          setComputerState('desktop');
          soundEngine.speakVietnamese('Máy tính đã khởi động xong rồi! Chào mừng các em đến với phòng Tin học!');
          showToast('Khởi động thành công! Em hãy dùng chuột và bàn phím để khám phá nhé.', 'success');
          return 0;
        }

        return next;
      });
    }, 1000);
  }, [showToast]);

  // Handle POWER BUTTON press on CPU Tower
  const handlePressPower = useCallback(() => {
    if (computerState === 'off') {
      start45SecondBoot();
    } else if (computerState === 'sleep') {
      handleWakeFromSleep();
    } else if (computerState === 'desktop') {
      // Pedagogical intervention: warn about hard power off!
      soundEngine.playWarningSound();
      soundEngine.speakVietnamese('Bé ơi, khi máy đang hoạt động bình thường, không nên tắt bằng nút nguồn nhé!');
      setIsSafetyWarningOpen(true);
    }
  }, [computerState, start45SecondBoot, handleWakeFromSleep]);

  // Handle RESET BUTTON press on CPU Tower
  const handlePressReset = useCallback(() => {
    if (computerState === 'off') return;

    soundEngine.playWarningSound();
    start45SecondBoot();
    showToast('Máy tính đang được khởi động lại (Reset)...', 'warning');
  }, [computerState, start45SecondBoot, showToast]);

  // Handle SAFE PROPER SHUTDOWN from Windows Start Menu
  const handleInitiateShutdown = useCallback(() => {
    if (bootTimerRef.current) {
      clearInterval(bootTimerRef.current);
      bootTimerRef.current = null;
    }
    setBootCountdown(0);
    setComputerState('shutting_down');
    soundEngine.playShutdownChime();
    soundEngine.speakVietnamese('Đang tắt máy tính đúng quy trình. Tạm biệt bé yêu!');
    showToast('Đang tắt máy tính đúng cách: Start -> Power -> Shut down...', 'info');

    setTimeout(() => {
      setComputerState('off');
      soundEngine.stopFanNoise();
      soundEngine.playCelebration();
      showToast('Hoan hô! Em đã tắt máy tính an toàn và đúng quy trình!', 'success');
      soundEngine.speakVietnamese('Hoan hô! Em đã tắt máy tính an toàn và đúng cách rồi!');

      if (guidedStep === 5) {
        setGuidedStep(6);
      }
    }, 3000);
  }, [guidedStep, showToast]);

  // Handle SLEEP MODE
  const handleInitiateSleep = useCallback(() => {
    setComputerState('sleep');
    soundEngine.playShutdownChime();
    soundEngine.speakVietnamese('Máy tính đang chuyển sang chế độ ngủ Sleep để tiết kiệm điện. Bấm phím để đánh thức lại nhé!');
    showToast('Máy tính đã chuyển sang chế độ ngủ (Sleep) tiết kiệm điện!', 'info');
  }, [showToast]);

  // Force hard power off if requested in safety modal
  const handleConfirmHardPowerOff = useCallback(() => {
    if (bootTimerRef.current) {
      clearInterval(bootTimerRef.current);
      bootTimerRef.current = null;
    }
    setBootCountdown(0);
    setComputerState('off');
    soundEngine.stopFanNoise();
    soundEngine.playWarningSound();
    showToast('Máy tính bị ngắt điện đột ngột! Lần sau bé nhớ tắt qua nút Start nhé.', 'warning');
  }, [showToast]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 font-['Nunito',sans-serif]">
      {/* 1. TOP BAR NAVIGATION */}
      <ClassroomHeader
        mode={mode}
        onSetMode={setMode}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        voiceEnabled={voiceEnabled}
        onToggleVoice={() => setVoiceEnabled((prev) => !prev)}
        onOpenQuiz={() => setIsQuizOpen(true)}
      />

      {/* 2. MAIN INTERACTIVE COMPUTER LAB WORKSPACE */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Computer Desk Area with Monitor, Tower, Keyboard, Mouse */}
        <ComputerDesk
          computerState={computerState}
          onPressPower={handlePressPower}
          onPressReset={handlePressReset}
          onInitiateShutdown={handleInitiateShutdown}
          onInitiateRestart={handlePressReset}
          onInitiateSleep={handleInitiateSleep}
          onWakeFromSleep={handleWakeFromSleep}
          onOpenSleepExplainer={() => setIsSleepExplainerOpen(true)}
          bootCountdown={bootCountdown}
          onSkipBoot={finishBoot}
          onKeyPress={(key) => setLastPhysicalKey(key)}
          lastPhysicalKey={lastPhysicalKey}
          highlightPower={mode === 'guided' && (guidedStep === 2 || guidedStep === 3)}
          highlightReset={false}
          highlightStartButton={mode === 'guided' && guidedStep === 5 && computerState === 'desktop'}
        />

        {/* GUIDED LESSON BAR (at bottom or floating) */}
        {mode === 'guided' && computerState !== 'sleep' && (
          <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 w-[95%] max-w-3xl z-30">
            <GuidedLessons
              currentStep={guidedStep}
              onSetStep={setGuidedStep}
              computerState={computerState}
              onGuideActionRequest={() => {}}
            />
          </div>
        )}
      </div>

      {/* 3. TRANSIENT EDUCATIONAL TOAST NOTIFICATIONS */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in duration-200 pointer-events-none">
          <div
            className={`px-4 py-2.5 rounded-2xl shadow-2xl border flex items-center gap-2.5 text-xs sm:text-sm font-bold ${
              toastMessage.type === 'success'
                ? 'bg-emerald-900/95 text-emerald-100 border-emerald-500 shadow-emerald-950/50'
                : toastMessage.type === 'warning'
                ? 'bg-amber-900/95 text-amber-100 border-amber-500 shadow-amber-950/50'
                : 'bg-blue-900/95 text-blue-100 border-blue-400 shadow-blue-950/50'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : toastMessage.type === 'warning' ? (
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            ) : (
              <Sparkles className="w-5 h-5 text-blue-300 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* 4. SLEEP EXPLAINER MODAL */}
      <SleepExplainerModal
        isOpen={isSleepExplainerOpen}
        onClose={() => setIsSleepExplainerOpen(false)}
        onTrySleepMode={handleInitiateSleep}
      />

      {/* 5. SAFETY WHAT-IF MODAL */}
      <SafetyWarningModal
        isOpen={isSafetyWarningOpen}
        onClose={() => setIsSafetyWarningOpen(false)}
        onConfirmHardPowerOff={handleConfirmHardPowerOff}
      />

      {/* 6. INTERACTIVE QUIZ MODAL */}
      {isQuizOpen && <QuizGame onClose={() => setIsQuizOpen(false)} />}
    </div>
  );
}
