import React, { useState } from 'react';
import { CheckCircle2, ChevronRight, ChevronLeft, Volume2, Sparkles, AlertCircle } from 'lucide-react';
import { soundEngine } from '../audio/soundEffects';
import { ComputerState } from '../types/computer';

interface Props {
  currentStep: number;
  onSetStep: (step: number) => void;
  computerState: ComputerState;
  onGuideActionRequest: (action: string) => void;
}

export const GUIDED_STEPS = [
  {
    step: 1,
    title: 'Bước 1: Làm quen 4 bộ phận cơ bản',
    instruction: 'Em hãy quan sát bộ máy tính: Màn hình ở chính giữa, Thân máy (CPU) bên phải, Bàn phím và Chuột đặt trên bàn phía trước.',
    hint: 'Bé có thể nhấp vào bàn phím để nghe tiếng lách cách và bấm chuột để thử nghiệm nhé!',
    requiredState: 'any',
  },
  {
    step: 2,
    title: 'Bước 2: Tìm nút Nguồn trên thân máy',
    instruction: 'Trên mặt trước của Thân máy, em hãy tìm nút tròn to nhất có biểu tượng ⏻. Đó chính là NÚT NGUỒN (Power).',
    hint: 'Nút nguồn đang nhấp nháy phát sáng để bé dễ nhìn thấy kìa!',
    requiredState: 'off',
    target: 'power_button',
  },
  {
    step: 3,
    title: 'Bước 3: Thực hành BẬT máy tính',
    instruction: 'Em hãy nhấn vào NÚT NGUỒN trên thân máy. Quan sát: Nút lún xuống, phát tiếng kêu, đèn nguồn sáng xanh và quạt tản nhiệt bắt đầu quay!',
    hint: 'Nhấn vào nút nguồn ⏻ trên thân máy để khởi động nhé!',
    requiredState: 'off',
  },
  {
    step: 4,
    title: 'Bước 4: Quan sát quá trình khởi động (45 giây)',
    instruction: 'Màn hình tiến hành kiểm tra phần cứng (BIOS), nạp tệp hệ thống và xoay vòng tròn Windows trong 45 giây. Bé hãy kiên nhẫn quan sát kỹ nhé!',
    hint: 'Bé có thể bấm nút "Tua nhanh" nếu muốn vào ngay Desktop!',
    requiredState: 'desktop',
  },
  {
    step: 5,
    title: 'Bước 5: Khám phá các nút Start, Shut down, Restart và Sleep',
    instruction: 'Trên thanh tác vụ có nút Start và nút Nguồn. Bé bấm vào để tìm hiểu: Shut down (Tắt máy khi tan học), Restart (Khởi động lại khi đơ), và Sleep (Chế độ ngủ chợp mắt khi ra chơi).',
    hint: 'Nhấp chuột vào nút Start hoặc nút Nguồn ở góc dưới bên trái màn hình!',
    requiredState: 'desktop',
    target: 'start_button',
  },
  {
    step: 6,
    title: 'Bước 6: Thực hành TẮT máy tính ĐÚNG CÁCH',
    instruction: 'Để tắt máy tính an toàn: Bấm Start -> Bấm nút Nguồn -> Chọn "Tắt máy (Shut down)" và chờ đèn tắt hẳn. Tuyệt đối không bấm nút nguồn hay rút phích cắm đột ngột!',
    hint: 'Chọn "Tắt máy (Shut down)" để hoàn thành buổi học an toàn nhé!',
    requiredState: 'any',
  },
];

export const GuidedLessons: React.FC<Props> = ({
  currentStep,
  onSetStep,
  computerState,
  onGuideActionRequest,
}) => {
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const currentLesson = GUIDED_STEPS[currentStep - 1] || GUIDED_STEPS[0];

  const handleNext = () => {
    soundEngine.playMouseClick();
    if (currentStep < GUIDED_STEPS.length) {
      const nextStep = currentStep + 1;
      onSetStep(nextStep);
      const nextLesson = GUIDED_STEPS[nextStep - 1];
      if (nextLesson) {
        soundEngine.speakVietnamese(nextLesson.instruction);
      }
    }
  };

  const handlePrev = () => {
    soundEngine.playMouseClick();
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      onSetStep(prevStep);
      const prevLesson = GUIDED_STEPS[prevStep - 1];
      if (prevLesson) {
        soundEngine.speakVietnamese(prevLesson.instruction);
      }
    }
  };

  const handleReadAloud = () => {
    soundEngine.speakVietnamese(currentLesson.instruction);
  };

  if (isMinimized) {
    return (
      <div className="w-full bg-slate-900/95 backdrop-blur-md rounded-2xl border-2 border-amber-400 p-2.5 shadow-xl text-white flex items-center justify-between gap-3 animate-in fade-in">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center font-black text-xs shadow">
            {currentLesson.step}
          </div>
          <span className="font-bold text-xs sm:text-sm text-amber-300 truncate max-w-[200px] sm:max-w-md">
            {currentLesson.title}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleReadAloud}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-xs"
            title="Nghe đọc"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsMinimized(false)}
            className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg"
          >
            Mở rộng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-md rounded-2xl border-2 border-amber-400/70 p-3 sm:p-4 shadow-xl text-white">
      {/* Step Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/80 pb-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center font-black text-sm shadow">
            {currentLesson.step}
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-amber-300">
              {currentLesson.title}
            </h3>
            <span className="text-[11px] text-slate-400">
              Chế độ bài học theo chuẩn Sách giáo khoa Tin học 1
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleReadAloud}
            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-95 shadow"
            title="Bấm để nghe cô giáo đọc"
          >
            <Volume2 className="w-3.5 h-3.5" /> Nghe đọc
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
            title="Thu gọn thanh hướng dẫn"
          >
            Thu gọn
          </button>
        </div>
      </div>

      {/* Main Instruction Callout */}
      <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700 mb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
            {currentLesson.instruction}
          </p>
          <div className="text-[11px] text-amber-300 flex items-center gap-1.5 font-semibold">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Mách nhỏ: {currentLesson.hint}</span>
          </div>
        </div>

        {/* Status Tracker */}
        <div className="shrink-0 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
          <div className="text-[10px] text-slate-400">Trạng thái máy tính:</div>
          <div className="font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
            <span
              className={`w-2 h-2 rounded-full ${
                computerState === 'desktop'
                  ? 'bg-emerald-400 animate-pulse'
                  : computerState === 'off'
                  ? 'bg-slate-500'
                  : 'bg-amber-400 animate-ping'
              }`}
            />
            <span>
              {computerState === 'off'
                ? 'Đang tắt'
                : computerState === 'booting_bios' || computerState === 'booting_windows'
                ? 'Đang khởi động'
                : computerState === 'desktop'
                ? 'Đã bật xong (Desktop)'
                : 'Đang tắt máy...'}
            </span>
          </div>
        </div>
      </div>

      {/* Step Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentStep === 1}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
            currentStep === 1
              ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 active:scale-95'
          }`}
        >
          <ChevronLeft className="w-4 h-4" /> Bước trước
        </button>

        {/* Step dots */}
        <div className="flex items-center gap-1.5">
          {GUIDED_STEPS.map((s) => (
            <button
              key={s.step}
              onClick={() => {
                soundEngine.playMouseClick();
                onSetStep(s.step);
              }}
              className={`w-3 h-3 rounded-full transition-all ${
                s.step === currentStep
                  ? 'w-7 bg-amber-400 rounded-full'
                  : s.step < currentStep
                  ? 'bg-emerald-400'
                  : 'bg-slate-700'
              }`}
              title={`Chuyển đến ${s.title}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentStep === GUIDED_STEPS.length}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
            currentStep === GUIDED_STEPS.length
              ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
              : 'bg-amber-400 hover:bg-amber-300 text-slate-900 active:scale-95 shadow'
          }`}
        >
          Bước tiếp theo <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
