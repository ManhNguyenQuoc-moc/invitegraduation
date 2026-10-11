import React, { useState } from "react";
import { MapPin, Car, Bike, Sparkles, Check, Clock, ExternalLink, Copy } from "lucide-react";

interface IVenueAndDressCodeProps {
  university: string;
  hostName: string;
}

export const VenueAndDressCode: React.FC<IVenueAndDressCodeProps> = ({ university, hostName }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => {
      setCopiedField(null);
    }, 2500);
  };

  const colors = [
    { name: "Trắng Bạc", eng: "Silver White", hex: "#F8FAFC", border: "border-slate-300" },
    { name: "Xanh Băng", eng: "Ice Blue", hex: "#BFDBFE", border: "border-blue-300" },
    { name: "Xanh Hoàng Gia", eng: "Royal Blue", hex: "#1D4ED8", border: "border-transparent", dark: true },
    { name: "Bạc Ánh Kim", eng: "Silver Chrome", hex: "#94A3B8", border: "border-slate-400", dark: true },
  ];

  return (
    <section id="location" className="w-full scroll-mt-6 flex justify-center">
      {/* Container 2 Cột: Bỏ background và border để lấy background vũ trụ bên ngoài, tăng chiều rộng max-w-7xl đồng bộ với Hero */}
      <div className="w-full max-w-7xl text-white relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch relative z-10">

          {/* CỘT TRÁI (5 COLS): HÌNH ẢNH KHUÔN VIÊN ĐẠI HỌC TÔN ĐỨC THẮNG */}
          <div className="lg:col-span-5 flex flex-col justify-between group">
            <div className="relative w-full h-72 sm:h-80 lg:h-full min-h-[380px] rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-[#040C1A]">
              {/* Ảnh Tòa Nhà Trường ĐH Tôn Đức Thắng */}
              <img
                src="/tdtu-campus-building.jpg"
                alt="Khuôn viên Đại học Tôn Đức Thắng"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 select-none"
              />

              {/* Lớp phủ chuyển sắc đêm sang trọng để hòa quyện viền ảnh vào nền tối */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#040C1A]/70 via-transparent to-[#040C1A]/20 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#040C1A]/20 to-transparent pointer-events-none" />
            </div>
          </div>

          {/* CỘT PHẢI (7 COLS): CHI TIẾT ĐỊA ĐIỂM, EMBED GOOGLE MAPS TƯƠNG TÁC & NÚT DẪN ĐƯỜNG */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              {/* Header Bar */}
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
                  Sảnh A — {university}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mt-1.5">
                  Số 19 Đường Nguyễn Hữu Thọ, Phường Tân Phong, Quận 7, TP. Hồ Chí Minh.
                </p>
              </div>

              {/* BẢN ĐỒ GOOGLE MAPS EMBEDDED TƯƠNG TÁC TRỰC TIẾP */}
              <div className="rounded-2xl overflow-hidden border border-white/20 relative group shadow-2xl h-56 sm:h-64 bg-slate-900">
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

              {/* Parking instructions & Nút Vị trí để xe + Sơ đồ TDTU */}
              <div className="space-y-3 pt-1">

                {/* 2 NÚT BỔ SUNG: XEM VỊ TRÍ ĐỂ XE TRỰC TUYẾN & XEM SƠ ĐỒ TDTU */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href="/bo-tri-xe-le-tn.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/30 text-sky-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all backdrop-blur-md"
                  >
                    <ExternalLink size={14} className="text-sky-300" />
                    <span>Xem Sơ Đồ Bố Trí Để Xe (PDF)</span>
                  </a>

                  <a
                    href="https://discovery.tdtu.edu.vn/?fbclid=IwY2xjawR8E1ZleHRuA2FlbQIxMQBicmlkETE2dlZCVHdaQWxCV0NGeTJXc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHnEQ3xbn1GP7a5BAhB1rmk5OGGhK1_5nrLN6p9M3YcZA4DXX-sXjjSgS3Y5F_aem_9mRM0gGzCJTJ8UWwHKsAOA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-400/30 text-blue-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all backdrop-blur-md"
                  >
                    <ExternalLink size={14} className="text-blue-300" />
                    <span>Xem Sơ Đồ Toàn Cảnh TDTU</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
