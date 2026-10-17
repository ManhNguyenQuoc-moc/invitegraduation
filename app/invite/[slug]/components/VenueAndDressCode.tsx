import React, { useState, useEffect } from "react";
import {
  MapPin,
  Car,
  Bike,
  Sparkles,
  Check,
  ExternalLink,
  Copy,
  Compass,
  ZoomIn,
  X,
  Building2,
  Navigation,
  Info
} from "lucide-react";

interface IVenueAndDressCodeProps {
  university: string;
  hostName: string;
}

export const VenueAndDressCode: React.FC<IVenueAndDressCodeProps> = ({ university, hostName }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const addressText = "Số 19 Đường Nguyễn Hữu Thọ, Phường Tân Phong, Quận 7, TP. Hồ Chí Minh";

  const handleCopy = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => {
      setCopiedField(null);
    }, 2500);
  };

  // Đóng modal khi nhấn phím ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMapModalOpen(false);
      }
    };
    if (isMapModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isMapModalOpen]);

  return (
    <section id="location" className="w-full scroll-mt-6 flex justify-center">
      <div className="w-full max-w-7xl text-white relative">

        {/* PHẦN 1: TỔNG QUAN ĐỊA ĐIỂM & BẢN ĐỒ GOOGLE MAPS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch relative z-10">

          {/* CỘT TRÁI (5 COLS): HÌNH ẢNH KHUÔN VIÊN ĐẠI HỌC TÔN ĐỨC THẮNG */}
          <div className="lg:col-span-5 flex flex-col justify-between group">
            <div className="relative w-full h-72 sm:h-80 lg:h-full min-h-[360px] rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-[#040C1A]">
              <img
                src="/tdtu-campus-building.jpg"
                alt="Khuôn viên Đại học Tôn Đức Thắng"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#040C1A]/80 via-transparent to-[#040C1A]/20 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#040C1A]/30 to-transparent pointer-events-none" />

              {/* Tag góc ảnh */}
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-semibold text-slate-200">Địa điểm tổ chức</span>
                </div>
                <span className="text-[11px] text-sky-300 font-medium">Toà A • TDTU</span>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI (7 COLS): CHI TIẾT ĐỊA ĐIỂM, EMBED GOOGLE MAPS TƯƠNG TÁC & NÚT DẪN ĐƯỜNG */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Header Bar & Nút Copy Địa Chỉ */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
                    Sảnh A — {university}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed mt-1 flex items-start gap-1.5">
                    <MapPin size={16} className="text-sky-400 shrink-0 mt-0.5" />
                    <span>{addressText}</span>
                  </p>
                </div>

                <button
                  onClick={() => handleCopy(addressText, "address")}
                  type="button"
                  className="self-start sm:self-center shrink-0 px-3.5 py-1.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 active:scale-95 border border-sky-400/30 text-sky-200 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm"
                >
                  {copiedField === "address" ? (
                    <>
                      <Check size={13} className="text-emerald-400" />
                      <span className="text-emerald-300">Đã chép địa chỉ</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} className="text-sky-300" />
                      <span>Sao chép địa chỉ</span>
                    </>
                  )}
                </button>
              </div>

              {/* BẢN ĐỒ GOOGLE MAPS EMBEDDED TƯƠNG TÁC TRỰC TIẾP */}
              <div className="rounded-2xl overflow-hidden border border-white/20 relative group shadow-2xl h-52 sm:h-60 bg-slate-900">
                <iframe
                  title="Bản đồ Google Maps - Đại học Tôn Đức Thắng"
                  src="https://maps.google.com/maps?q=10.73264,106.69938+(%C4%90%E1%BA%A1i+h%E1%BB%8Dc+T%C3%B4n+%C4%90%E1%BB%A9c+Th%E1%BA%AFng)&t=&z=16&ie=UTF8&iwloc=B&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full filter contrast-[1.05] opacity-95 transition-opacity hover:opacity-100"
                />
              </div>

              {/* 2 NÚT BỔ SUNG: XEM VỊ TRÍ ĐỂ XE TRỰC TUYẾN & XEM SƠ ĐỒ TDTU */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <a
                  href="/bo-tri-xe-le-tn.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/30 text-sky-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all backdrop-blur-md shadow-md"
                >
                  <ExternalLink size={14} className="text-sky-300" />
                  <span>Xem Sơ Đồ Bố Trí Để Xe (PDF)</span>
                </a>

                <a
                  href="https://discovery.tdtu.edu.vn/?fbclid=IwY2xjawR8E1ZleHRuA2FlbQIxMQBicmlkETE2dlZCVHdaQWxCV0NGeTJXc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHnEQ3xbn1GP7a5BAhB1rmk5OGGhK1_5nrLN6p9M3YcZA4DXX-sXjjSgS3Y5F_aem_9mRM0gGzCJTJ8UWwHKsAOA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-400/30 text-blue-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all backdrop-blur-md shadow-md"
                >
                  <ExternalLink size={14} className="text-blue-300" />
                  <span>Xem Sơ Đồ Toàn Cảnh TDTU</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* PHẦN 2: LƯU Ý QUAN TRỌNG & SƠ ĐỒ HƯỚNG DẪN CỔNG VÀO TDTU */}
        <div className="mt-10 pt-8 border-t border-white/15 relative z-10">
          {/* Header Khu Vực Lưu Ý */}
          <div className="text-center max-w-2xl mx-auto mb-7">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-sky-300">
                Sơ Đồ & Hướng Dẫn Di Chuyển
              </span>
            </div>
            <h4 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
              Lưu Ý Về Các Cổng Vào & Khu Vực Gửi Xe
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Trường rất rộng và có nhiều cổng vào. Quý khách vui lòng lưu ý sơ đồ dưới đây để chọn cổng đón/trả và bãi đỗ xe thuận tiện nhất, tránh phải đi bộ xa!
            </p>
          </div>

          {/* Grid hiển thị Ảnh Sơ Đồ + Danh Sách Lưu Ý Chi Tiết */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

            {/* CỘT TRÁI (5 COLS): HÌNH ẢNH SƠ ĐỒ HƯỚNG DẪN CỔNG VÀO (INTERACTIVE PREVIEW) */}
            <div className="lg:col-span-5">
              <div
                onClick={() => setIsMapModalOpen(true)}
                className="relative rounded-2xl overflow-hidden border border-sky-400/30 shadow-2xl bg-slate-950/80 group cursor-pointer transition-all hover:border-sky-400/60 hover:shadow-sky-500/20"
                title="Nhấn vào để phóng to sơ đồ"
              >
                {/* Ảnh Sơ đồ TDTU */}
                <img
                  src="/so-do-huong-dan-tdtu.png"
                  alt="Sơ đồ hướng dẫn cổng vào Đại học Tôn Đức Thắng"
                  className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500 select-none"
                />

                {/* Gradient phủ nhẹ */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Badge nhấn để phóng to */}
                <div className="absolute bottom-3 left-3 right-3 py-2.5 px-3 rounded-xl bg-black/75 backdrop-blur-md border border-white/20 text-center flex items-center justify-center gap-2 text-xs text-sky-200 group-hover:text-white group-hover:bg-sky-600/80 transition-all shadow-lg">
                  <ZoomIn size={14} className="text-sky-300 group-hover:text-white" />
                  <span className="font-semibold">Chạm để phóng to xem rõ nét</span>
                </div>
              </div>
            </div>

            {/* CỘT PHẢI (7 COLS): CÁC ĐIỂM LƯU Ý CHI TIẾT ĐƯỢC PHÂN LOẠI RÕ RÀNG */}
            <div className="lg:col-span-7 space-y-3.5">

              {/* 1. Toà A - Lễ tốt nghiệp */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-white/20 backdrop-blur-md flex items-start gap-3.5 shadow-lg transition-all">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0 text-emerald-400">
                  <Building2 size={20} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h5 className="text-sm font-bold text-white">
                      Toà A — Địa Điểm Trao Bằng Cử Nhân
                    </h5>
                    <span className="text-xs font-medium text-emerald-400">
                      (Điểm đến chính)
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Nơi diễn ra Lễ tốt nghiệp và đón tiếp khách mời của <strong className="text-emerald-200 font-semibold">{hostName}</strong>. Toà A nằm ngay phía trước trường, thuận tiện nhất khi vào từ <strong className="text-white">Cổng 1 & Cổng 2</strong>.
                  </p>
                </div>
              </div>

              {/* 2. Xe công nghệ / Taxi */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-white/20 backdrop-blur-md flex items-start gap-3.5 shadow-lg transition-all">
                <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/25 flex items-center justify-center shrink-0 text-sky-400">
                  <Navigation size={20} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h5 className="text-sm font-bold text-white">
                      Xe Công Nghệ / Taxi (Grab, Be, Xanh SM...)
                    </h5>
                    <span className="text-xs font-medium text-sky-400">
                      (Ưu tiên Cổng 1, 2)
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Có thể đón và trả khách tại <strong className="text-white">Cổng 1, 2, 3, 4, 5</strong> (Mặt đường Nguyễn Hữu Thọ).
                    <br />
                    <span className="text-sky-200 font-medium">
                      Lưu ý: Quý khách nên nhắc tài xế trả ở Cổng 1 hoặc Cổng 2 để bước thẳng vào Toà A gần nhất, tránh phải đi bộ xa.
                    </span>
                  </p>
                </div>
              </div>

              {/* 3. Xe máy */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-white/20 backdrop-blur-md flex items-start gap-3.5 shadow-lg transition-all">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center shrink-0 text-amber-400">
                  <Bike size={20} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h5 className="text-sm font-bold text-white">
                      Đi Xe Máy — Khu Vực Gửi Xe
                    </h5>
                    <span className="text-xs font-medium text-amber-400">
                      (Cổng 7 & Cổng 9)
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Khách mời đi xe máy di chuyển vào <strong className="text-white">Cổng 7</strong> hoặc <strong className="text-white">Cổng 9</strong> (Mặt đường D6, phía sau trường). Khu vực giữ xe rộng rãi cạnh Sân vận động & Nhà thi đấu.
                  </p>
                </div>
              </div>

              {/* 4. Xe ô tô */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-white/20 backdrop-blur-md flex items-start gap-3.5 shadow-lg transition-all">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center shrink-0 text-indigo-400">
                  <Car size={20} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h5 className="text-sm font-bold text-white">
                      Đi Xe Ô Tô — Bãi Đậu Xe
                    </h5>
                    <span className="text-xs font-medium text-indigo-400">
                      (Chỉ vào Cổng 9)
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Ô tô vui lòng đi vào <strong className="text-white">Cổng 9</strong> (Đường D6). Sau khi vào cổng, ban quản lý & bảo vệ trường sẽ hướng dẫn vị trí đậu xe ô tô quy định.
                  </p>
                </div>
              </div>

              {/* 5. Gợi ý hẹn điểm tập hợp */}
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-pink-500/20 border border-pink-400/30 flex items-center justify-center shrink-0 text-pink-300">
                  <Sparkles size={16} />
                </div>
                <p className="text-xs text-slate-300 leading-snug">
                  <strong className="text-pink-200">Gợi ý nhỏ:</strong> Khuôn viên trường rộng dễ lạc, gia đình và bạn bè nên hẹn trước vị trí tập hợp (như trước sảnh Toà A) để thuận tiện chụp ảnh lưu niệm cùng {hostName} nhé!
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* MODAL LIGHTBOX XEM FULL SƠ ĐỒ CHI TIẾT */}
      {isMapModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Sơ đồ hướng dẫn cổng vào Đại học Tôn Đức Thắng"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsMapModalOpen(false)}
        >
          {/* Container Modal */}
          <div
            className="relative max-w-4xl w-full max-h-[92vh] flex flex-col items-center bg-[#050D1A] border border-white/20 rounded-3xl shadow-2xl p-4 sm:p-6 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-white/15">
              <div className="flex items-center gap-2">
                <Compass size={18} className="text-amber-400" />
                <h4 className="text-base sm:text-lg font-bold text-white">
                  Sơ Đồ Hướng Dẫn Cổng Vào & Khuôn Viên TDTU
                </h4>
              </div>

              <button
                onClick={() => setIsMapModalOpen(false)}
                type="button"
                aria-label="Đóng"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Ảnh Phóng To */}
            <div className="w-full flex-1 overflow-auto flex items-center justify-center py-2">
              <img
                src="/so-do-huong-dan-tdtu.png"
                alt="Sơ đồ chi tiết Đại học Tôn Đức Thắng"
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl border border-white/15 shadow-xl select-none"
              />
            </div>

            {/* Footer Modal với tóm tắt nhanh */}
            <div className="w-full pt-3 mt-1 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-3.5 flex-wrap text-slate-300">
                <span className="inline-flex items-center gap-1.5"><Building2 size={13} className="text-emerald-400" /> Toà A: Cổng 1 & 2</span>
                <span className="inline-flex items-center gap-1.5"><Bike size={13} className="text-amber-400" /> Xe máy: Cổng 7 & 9</span>
                <span className="inline-flex items-center gap-1.5"><Car size={13} className="text-indigo-400" /> Ô tô: Cổng 9</span>
                <span className="inline-flex items-center gap-1.5"><Navigation size={13} className="text-sky-400" /> Xe công nghệ: Cổng 1, 2, 3, 4, 5</span>
              </div>
              <button
                onClick={() => setIsMapModalOpen(false)}
                type="button"
                className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white font-medium transition-all ml-auto"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
