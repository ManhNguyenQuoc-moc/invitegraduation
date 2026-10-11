"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar, MapPin } from "lucide-react";

interface IGraduationPosterCardProps {
  guestName?: string;
  onOpenVenueDrawer?: () => void;
  eventDate?: string;
  timeRange?: string;
  className?: string;
  showInfoBoxes?: boolean;
}

export const GraduationPosterCard: React.FC<IGraduationPosterCardProps> = ({
  guestName = "Quý Khách",
  onOpenVenueDrawer,
  eventDate = "Thứ 6, ngày 23/10/2026",
  timeRange = "Vào lúc 11h-18h",
  className = "",
  showInfoBoxes = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [scrollYOffset, setScrollYOffset] = useState(0);

  // Lắng nghe sự kiện cuộn trang (Scroll Parallax)
  useEffect(() => {
    const handleScroll = () => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      // Tính độ lệch của thẻ so với trung tâm viewport (-1 đến 1)
      const centerDiff = (rect.top + rect.height / 2 - windowHeight / 2) / (windowHeight / 2);
      // Giới hạn biên độ di chuyển cuộn mượt mà từ -25px đến 25px
      const clampedOffset = Math.max(-1, Math.min(1, centerDiff)) * 25;
      setScrollYOffset(clampedOffset);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lắng nghe cảm biến con quay hồi chuyển khi nghiêng điện thoại (DeviceOrientation 3D Gyroscope)
  useEffect(() => {
    let animFrame: number;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      // gamma: trục nghiêng trái sang phải (-90 đến 90 độ)
      // beta: trục nghiêng trước ra sau (-180 đến 180 độ, cầm bình thường khoảng 45 độ)
      const gamma = e.gamma ?? 0;
      const beta = e.beta ?? 45;

      // Chuẩn hóa góc cầm điện thoại:
      // Giới hạn gamma [-25, 25] -> map sang góc xoay Y [-6, 6] độ
      const targetRotateY = Math.max(-6, Math.min(6, (gamma / 25) * 6));
      // Trừ 45 độ góc cầm tự nhiên: [-25, 25] -> map sang góc xoay X [-6, 6] độ
      const normalizedBeta = beta - 45;
      const targetRotateX = -Math.max(-6, Math.min(6, (normalizedBeta / 25) * 6));

      animFrame = requestAnimationFrame(() => {
        setRotateX(Number(targetRotateX.toFixed(2)));
        setRotateY(Number(targetRotateY.toFixed(2)));
        setIsHovered(true);
      });
    };

    let isListening = false;

    // Kiểm tra và xin quyền nếu trên iOS Safari 13+ hoặc Android Chrome
    const startListening = async () => {
      if (isListening || typeof window === "undefined") return;

      const doe = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<string>;
      };

      if (typeof doe?.requestPermission === "function") {
        try {
          const perm = await doe.requestPermission();
          if (perm === "granted") {
            window.addEventListener("deviceorientation", handleOrientation, true);
            isListening = true;
          }
        } catch {
          // Bỏ qua nếu chưa chạm màn hình
        }
      } else if ("DeviceOrientationEvent" in window) {
        window.addEventListener("deviceorientation", handleOrientation, true);
        isListening = true;
      }
    };

    startListening();

    const onUserTouch = () => {
      startListening();
      window.removeEventListener("touchstart", onUserTouch);
      window.removeEventListener("click", onUserTouch);
    };

    window.addEventListener("touchstart", onUserTouch, { passive: true });
    window.addEventListener("click", onUserTouch, { passive: true });

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("deviceorientation", handleOrientation, true);
        window.removeEventListener("touchstart", onUserTouch);
        window.removeEventListener("click", onUserTouch);
      }
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, []);

  // Xử lý hiệu ứng rê chuột / chạm cảm ứng 3D Parallax Tilt
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Giới hạn góc nghiêng nhẹ nhàng 4 độ tạo cảm giác thiệp nổi cao cấp
    const rY = ((x - centerX) / centerX) * 4;
    const rX = -((y - centerY) / centerY) * 4;
    setRotateX(rX);
    setRotateY(rY);
    setIsHovered(true);
  };

  const handlePointerLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative w-full ${showInfoBoxes ? "aspect-[1240/1748]" : "aspect-[1240/1400]"
        } select-none text-white flex flex-col justify-between bg-transparent transition-transform duration-300 ease-out cursor-pointer ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered ? 1.015 : 1})`,
        touchAction: "pan-y",
      }}
    >
      {/* ================= LỚP NỀN: CÁC NGÔI SAO TRANG TRÍ GÓC TRÊN [22.07 (4).png] ================= */}
      <img
        src="/22.07 (4).png"
        alt="Ngôi sao trang trí trái"
        className="absolute top-3 left-4 w-6 h-6 sm:w-8 sm:h-8 object-contain pointer-events-none drop-shadow-md animate-pulse opacity-80"
      />
      <img
        src="/22.07 (4).png"
        alt="Ngôi sao trang trí phải"
        className="absolute top-4 right-6 w-5 h-5 sm:w-7 sm:h-7 object-contain pointer-events-none drop-shadow-md animate-pulse opacity-75 -rotate-12"
      />

      {/* ================= LỚP 2: KHUNG THIỆP GIẤY MỸ THUẬT TRẮNG VÂN NỔI ================= */}
      <div
        className="absolute overflow-hidden shadow-2xl"
        style={{
          left: "11.37%",
          width: "75.95%",
          top: "15.05%",
          height: showInfoBoxes ? "67.73%" : "77.5%",
          backgroundImage: "url('/22.07 (1).jpg')",
          backgroundRepeat: "repeat",
          backgroundColor: "#f9f9f8",
        }}
      >


        {/* ================= LỚP 3: BACKGROUND 2 (TÀU HỎA & TÒA NHÀ TDTU MÀU NƯỚC) ================= */}
        <img
          src="/22.07 (5).png"
          alt="Nền Tàu hỏa và Tòa nhà TDTU"
          className="absolute pointer-events-none object-contain transition-transform duration-300 ease-out"
          style={{
            left: "0%",
            width: "100%",
            top: "22.5%",
            opacity: 0.95,
            transform: `translate3d(${-rotateY * 0.8}px, ${rotateX * 0.8 + scrollYOffset * 0.25}px, 0px) scale(${isHovered ? 1.02 : 1})`,
          }}
        />

        {/* ================= LỚP 5: ẢNH CHÂN DUNG CỬ NHÂN QUỐC MẠNH (HÌNH CHÍNH) ================= */}
        <img
          src="/22.07 (3-clean).png"
          alt="Cử nhân Nguyễn Quốc Mạnh"
          className="absolute pointer-events-none object-contain z-20 transition-transform duration-300 ease-out"
          style={{
            left: "16.5%",
            top: "10.7%",
            width: "69.5%",
            transform: `translate3d(${rotateY * 1.5}px, ${-rotateX * 1.5 - scrollYOffset * 0.4}px, 0px) scale(${isHovered ? 1.03 : 1})`,
          }}
        />

        {/* ================= LỚP 6.3: STICKER NGÔI SAO VÀNG [22.07 (4).png] ================= */}
        <img
          src="/22.07 (4).png"
          alt="Ngôi sao lấp lánh"
          className="absolute pointer-events-none object-contain z-25 animate-pulse transition-transform duration-300 ease-out"
          style={{
            left: "25.2%",
            top: "23.5%",
            width: "5.5%",
            transform: `translate3d(${rotateY * 2.5}px, ${-rotateX * 2.5 - scrollYOffset * 0.6}px, 0px) scale(${isHovered ? 1.15 : 1})`,
          }}
        />

        {/* ================= LỚP 7.2: CHỮ QUỐC MẠNH & LỜI MỜI [22.07 (text).png] ================= */}
        <div
          className="absolute z-30 flex flex-col items-center pointer-events-none transition-transform duration-300 ease-out"
          style={{
            left: "8%",
            width: "84%",
            top: "64.5%",
            transform: `translate3d(${rotateY * 1.2}px, ${-rotateX * 1.2 - scrollYOffset * 0.3}px, 0px)`,
          }}
        >
          <img
            src="/22.07 (text).png"
            alt="Quốc Mạnh - Thân mời bạn đến tham dự lễ tốt nghiệp của mình"
            className="w-full object-contain drop-shadow-sm animate-text-float"
          />
        </div>
      </div>

      {/* ================= LỚP 4: TÀU XANH TỐC HÀNH VẼ TAY (CHUYỂN ĐỘNG TỰ NHIÊN DẬP DỀNH) ================= */}
      <div
        className="absolute pointer-events-none z-35 transition-transform duration-300 ease-out"
        style={{
          left: "68%",
          top: "30%",
          width: "25.5%",
          transform: `translate3d(${rotateY * 2.2}px, ${-rotateX * 2.2 - scrollYOffset * 0.5}px, 0px)`,
        }}
      >
        <img
          src="/green-train-clean-full.png"
          alt="Tàu xanh tốc hành"
          className="w-full object-contain drop-shadow-xl animate-train-chug hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* ================= LỚP 6.2: TEM LÁ CỜ VIỆT NAM (CHUYỂN ĐỘNG PHẤT PHỚI TỰ NHIÊN) ================= */}
      <div
        className="absolute pointer-events-none z-40 transition-transform duration-300 ease-out"
        style={{
          left: "80.72%",
          top: showInfoBoxes ? "72.65%" : "82.5%",
          width: "11.13%",
          transform: `translate3d(${rotateY * 2.8}px, ${-rotateX * 2.8 - scrollYOffset * 0.55}px, 0px)`,
        }}
      >
        <img
          src="/22.07 (1).png"
          alt="Lá cờ Việt Nam"
          className={`w-full object-contain drop-shadow-lg transition-all duration-300 ${
            isHovered ? "rotate-0 scale-115" : "animate-flag-wave"
          }`}
        />
      </div>

      {/* ================= LỚP 6.1: TRÁI TIM CAM VIỀN TRẮNG [22.07 (2).png] (ĐÈ MÉP TRÁI THẺ GIẤY) ================= */}
      <img
        src="/22.07 (2).png"
        alt="Trái tim yêu thương"
        className="absolute pointer-events-none object-contain z-40 drop-shadow-xl transition-transform duration-300 ease-out animate-bounce"
        style={{
          left: "6.77%",
          top: "46.68%",
          width: "18.3%",
          animationDuration: "3s",
          transform: `translate3d(${rotateY * 2.5}px, ${-rotateX * 2.5 - scrollYOffset * 0.45}px, 0px) rotate(${isHovered ? 0 : -10}deg) scale(${isHovered ? 1.15 : 1})`,
        }}
      />

      {/* ================= LỚP 7.1: TIÊU ĐỀ NGHỆ THUẬT "THIỆP MỜI TỐT NGHIỆP" [22.07 (text2).png] (DỊCH LÊN ĐỂ CHE MỎM NHỌN TRẮNG) ================= */}
      <div
        className="absolute z-40 pointer-events-none flex justify-center transition-transform duration-300 ease-out"
        style={{
          left: "0%",
          width: "100%",
          top: "2.2%",
          transform: `translate3d(${rotateY * 1.8}px, ${-rotateX * 1.8 - scrollYOffset * 0.35}px, 0px) scale(${isHovered ? 1.03 : 1})`,
        }}
      >
        <img
          src="/22.07 (text2).png"
          alt="Thiệp mời Tốt nghiệp"
          className="w-[96%] max-w-[540px] object-contain drop-shadow-2xl animate-title-float"
        />
      </div>
      {showInfoBoxes && (
        <div
          className="absolute z-40 flex items-stretch gap-2 px-0"
          style={{
            left: "8.37%",
            width: "80.95%",
            top: "100.2%",
            height: "10.8%",
          }}
        >
          <div className="flex-1 rounded-[14px] sm:rounded-[18px] bg-[#0c1626]/85 hover:bg-[#121f35]/90 backdrop-blur-md text-white p-2 flex items-center gap-2 shadow-2xl border border-white/20 transition-all duration-300">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-sky-500/20 border border-sky-400/30 text-sky-300 flex items-center justify-center shrink-0">
              <Calendar size={14} />
            </div>
            <div className="flex flex-col justify-center min-w-0 leading-tight text-left">
              <span className="text-[7.5px] sm:text-[8.5px] uppercase tracking-wider text-slate-300 font-semibold truncate">
                Thời gian
              </span>
              <span className="font-bold text-[9.5px] sm:text-xs text-white mt-0.5 truncate">
                {timeRange}
              </span>
              <span className="text-[7.5px] sm:text-[8.5px] text-sky-300 font-medium truncate">
                {eventDate}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenVenueDrawer}
            className="flex-1 rounded-[14px] sm:rounded-[18px] bg-[#0c1626]/85 hover:bg-[#121f35]/90 backdrop-blur-md text-white p-2 flex items-center gap-2 shadow-2xl border border-white/20 hover:border-sky-400/50 transition-all duration-300 cursor-pointer group text-left"
            title="Bấm để xem bản đồ & trải nghiệm TDTU 360"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 text-blue-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <MapPin size={14} />
            </div>
            <div className="flex flex-col justify-center min-w-0 leading-tight text-left">
              <span className="text-[7.5px] sm:text-[8.5px] uppercase tracking-wider text-slate-300 font-semibold truncate">
                Địa điểm
              </span>
              <span className="font-bold text-[9.5px] sm:text-xs text-white mt-0.5 truncate group-hover:text-sky-200">
                Đại học Tôn Đức Thắng
              </span>
              <span className="text-[7.5px] sm:text-[8.5px] text-amber-300 font-medium truncate">
                Sảnh A, 19 Nguyễn Hữu Thọ
              </span>
            </div>
          </button>
        </div>
      )}

    </div>
  );
};
