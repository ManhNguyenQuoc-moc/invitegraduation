import React, { useState, useEffect, useRef } from "react";
import {
  GraduationCap,
  Calendar,
  MapPin,
  Volume2,
  VolumeX,
  CalendarPlus,
  Sparkles,
  Train,
  Check,
  CheckCircle2,
  X,
  Heart,
  UserCheck,
  PhoneCall
} from "lucide-react";
import { CountdownTimer } from "./CountdownTimer";
import { GraduationPosterCard } from "./GraduationPosterCard";

interface IHeroSectionProps {
  hostName: string;
  university: string;
  eventDate: string;
  eventTime: string;
  location: string;
  theme: string;
  avatarUrl?: string;
  guestName?: string;
  slug?: string;
  onDownloadIcs?: () => void;
  onOpenVenueDrawer?: () => void;
}

export const HeroSection: React.FC<IHeroSectionProps> = ({
  hostName,
  university,
  eventDate,
  eventTime = "11h-18h",
  theme,
  guestName = "gia đình, anh chị em, bạn bè",
  onDownloadIcs,
  onOpenVenueDrawer
}) => {
  const trainBgImage = "/glenfinnan-viaduct-bg.jpg";
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Hiệu ứng rê chuột Spotlight động
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  // State 3D Tilt Parallax dành riêng cho Thẻ Tên Khách Mời
  const guestCardRef = useRef<HTMLDivElement>(null);
  const [guestTilt, setGuestTilt] = useState({ rotateX: 0, rotateY: 0, isHovered: false });

  const handleGuestPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!guestCardRef.current) return;
    const rect = guestCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 8; // Nghiêng tối đa 8 độ
    const rotateX = -((y - centerY) / centerY) * 8;
    setGuestTilt({ rotateX, rotateY, isHovered: true });
  };

  const handleGuestPointerLeave = () => {
    setGuestTilt({ rotateX: 0, rotateY: 0, isHovered: false });
  };

  // Cảm biến con quay hồi chuyển khi nghiêng điện thoại (Mobile Gyroscope 3D Parallax Tilt)
  useEffect(() => {
    let animFrame: number;

    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      // gamma: trục nghiêng trái sang phải (-90 đến 90 độ)
      // beta: trục nghiêng trước ra sau (-180 đến 180 độ, cầm tự nhiên khoảng 45 độ)
      const gamma = e.gamma ?? 0;
      const beta = e.beta ?? 45;

      // Chuẩn hóa góc cầm điện thoại tương tự poster:
      // Giới hạn gamma [-25, 25] -> map sang góc xoay Y [-6, 6] độ
      const targetRotateY = Math.max(-6, Math.min(6, (gamma / 25) * 6));
      // Trừ 45 độ góc cầm tự nhiên: map sang góc xoay X [-6, 6] độ
      const normalizedBeta = beta - 45;
      const targetRotateX = -Math.max(-6, Math.min(6, (normalizedBeta / 25) * 6));

      animFrame = requestAnimationFrame(() => {
        setGuestTilt({
          rotateX: Number(targetRotateX.toFixed(2)),
          rotateY: Number(targetRotateY.toFixed(2)),
          isHovered: true,
        });
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
            window.addEventListener("deviceorientation", handleDeviceOrientation, true);
            isListening = true;
          }
        } catch {
          // Người dùng chưa tương tác gesture
        }
      } else if ("DeviceOrientationEvent" in window) {
        window.addEventListener("deviceorientation", handleDeviceOrientation, true);
        isListening = true;
      }
    };

    // Khởi động trực tiếp
    startListening();

    // Trigger lại khi người dùng chạm vào màn hình (bắt buộc đối với iOS Safari để cấp quyền accelerometer)
    const onUserTouch = () => {
      startListening();
      window.removeEventListener("touchstart", onUserTouch);
      window.removeEventListener("click", onUserTouch);
    };

    window.addEventListener("touchstart", onUserTouch, { passive: true });
    window.addEventListener("click", onUserTouch, { passive: true });

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("deviceorientation", handleDeviceOrientation, true);
        window.removeEventListener("touchstart", onUserTouch);
        window.removeEventListener("click", onUserTouch);
      }
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="w-full min-h-screen relative scroll-mt-6 select-none bg-[#050E1D] text-white overflow-hidden flex flex-col justify-between"
    >

      {/* ================= BACKGROUND CHÍNH: HÌNH ẢNH NỀN GỐC ĐOÀN TÀU QUA CẦU GLENFINNAN ================= */}
      <div className="absolute inset-0 z-0">
        <img
          src={trainBgImage}
          alt="Chuyến tàu cử nhân vượt núi tri thức"
          className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.08]"
        />

        {/* Lớp phủ chuyển sắc nhẹ nhàng tinh tế để đọc rõ nội dung */}
        <div
          className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#030A16] via-transparent to-[#030A16]/50"
        />

        {/* Hai dải ánh sáng chùm quét Studio Beams di chuyển nhẹ nhàng */}
        <div className="absolute -top-32 left-1/4 w-[420px] h-[900px] bg-gradient-to-b from-sky-400/25 via-blue-500/10 to-transparent rotate-[-25deg] blur-3xl pointer-events-none animate-beam-sweep" />
        <div className="absolute -top-32 right-1/4 w-[420px] h-[900px] bg-gradient-to-b from-amber-300/15 via-sky-400/10 to-transparent rotate-[25deg] blur-3xl pointer-events-none" />

        {/* DÒNG ÁNH SÁNG THEO CHUỘT (Interactive Cursor Spotlight Effect) */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500 hidden lg:block"
          style={{
            opacity: isHovering ? 1 : 0.4,
            background: `radial-gradient(circle 500px at ${mousePos.x}% ${mousePos.y}%, rgba(56, 189, 248, 0.18), transparent 75%)`
          }}
        />
      </div>

      {/* ================= HEADER CONTROLS (CHỈ HIỂN THỊ TRÊN DESKTOP/MÀN HÌNH LỚN, MOBILE ĐÃ CÓ FLOAT BUTTONS) ================= */}
      <div className="relative z-20 w-full px-4 sm:px-8 lg:px-14 pt-6 hidden lg:flex items-center justify-end gap-3 animate-hero-fade-in">
        {/* Action Controls */}
        <div className="flex items-center gap-2">

          {onDownloadIcs && (
            <button
              onClick={onDownloadIcs}
              type="button"
              className="p-2 rounded-full bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white border border-white/15 backdrop-blur-md transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
              title="Lưu lịch hẹn"
            >
              <CalendarPlus size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ================= HERO CONTENT: CẤU TRÚC RESPONSIVE HỢP NHẤT (MOBILE & DESKTOP DÙNG CHUNG NỘI DUNG) ================= */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-1 sm:pt-4 lg:pt-8 pb-6 animate-hero-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 sm:gap-6 lg:gap-10 items-center">

          {/* CỘT THÔNG TIN: Ở dưới Poster trên mobile (order-2), ở bên trái 7 cột trên desktop (lg:order-1 lg:col-span-7) */}
          <div className="order-2 lg:order-1 lg:col-span-7 space-y-2.5 sm:space-y-4 lg:space-y-6 text-left w-full max-w-[540px] lg:max-w-none mx-auto lg:mx-0">

            {/* Header Tag & Tiêu Đề Cử Nhân Trên Desktop (hidden lg:block) */}
            <div className="hidden lg:block space-y-4">
              <div className="flex items-center">
                <span className="text-xs font-bold tracking-[0.25em] text-sky-300 uppercase">
                  EXPRESS DESTINATION • {theme || "CLASS OF 2026"}
                </span>
              </div>

              <div className="space-y-1">
                <span className="block font-serif italic text-lg xl:text-xl text-sky-200/90 tracking-wide">
                  Lễ Trao Bằng Tốt Nghiệp Cử Nhân
                </span>
                <h1 className="font-serif font-bold text-3xl sm:text-4xl xl:text-5xl text-white tracking-wider uppercase drop-shadow-lg leading-tight">
                  {hostName}
                </h1>
              </div>
            </div>

            {/* Lời mời trang trọng dành cho khách mời (Thẻ 3D Interactive Parallax với Sticker Layered) */}
            {guestName && (
              <div
                ref={guestCardRef}
                onPointerMove={handleGuestPointerMove}
                onPointerLeave={handleGuestPointerLeave}
                className="relative group border-l-0 sm:border-l-4 border-sky-400 px-3 sm:px-4 py-3 sm:py-3.5 space-y-2 bg-gradient-to-r from-sky-950/40 via-sky-900/20 to-transparent sm:bg-gradient-to-r sm:from-sky-950/50 sm:via-sky-900/25 sm:to-transparent rounded-2xl sm:rounded-none sm:rounded-r-2xl transition-transform duration-300 ease-out hover:border-sky-300 sm:shadow-[inset_2px_0_12px_rgba(56,189,248,0.3)] backdrop-blur-sm select-none cursor-pointer"
                style={{
                  transform: `perspective(900px) rotateX(${guestTilt.rotateX}deg) rotateY(${guestTilt.rotateY}deg) scale3d(${guestTilt.isHovered ? 1.02 : 1}, ${guestTilt.isHovered ? 1.02 : 1}, 1)`,
                  transformStyle: "preserve-3d",
                  touchAction: "pan-y"
                }}
              >
                {/* ================= LAYER 1: STICKER VƯƠNG MIỆN VÀNG (ĐỈNH TÊN KHÁCH MỜI) ================= */}
                <div
                  className="absolute pointer-events-none z-30 transition-transform duration-300 ease-out"
                  style={{
                    top: "-18px",
                    left: "50%",
                    transform: `translate3d(calc(-50% + ${guestTilt.rotateY * 2.2}px), ${-guestTilt.rotateX * 2.2}px, 28px) rotate(-6deg)`,
                  }}
                >
                  <img
                    src="/sticker-crown.png"
                    alt="Vương miện vinh danh"
                    className="w-10 h-10 sm:w-12 sm:h-12 object-contain drop-shadow-[0_4px_10px_rgba(245,158,11,0.5)] animate-bounce"
                    style={{ animationDuration: "2.8s" }}
                  />
                </div>

                {/* ================= LAYER 2: STICKER TIA SÁNG BỪNG LÊN (GÓC TRÊN BÊN PHẢI) ================= */}
                <div
                  className="absolute pointer-events-none z-20 transition-transform duration-300 ease-out hidden sm:block"
                  style={{
                    top: "-12px",
                    right: "12px",
                    transform: `translate3d(${guestTilt.rotateY * 1.8}px, ${-guestTilt.rotateX * 1.8}px, 20px) rotate(12deg)`,
                  }}
                >
                  <img
                    src="/sticker-sparkle.png"
                    alt="Tia sáng vui tươi"
                    className="w-7 h-7 sm:w-9 sm:h-9 object-contain drop-shadow-md animate-pulse"
                  />
                </div>

                {/* ================= LAYER 3: STICKER TIA TỎA SÁNG BURST (GÓC DƯỚI BÊN TRÁI) ================= */}
                <div
                  className="absolute pointer-events-none z-20 transition-transform duration-300 ease-out"
                  style={{
                    bottom: "-10px",
                    left: "-8px",
                    transform: `translate3d(${guestTilt.rotateY * 1.6}px, ${-guestTilt.rotateX * 1.6}px, 22px) rotate(-15deg)`,
                  }}
                >
                  <img
                    src="/sticker-burst.png"
                    alt="Tia tỏa sáng rực rỡ"
                    className="w-7 h-7 sm:w-8 sm:h-8 object-contain drop-shadow-md opacity-85"
                  />
                </div>

                {/* ================= LAYER 4: STICKER CHÙM SAO VÀNG LẤP LÁNH (GÓC DƯỚI BÊN PHẢI) ================= */}
                <div
                  className="absolute pointer-events-none z-25 transition-transform duration-300 ease-out"
                  style={{
                    bottom: "2px",
                    right: "-10px",
                    transform: `translate3d(${guestTilt.rotateY * 2.5}px, ${-guestTilt.rotateX * 2.5}px, 30px) rotate(8deg)`,
                  }}
                >
                  <img
                    src="/sticker-stars.png"
                    alt="Ngôi sao lấp lánh"
                    className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-[0_2px_8px_rgba(250,204,21,0.6)] animate-pulse"
                    style={{ animationDuration: "2s" }}
                  />
                </div>

                {/* NỘI DUNG CHÍNH (NỔI LAYER Z: 18px TRONG KHÔNG GIAN 3D) */}
                <div
                  className="relative z-10 transition-transform duration-300 ease-out"
                  style={{
                    transform: `translate3d(${guestTilt.rotateY * 0.8}px, ${-guestTilt.rotateX * 0.8}px, 16px)`
                  }}
                >
                  {/* Dòng Thân mời & Tên khách mời */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-baseline justify-center sm:justify-start gap-1.5 sm:gap-3 text-center sm:text-left pt-2">
                    <span className="font-nunito font-extrabold text-xs sm:text-xs uppercase tracking-wider text-sky-300 drop-shadow-sm shrink-0">
                      Thân mời
                    </span>

                    {/* Vùng hiển thị Tên khách mời kèm 2 tia sáng 2 bên (Chỉ hiển thị trên Mobile) */}
                    <div className="flex items-center justify-center gap-2.5 w-full sm:w-auto">
                      {/* Tia sáng vàng bên TRÁI (Chỉ xuất hiện trên mobile) */}
                      <img
                        src="/sticker-sparkle-gold.png"
                        alt="Tia sáng lấp lánh trái"
                        className="w-7 h-7 object-contain drop-shadow-[0_2px_10px_rgba(250,204,21,0.7)] animate-pulse block sm:hidden -scale-x-100 rotate-12 shrink-0 pointer-events-none"
                        style={{ animationDuration: "2.2s" }}
                      />

                      <span className="font-nunito font-black text-2xl xs:text-3xl sm:text-4xl xl:text-5xl text-white tracking-normal drop-shadow-[0_2px_14px_rgba(56,189,248,0.45)] leading-tight py-0.5 text-center sm:text-left [text-wrap:balance]">
                        {guestName === "Gia đình, Anh chị em & Bạn bè" ? (
                          <>
                            <span className="inline sm:inline">Gia đình, Anh chị em</span>
                            <span className="inline sm:inline"> & Bạn bè</span>
                          </>
                        ) : (
                          guestName
                        )}
                      </span>

                      {/* Tia sáng vàng bên PHẢI (Chỉ xuất hiện trên mobile) */}
                      <img
                        src="/sticker-sparkle-gold.png"
                        alt="Tia sáng lấp lánh phải"
                        className="w-7 h-7 object-contain drop-shadow-[0_2px_10px_rgba(250,204,21,0.7)] animate-pulse block sm:hidden rotate-12 shrink-0 pointer-events-none"
                        style={{ animationDuration: "2.2s" }}
                      />
                    </div>
                  </div>

                  {/* Lời chúc & thông điệp - Tối ưu ngắt dòng cân bằng đẹp mắt */}
                  <p className="text-xs sm:text-sm xl:text-[15px] text-slate-200 leading-relaxed font-light text-center sm:text-left mt-1.5 [text-wrap:balance] max-w-xl mx-auto sm:mx-0">
                    Đến chung vui và tham dự lễ tốt nghiệp của{" "}
                    <span className="font-medium text-white">mình</span> tại{" "}
                    <span className="font-medium text-sky-100">{university}</span>.
                    <br className="hidden sm:inline" />
                    {" "}Sự hiện diện của bạn là niềm vinh hạnh to lớn đối với mình và gia đình.
                  </p>
                </div>
              </div>
            )}

            {/* Hộp Thời Gian & Địa Điểm - Dạng lưới 2 cột co giãn */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
              <div className="p-2.5 sm:p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-2.5 sm:gap-3.5 hover:border-sky-400/40 hover:bg-white/10 transition-all duration-300 group cursor-pointer shadow-lg">
                {/* Icon ẩn trên mobile, hiện từ sm: trở lên */}
                <div className="hidden sm:flex p-2.5 sm:p-3 rounded-xl bg-sky-500/20 text-sky-300 shrink-0 group-hover:scale-110 group-hover:bg-sky-500/30 transition-all">
                  <Calendar size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[9px] sm:text-[11px] uppercase tracking-wider text-slate-400 font-medium group-hover:text-sky-200 transition-colors">
                    Thời Gian
                  </div>
                  <div className="font-bold text-xs sm:text-base text-white mt-0.5 leading-snug">
                    Thứ 6, 23.10.2026
                  </div>
                  <div className="text-[10px] sm:text-xs text-sky-300 font-medium mt-0.5">
                    11h00 - 18h00
                  </div>
                </div>
              </div>

              {/* Thẻ Thông Tin Địa Điểm (Thẻ hiển thị tĩnh) */}
              <div className="p-2.5 sm:p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-2.5 sm:gap-3.5 hover:border-blue-400/30 hover:bg-white/10 transition-all duration-300 text-left shadow-lg">
                <div className="hidden sm:flex p-2.5 sm:p-3 rounded-xl bg-blue-500/20 text-blue-300 shrink-0">
                  <MapPin size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[9px] sm:text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                    Địa Điểm | Sảnh A
                  </div>
                  <div className="font-bold text-xs sm:text-base text-white mt-0.5 leading-snug truncate sm:whitespace-normal">
                    {university}
                  </div>
                  <div className="text-[10px] sm:text-xs text-slate-300 font-light mt-0.5 line-clamp-2 sm:line-clamp-none">
                    19 Nguyễn Hữu Thọ, P. Tân Phong, Q7 TP.HCM.
                  </div>
                </div>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 pt-1 items-stretch">
              <a
                href="tel:0865936210"
                className="w-full min-h-[46px] px-3 sm:px-6 py-2.5 sm:py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider shadow-lg shadow-sky-500/25 flex items-center justify-center gap-1.5 sm:gap-2 transition-all hover:scale-105 active:scale-95 text-center leading-tight"
                title="Gọi điện cho cử nhân"
              >
                <PhoneCall size={14} className="text-white shrink-0" />
                <span className="truncate">LH: 0865 936 210</span>
              </a>

              {onOpenVenueDrawer ? (
                <button
                  type="button"
                  onClick={onOpenVenueDrawer}
                  className="w-full min-h-[46px] px-3 sm:px-6 py-2.5 sm:py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white font-semibold text-[11px] sm:text-xs uppercase tracking-wider border border-white/20 backdrop-blur-md transition-all hover:border-sky-300/40 flex items-center justify-center gap-1.5 sm:gap-2 hover:scale-105 active:scale-95 cursor-pointer text-center leading-tight"
                >
                  <MapPin size={14} className="text-sky-300 shrink-0" />
                  <span className="truncate">Vị Trí & Đỗ Xe</span>
                </button>
              ) : (
                <a
                  href="#location"
                  className="w-full min-h-[46px] px-3 sm:px-6 py-2.5 sm:py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white font-semibold text-[11px] sm:text-xs uppercase tracking-wider border border-white/20 backdrop-blur-md transition-all hover:border-sky-300/40 flex items-center justify-center gap-1.5 sm:gap-2 hover:scale-105 active:scale-95 text-center leading-tight"
                >
                  <MapPin size={14} className="text-sky-300 shrink-0" />
                  <span className="truncate">Vị Trí & Đỗ Xe</span>
                </a>
              )}
            </div>

            {/* Countdown Timer Dưới Nút Hành Động */}
            <div className="pt-2">
              <div className="w-full max-w-md">
                <CountdownTimer />
              </div>
            </div>

            {/* Thông điệp ở mobile: Nằm dưới cùng sau tất cả các thành phần */}
            <div className="block lg:hidden w-full text-center pt-1 pb-2">
              <span className="text-xs font-sans font-medium text-sky-200/90 tracking-wide drop-shadow-md cursor-default">
                Mong được gặp bạn trong ngày trọng đại này nhé!
              </span>
            </div>

          </div>

          {/* CỘT POSTER CARD: Ở trên cùng ở mobile (order-1), ở cột phải 5 cột trên desktop (lg:order-2 lg:col-span-5) */}
          <div className="order-1 lg:order-2 lg:col-span-5 flex flex-col items-center justify-center w-full">

            {/* Header Tag & Tiêu Đề Trên Mobile: Nằm trên đỉnh Poster Card, ẩn tên cử nhân (block lg:hidden) */}
            <div className="block lg:hidden w-full text-center mb-2.5 space-y-0.5">
              <span className="block text-[10px] font-bold tracking-[0.2em] text-sky-300 uppercase">
                EXPRESS DESTINATION • {theme || "CLASS OF 2026"}
              </span>
              <span className="block font-serif italic text-base sm:text-lg text-sky-200/90 tracking-wide">
                Lễ Trao Bằng Tốt Nghiệp Cử Nhân
              </span>
            </div>

            <div className="w-full max-w-[420px] sm:max-w-[460px] transition-transform duration-500 hover:scale-[1.02]">
              <GraduationPosterCard
                guestName={guestName}
                onOpenVenueDrawer={onOpenVenueDrawer}
                eventDate={eventDate}
                timeRange="Vào lúc 11h-18h"
                showInfoBoxes={false}
                className="w-full drop-shadow-2xl"
              />
            </div>

            {/* Thông điệp trên Desktop: Nằm dưới Poster Card */}
            <div className="hidden lg:block w-full max-w-[460px] text-center mt-3 px-4">
              <span className="text-xs xl:text-sm font-sans font-medium text-sky-200/90 tracking-wide drop-shadow-md hover:text-white transition-colors duration-300 cursor-default">
                Mong được gặp bạn trong ngày trọng đại này! Thương mến!
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ================= 3. ĐIỂM NỐI 2 SECTION: HÌNH ĐOÀN TÀU TỐC HÀNH VƯỢT THÀNH PHỐ VÀ RỪNG CÂY ================= */}
      <div className="relative w-full z-10 pointer-events-none mt-2 sm:mt-4 overflow-hidden">

        {/* KHUNG CẢNH TOÀN CẢNH: THÀNH PHỐ, RỪNG THÔNG, CÂY CẦU & ĐƯỜNG RAY */}
        <div className="relative w-full h-44 sm:h-56 md:h-64 flex items-end">

          {/* LỚP 1: ĐƯỜNG Chân Trời Thành Phố (City Skyline Silhouette) với những ô cửa sổ sáng đèn */}
          <div className="absolute bottom-6 sm:bottom-10 md:bottom-12 left-0 w-full z-0 opacity-40">
            <svg
              className="w-full h-24 sm:h-32 md:h-36 text-[#0A2240]"
              viewBox="0 0 1440 200"
              preserveAspectRatio="none"
              fill="currentColor"
            >
              {/* Các khối tòa nhà chọc trời cao thấp, tháp truyền hình & kiến trúc đô thị */}
              <path d="M0,200 L0,140 L35,140 L35,110 L60,110 L60,95 L80,95 L80,60 L85,40 L90,60 L90,95 L115,95 L115,130 L150,130 L150,150 L190,150 L190,80 L225,80 L225,120 L270,120 L270,100 L300,100 L300,50 L310,50 L310,30 L313,20 L316,30 L316,50 L330,50 L330,140 L380,140 L380,110 L420,110 L420,135 L470,135 L470,75 L510,75 L510,95 L540,95 L540,140 L590,140 L590,65 L610,65 L610,45 L620,35 L625,15 L630,35 L640,45 L640,65 L660,65 L660,125 L710,125 L710,90 L750,90 L750,145 L800,145 L800,85 L840,85 L840,115 L880,115 L880,55 L890,55 L895,30 L900,55 L915,55 L915,135 L960,135 L960,105 L1000,105 L1000,70 L1035,70 L1035,120 L1080,120 L1080,85 L1120,85 L1120,140 L1170,140 L1170,60 L1185,45 L1190,25 L1195,45 L1210,60 L1210,110 L1250,110 L1250,135 L1300,135 L1300,90 L1340,90 L1340,125 L1390,125 L1390,150 L1440,150 L1440,200 Z" />
            </svg>

            {/* Các chấm sáng li ti mô phỏng đèn các tòa nhà ban đêm */}
            <div className="absolute inset-0 flex justify-around items-end pb-8 pointer-events-none">
              <span className="w-1.5 h-1.5 bg-amber-300/70 rounded-xs shadow-[0_0_6px_#fcd34d] animate-pulse" />
              <span className="w-1 h-2 bg-sky-300/80 rounded-xs shadow-[0_0_6px_#7dd3fc]" />
              <span className="w-1.5 h-1.5 bg-amber-200/60 rounded-xs" />
              <span className="w-1 h-1.5 bg-cyan-300/70 rounded-xs shadow-[0_0_5px_#67e8f9] animate-pulse" />
              <span className="w-2 h-1 bg-amber-300/60 rounded-xs" />
              <span className="w-1.5 h-1.5 bg-sky-200/80 rounded-xs" />
              <span className="w-1 h-1 bg-amber-300/70 rounded-xs" />
              <span className="w-1.5 h-2 bg-sky-300/75 rounded-xs animate-pulse" />
            </div>
          </div>

          {/* LỚP 2: RẶNG CÂY XANH / HÀNG THÔNG (Pine Trees Silhouette) Phía Sau Đường Ray */}
          <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-0 w-full z-[5] opacity-75">
            <svg
              className="w-full h-16 sm:h-24 md:h-28 text-[#061426]"
              viewBox="0 0 1440 120"
              preserveAspectRatio="none"
              fill="currentColor"
            >
              {/* Rừng cây thông đan xen tự nhiên */}
              <path d="M0,120 L0,90 L20,70 L40,90 L55,60 L70,90 L90,75 L110,95 L130,55 L150,95 L175,70 L200,90 L220,60 L240,90 L260,75 L285,50 L310,85 L340,65 L370,95 L400,60 L430,90 L460,70 L490,55 L520,85 L550,65 L580,95 L610,50 L640,90 L670,70 L700,55 L730,90 L760,65 L790,50 L820,85 L850,70 L880,95 L910,60 L940,90 L970,55 L1000,85 L1030,65 L1060,50 L1090,85 L1120,70 L1150,95 L1180,60 L1210,85 L1240,55 L1270,90 L1300,70 L1330,55 L1360,85 L1390,65 L1420,50 L1440,75 L1440,120 Z" />
            </svg>
          </div>

          {/* ĐOÀN TÀU TỐC HÀNH VECTOR TRONG SUỐT VỚI KHÓI UỐN LƯỢN VÀ ĐƯỜNG RAY PHẲNG GỌN GÀNG */}
          <div className="absolute bottom-3 sm:bottom-5 md:bottom-7 left-0 w-[550px] sm:w-[750px] md:w-[950px] z-10 animate-train-ride">
            <div className="relative flex items-end">
              <img
                src="/train-clean-transparent.png?v=2"
                alt="Đoàn tàu tốc hành cử nhân"
                className="w-full h-auto object-contain object-bottom filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.55)]"
              />

              {/* Ánh đèn pha vàng kim chiếu sáng từ mũi đầu máy xe lửa (hướng sang phải) */}
              <div className="absolute -right-8 sm:-right-12 bottom-2 w-32 sm:w-48 h-10 bg-gradient-to-l from-amber-400/70 via-amber-200/25 to-transparent rounded-full blur-md rotate-[2deg] pointer-events-none" />
            </div>
          </div>

          {/* LỚP 4: HÀNG CÂY BỤI & ĐỒI CỎ TIỀN CẢNH (Foreground Trees & Hills) Phía Trước Đè Nhẹ Chân Ray */}
          <div className="absolute bottom-0 left-0 w-full z-15 opacity-90 pointer-events-none">
            <svg
              className="w-full h-8 sm:h-12 md:h-16 text-[#040D1B]"
              viewBox="0 0 1440 80"
              preserveAspectRatio="none"
              fill="currentColor"
            >
              {/* Những bụi cây và tán thông tiền cảnh nhấp nhô sống động */}
              <path d="M0,80 L0,50 Q40,30 80,50 Q110,25 140,45 Q190,15 240,45 Q290,30 340,55 Q390,20 440,50 Q500,25 560,50 Q620,15 680,45 Q740,30 800,50 Q860,18 920,48 Q980,28 1040,52 Q1100,16 1160,46 Q1220,32 1280,52 Q1340,20 1400,48 L1440,45 L1440,80 Z" />
            </svg>
          </div>

          {/* DẢI CHUYỂN TIẾP MỀM MẠI NỐI LIỀN SECTION PHÍA DƯỚI (#030A16) */}
          <svg
            className="w-full h-12 sm:h-16 md:h-20 text-[#030A16] relative z-20 block"
            viewBox="0 0 1440 180"
            preserveAspectRatio="none"
            fill="currentColor"
          >
            <path
              d="M0,60 C240,30 480,85 720,50 C960,15 1200,70 1440,40 L1440,180 L0,180 Z"
            />
          </svg>

          {/* LỚP SƯƠNG ĐÊM HUYỀN ẢO DƯỚI ĐƯỜNG TÀU */}
          <div className="absolute -bottom-2 left-[-5%] w-[110%] h-14 sm:h-20 opacity-95 z-30 flex items-center justify-between px-8 pointer-events-none">
            {/* Cụm mây bên trái */}
            <div className="flex items-center space-x-[-18px] opacity-90 animate-cloud-drift-1">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-[#030A16] rounded-full blur-[2px]" />
              <div className="w-24 h-24 sm:w-36 sm:h-36 bg-[#030A16] rounded-full -translate-y-3 blur-[3px]" />
              <div className="w-20 h-20 sm:w-28 sm:h-28 bg-[#030A16] rounded-full blur-[2px]" />
            </div>

            {/* Cụm mây giữa */}
            <div className="hidden md:flex items-center space-x-[-12px] opacity-70">
              <div className="w-16 h-16 bg-[#030A16] rounded-full blur-[3px]" />
              <div className="w-28 h-28 bg-[#030A16] rounded-full -translate-y-2 blur-[2px]" />
              <div className="w-20 h-20 bg-[#030A16] rounded-full blur-[3px]" />
            </div>

            {/* Cụm mây bên phải */}
            <div className="flex items-center space-x-[-20px] opacity-90 animate-cloud-drift-2">
              <div className="w-20 h-20 sm:w-28 sm:h-28 bg-[#030A16] rounded-full blur-[2px]" />
              <div className="w-28 h-28 sm:w-40 sm:h-40 bg-[#030A16] rounded-full -translate-y-4 blur-[3px]" />
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-[#030A16] rounded-full blur-[2px]" />
            </div>
          </div>

        </div>
      </div>

    </section>
  );
};
