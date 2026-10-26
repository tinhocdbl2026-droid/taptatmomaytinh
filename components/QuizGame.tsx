import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, RotateCcw, Award, Star, Sparkles, Volume2 } from 'lucide-react';
import { soundEngine } from '../audio/soundEffects';

const QUIZ_DATA = [
  {
    id: 1,
    question: 'Trên thân máy tính, nút nào được dùng để BẬT máy tính?',
    options: [
      { id: 'A', text: 'Nút to có biểu tượng ⏻ (Nút Nguồn)', isCorrect: true, explanation: 'Chính xác! Nút to có biểu tượng ⏻ là nút nguồn dùng để bật máy.' },
      { id: 'B', text: 'Nút nhỏ có mũi tên xoay (Nút Reset)', isCorrect: false, explanation: 'Chưa đúng rồi! Nút Reset dùng để khởi động lại khi máy tính bị treo thôi nhé.' },
      { id: 'C', text: 'Ổ đĩa CD/DVD', isCorrect: false, explanation: 'Ổ đĩa dùng để đọc đĩa, không dùng để bật nguồn máy tính nhé bé.' },
    ],
  },
  {
    id: 2,
    question: 'Khi máy tính đã được bật và đang hoạt động, đèn nguồn trên thân máy sẽ như thế nào?',
    options: [
      { id: 'A', text: 'Đèn tắt tối thui', isCorrect: false, explanation: 'Khi đèn tắt tối nghĩa là máy tính đang chưa được bật bé nha.' },
      { id: 'B', text: 'Đèn phát sáng màu xanh rực rỡ', isCorrect: true, explanation: 'Đúng rồi! Đèn nguồn sáng xanh báo hiệu máy tính đang nhận điện và hoạt động.' },
      { id: 'C', text: 'Đèn bốc khói', isCorrect: false, explanation: 'Ôi không, đèn không bao giờ bốc khói đâu nha!' },
    ],
  },
  {
    id: 3,
    question: 'Để TẮT máy tính an toàn và đúng cách, bước đầu tiên em nên làm gì?',
    options: [
      { id: 'A', text: 'Nhấn vào nút Start (Bắt đầu) ở góc trái màn hình', isCorrect: true, explanation: 'Rất giỏi! Ta nhấp chuột vào nút Start -> chọn Power -> chọn Shut down để máy tính tắt an toàn.' },
      { id: 'B', text: 'Rút phích cắm điện ra khỏi ổ', isCorrect: false, explanation: 'Tuyệt đối không được rút phích điện vì rất nguy hiểm và làm hỏng máy tính!' },
      { id: 'C', text: 'Bấm giữ nút nguồn thật lâu', isCorrect: false, explanation: 'Tắt nguồn đột ngột sẽ làm mất bài vẽ và hỏng ổ cứng của máy tính đó bé.' },
    ],
  },
  {
    id: 4,
    question: 'Bộ phận nào của máy tính giúp em gõ các chữ cái và con số?',
    options: [
      { id: 'A', text: 'Màn hình máy tính', isCorrect: false, explanation: 'Màn hình dùng để nhìn hình ảnh và chữ viết hiển thị.' },
      { id: 'B', text: 'Bàn phím máy tính', isCorrect: true, explanation: 'Đúng rồi! Bàn phím có rất nhiều phím chữ và số để bé tập gõ.' },
      { id: 'C', text: 'Chuột máy tính', isCorrect: false, explanation: 'Chuột máy tính dùng để điều khiển con trỏ và bấm chọn.' },
    ],
  },
  {
    id: 5,
    question: 'Khi ngồi học trong phòng Tin học, bé nên làm gì để giữ an toàn?',
    options: [
      { id: 'A', text: 'Mang nước ngọt và bánh kẹo vào phòng máy vừa ăn vừa gõ', isCorrect: false, explanation: 'Không được mang đồ ăn nước uống vào phòng máy vì dễ đổ làm chập điện!' },
      { id: 'B', text: 'Ngồi ngay ngắn, không nghịch dây điện và làm theo lời thầy cô', isCorrect: true, explanation: 'Xuất sắc! Luôn ngồi ngay ngắn, giữ khoảng cách mắt an toàn và nghe lời hướng dẫn của thầy cô.' },
    ],
  },
  {
    id: 6,
    question: 'Nút Sleep (Chế độ Ngủ) trên máy tính được dùng để làm gì?',
    options: [
      { id: 'A', text: 'Cho máy tính chợp mắt tiết kiệm điện khi nghỉ giải lao, giữ nguyên bài vẽ', isCorrect: true, explanation: 'Chính xác! Sleep giúp máy tính chợp mắt tạm thời, chỉ cần bấm phím hoặc rê chuột là máy thức dậy ngay mà không mất bài tập.' },
      { id: 'B', text: 'Để tắt hẳn máy tính và rút dây điện ra về', isCorrect: false, explanation: 'Khi tan học muốn tắt hẳn máy tính thì ta chọn nút Shut down (Tắt máy) bé nhé!' },
      { id: 'C', text: 'Để xóa sạch tất cả tranh vẽ trên máy', isCorrect: false, explanation: 'Sleep không hề xóa tranh vẽ, nó giữ nguyên vẹn mọi thứ để bé học tiếp!' },
    ],
  },
];

interface Props {
  onClose: () => void;
}

export const QuizGame: React.FC<Props> = ({ onClose }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const currentQ = QUIZ_DATA[currentIndex];

  const handleSelect = (optionId: string, isCorrect: boolean) => {
    if (isAnswered) return;
    setSelectedOption(optionId);
    setIsAnswered(true);

    if (isCorrect) {
      soundEngine.playCelebration();
      setScore((prev) => prev + 1);
    } else {
      soundEngine.playWarningSound();
    }
  };

  const handleNext = () => {
    soundEngine.playMouseClick();
    if (currentIndex < QUIZ_DATA.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      soundEngine.playCelebration();
    }
  };

  const restartQuiz = () => {
    soundEngine.playResetClick();
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3">
      <div className="bg-slate-900 border-2 border-amber-400 rounded-3xl max-w-lg w-full p-4 sm:p-6 text-white shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Decorative corner stars */}
        <div className="absolute top-2 right-3 flex items-center gap-1 text-amber-400">
          <Star className="w-5 h-5 fill-amber-400" />
          <span className="font-extrabold text-sm">{score} Sao</span>
        </div>

        {!isFinished ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-900 font-black text-xs">
                Câu {currentIndex + 1} / {QUIZ_DATA.length}
              </span>
              <h2 className="text-sm font-bold text-slate-300">Đố Vui Tin Học Lớp 1</h2>
            </div>

            {/* Question Text */}
            <h3 className="text-base sm:text-lg font-extrabold text-amber-300 mb-4 leading-snug">
              {currentQ.question}
            </h3>

            {/* Voice speak button */}
            <button
              onClick={() => soundEngine.speakVietnamese(currentQ.question)}
              className="mb-4 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1 bg-slate-800 px-3 py-1 rounded-full w-fit"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-400" /> Nghe cô đọc câu hỏi
            </button>

            {/* Options list */}
            <div className="space-y-2.5 mb-4">
              {currentQ.options.map((opt) => {
                const isChosen = selectedOption === opt.id;
                let btnStyle = 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200';
                if (isAnswered) {
                  if (opt.isCorrect) {
                    btnStyle = 'bg-emerald-950/80 border-emerald-400 text-emerald-200 ring-2 ring-emerald-500';
                  } else if (isChosen && !opt.isCorrect) {
                    btnStyle = 'bg-red-950/80 border-red-500 text-red-200 ring-2 ring-red-500';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect(opt.id, opt.isCorrect)}
                    disabled={isAnswered}
                    className={`w-full p-3 rounded-xl border-2 text-left font-bold text-xs sm:text-sm transition-all flex items-start gap-3 ${btnStyle}`}
                  >
                    <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 font-black">
                      {opt.id}
                    </span>
                    <span className="flex-1">{opt.text}</span>
                    {isAnswered && opt.isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {isAnswered && isChosen && !opt.isCorrect && (
                      <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box after answering */}
            {isAnswered && (
              <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 mb-4 animate-in fade-in">
                <div className="text-xs text-amber-300 font-semibold mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Lời dặn của cô giáo:
                </div>
                <div className="text-xs text-slate-200">
                  {currentQ.options.find((o) => (selectedOption === o.id ? o : o.isCorrect))?.explanation}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
              >
                Đóng lại
              </button>
              {isAnswered && (
                <button
                  onClick={handleNext}
                  className="px-5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg transition-transform active:scale-95"
                >
                  {currentIndex === QUIZ_DATA.length - 1 ? 'Xem kết quả' : 'Câu tiếp theo'}
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Finished Screen */
          <div className="text-center py-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-orange-400 flex items-center justify-center text-4xl shadow-xl mb-3 animate-bounce">
              🏆
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-300 mb-1">
              CHÚC MỪNG BÉ HOÀN THÀNH!
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mb-4">
              Bé đã xuất sắc đạt được: <strong className="text-amber-400 text-lg">{score} / {QUIZ_DATA.length}</strong> ngôi sao vàng!
            </p>

            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 mb-6 text-xs text-slate-200 text-left space-y-1.5">
              <div className="font-bold text-emerald-400 flex items-center gap-1.5 text-sm">
                <Award className="w-4 h-4" /> Danh hiệu: BÉ GIỎI TIN HỌC LỚP 1
              </div>
              <p>✓ Bé đã biết nút nguồn ⏻ trên thân máy dùng để bật máy tính.</p>
              <p>✓ Bé đã biết quan sát đèn nguồn sáng xanh và quạt tản nhiệt quay.</p>
              <p>✓ Bé đã biết tắt máy an toàn qua nút Start để bảo vệ máy tính.</p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={restartQuiz}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <RotateCcw className="w-4 h-4" /> Chơi lại lần nữa
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-black text-xs sm:text-sm shadow-lg active:scale-95"
              >
                Về phòng máy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
