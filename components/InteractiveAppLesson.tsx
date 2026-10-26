import React, { useState } from 'react';
import { BookOpen, X, ChevronRight, ChevronLeft, Volume2, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { soundEngine } from '../audio/soundEffects';

interface Props {
  onClose: () => void;
}

const LESSON_PAGES = [
  {
    title: 'Bài 1: Bốn bộ phận cơ bản của máy tính',
    badge: 'Kiến thức cốt lõi',
    content: (
      <div className="space-y-3">
        <p className="text-slate-700 text-sm">Bộ máy tính để bàn hoàn chỉnh gồm 4 bộ phận quan trọng:</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-blue-50 p-2.5 rounded-lg border border-blue-200">
            <span className="font-bold text-blue-800 text-sm block">1. Màn hình</span>
            <span className="text-slate-600">Hiển thị kết quả làm việc, tranh ảnh, bài học để bé nhìn thấy.</span>
          </div>
          <div className="bg-indigo-50 p-2.5 rounded-lg border border-indigo-200">
            <span className="font-bold text-indigo-800 text-sm block">2. Thân máy (CPU)</span>
            <span className="text-slate-600">Là "bộ não" điều khiển máy tính, có nút nguồn và nút reset.</span>
          </div>
          <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
            <span className="font-bold text-emerald-800 text-sm block">3. Bàn phím</span>
            <span className="text-slate-600">Có nhiều phím chữ và số để bé gửi thông tin vào máy tính.</span>
          </div>
          <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200">
            <span className="font-bold text-amber-800 text-sm block">4. Chuột máy tính</span>
            <span className="text-slate-600">Giúp bé điều khiển con trỏ trên màn hình dễ dàng và thuận tiện.</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Bài 2: Quy trình BẬT máy tính',
    badge: 'Thực hành chuẩn',
    content: (
      <div className="space-y-3">
        <p className="text-slate-700 text-sm">Để bật máy tính, em thực hiện 3 bước sau:</p>
        <div className="space-y-2 text-xs">
          <div className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">1</span>
            <div>
              <strong className="text-slate-800">Nhấn nút nguồn trên thân máy:</strong> Tìm nút tròn to có biểu tượng ⏻ và nhấn nhẹ một lần.
            </div>
          </div>
          <div className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">2</span>
            <div>
              <strong className="text-slate-800">Bật công tắc màn hình:</strong> Nếu đèn màn hình chưa sáng màu xanh, nhấn nút nguồn màn hình.
            </div>
          </div>
          <div className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">3</span>
            <div>
              <strong className="text-slate-800">Kiên nhẫn chờ máy khởi động:</strong> Đợi vòng tròn xoay tải xong và xuất hiện màn hình làm việc (Desktop).
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Bài 3: Quy trình TẮT máy tính ĐÚNG CÁCH',
    badge: 'Rất quan trọng!',
    content: (
      <div className="space-y-3">
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1.5">
          <div className="font-bold text-emerald-800 flex items-center gap-1.5 text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Các bước tắt máy an toàn:
          </div>
          <ol className="list-decimal pl-5 space-y-1 text-slate-700">
            <li>Nhấp chuột vào nút <strong>Start</strong> (biểu tượng lá cờ ở góc dưới bên trái).</li>
            <li>Nhấp chuột vào biểu tượng <strong>Nguồn (Power ⏻)</strong>.</li>
            <li>Chọn <strong>Shut down (Tắt máy)</strong>.</li>
            <li>Chờ đèn trên thân máy tắt hẳn rồi mới tắt màn hình và ra về.</li>
          </ol>
        </div>

        <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs space-y-1">
          <div className="font-bold text-red-800 flex items-center gap-1.5 text-sm">
            <AlertTriangle className="w-4 h-4 text-red-600" /> Điều tuyệt đối KHÔNG ĐƯỢC LÀM:
          </div>
          <p className="text-red-700">
            ❌ <strong>Không được rút phích cắm điện</strong> hoặc bấm giữ nút nguồn thân máy khi máy đang chạy, vì sẽ làm mất bài vẽ và hỏng máy tính!
          </p>
        </div>
      </div>
    ),
  },
];

export const InteractiveAppLesson: React.FC<Props> = ({ onClose }) => {
  const [currentPage, setCurrentPage] = useState<number>(0);

  const nextPage = () => {
    if (currentPage < LESSON_PAGES.length - 1) {
      soundEngine.playMouseClick();
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      soundEngine.playMouseClick();
      setCurrentPage((prev) => prev - 1);
    }
  };

  const page = LESSON_PAGES[currentPage];

  return (
    <div className="absolute inset-2 sm:inset-4 bg-white rounded-lg shadow-2xl border-2 border-amber-300 flex flex-col overflow-hidden z-20">
      {/* Title bar */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1.5 flex items-center justify-between text-white select-none">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-100" />
          <span className="font-bold text-xs sm:text-sm tracking-wide">Sổ Tay Tin Học Lớp 1</span>
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

      {/* Content */}
      <div className="flex-1 p-3 sm:p-4 overflow-y-auto bg-amber-50/40 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
              {page.badge}
            </span>
            <span className="text-xs text-slate-500">
              Trang {currentPage + 1} / {LESSON_PAGES.length}
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2">{page.title}</h2>
          {page.content}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-amber-200 mt-2">
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
              currentPage === 0
                ? 'text-slate-300 cursor-not-allowed'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 active:scale-95'
            }`}
          >
            <ChevronLeft className="w-4 h-4" /> Trang trước
          </button>

          <button
            onClick={() => soundEngine.speakVietnamese(page.title)}
            className="px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95"
            title="Đọc to cho bé nghe"
          >
            <Volume2 className="w-3.5 h-3.5" /> Nghe đọc
          </button>

          <button
            onClick={nextPage}
            disabled={currentPage === LESSON_PAGES.length - 1}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
              currentPage === LESSON_PAGES.length - 1
                ? 'text-slate-300 cursor-not-allowed'
                : 'bg-amber-500 text-white hover:bg-amber-600 active:scale-95 shadow-sm'
            }`}
          >
            Trang sau <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
