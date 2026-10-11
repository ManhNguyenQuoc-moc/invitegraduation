"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { message, Drawer } from "antd";
import {
  CalendarPlus,
  MapPin,
  PhoneCall,
  X,
  Layers,
  Sparkles
} from "lucide-react";

// DTOs & Services
import { IInvitationDTO, IWishDTO } from "@/types/invitation.dto";
import { invitationService } from "@/services/invitationService";
import { INITIAL_MOCK_WISHES, getMockInvitationData } from "@/data/invitationMock";

// Sub-components
import {
  HeroSection,
  VenueAndDressCode
} from "./components";

export default function InvitationPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "";

  // Data State
  const [invitationData, setInvitationData] = useState<IInvitationDTO>(() => getMockInvitationData(slug));
  const [loading, setLoading] = useState(true);

  // Danh sách các tài nguyên hình ảnh quan trọng nhất của trang thiệp mời
  const CRITICAL_IMAGES = [
    "/wolf-logo-emblem.png",
    "/22.07 (3-clean).png",
    "/22.07 (5).png",
    "/22.07 (text).png",
    "/22.07 (text2).png",
    "/22.07 (1).png",
    "/22.07 (2).png",
    "/22.07 (4).png",
    "/green-train-clean-full.png",
    "/glenfinnan-viaduct-bg.jpg",
    "/sticker-crown.png",
    "/sticker-sparkle.png",
    "/sticker-burst.png",
    "/sticker-stars.png",
    "/sticker-sparkle-gold.png",
    "/train-clean-transparent.png?v=2"
  ];

  // Preload toàn bộ hình ảnh & dữ liệu: Đảm bảo TẤT CẢ ảnh được tải xong 100% vào bộ nhớ cache trước khi chuyển màn hình
  useEffect(() => {
    let isMounted = true;

    const preloadSingleImage = (src: string): Promise<boolean> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        if (img.complete) {
          resolve(true);
        } else {
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false); // Tránh bị treo nếu 1 ảnh phụ bị lỗi mạng
        }
      });
    };

    const preparePage = async () => {
      // 1. Preload song song toàn bộ ảnh quan trọng của Hero & Poster Card
      const imagesPromise = Promise.all(CRITICAL_IMAGES.map(preloadSingleImage));

      // 2. Tải dữ liệu thiệp mời
      const dataPromise = invitationService.getInvitationBySlug(slug).catch(() => null);

      // 3. Thời gian tối thiểu 900ms để hiệu ứng nhịp tim hiển thị mượt mà không bị giật
      const minDelayPromise = new Promise((r) => setTimeout(r, 900));

      const [, fetchedData] = await Promise.all([
        imagesPromise,
        dataPromise,
        minDelayPromise,
      ]);

      if (!isMounted) return;

      if (fetchedData) {
        setInvitationData(fetchedData);
      }

      setLoading(false);
    };

    preparePage();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Drawer địa điểm State
  const [isVenueDrawerOpen, setIsVenueDrawerOpen] = useState(false);

  // Floating Action Group Menu State
  const [isFloatMenuOpen, setIsFloatMenuOpen] = useState(false);

  // Wishes state (Sổ lưu bút)
  const [wishes, setWishes] = useState<IWishDTO[]>(INITIAL_MOCK_WISHES);

  // Add Wish handler (Sổ lưu bút)
  const handleAddWish = (newWish: IWishDTO) => {
    setWishes((prev) => [newWish, ...prev]);
    message.success("Lời chúc của bạn đã được ghi vào Sổ Lưu Bút thành công!");
  };

  // Calendar Event Generator (.ics)
  const downloadIcs = () => {
    const host = invitationData?.event?.host_name || "Nguyễn Quốc Mạnh";
    const uni = invitationData?.event?.university || "Đại học Tôn Đức Thắng";
    const loc = invitationData?.event?.location || "Đại học Tôn Đức Thắng";

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      `PRODID:-//${host}//Graduation Ceremony//VI`,
      "BEGIN:VEVENT",
      `SUMMARY:Lễ Trao Bằng Cử Nhân - ${host}`,
      `DESCRIPTION:Đại lễ tốt nghiệp và vinh danh Tân Cử Nhân ${host} tại ${uni}.`,
      `LOCATION:Sảnh A, ${loc}, Số 19 Nguyễn Hữu Thọ, P. Tân Phong, Quận 7, TP.HCM`,
      "DTSTART:20261023T040000Z",
      "DTEND:20261023T110000Z",
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `Le-Tot-Nghiep-${host.replace(/\s+/g, "-")}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#030A16] text-white flex flex-col items-center justify-center relative overflow-hidden select-none">
        {/* Background Ambience Orbs & Cosmic Deep Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/15 rounded-full blur-[140px]" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-blue-600/20 rounded-full blur-[110px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(14,165,233,0.12),transparent_70%)]" />
        </div>

        {/* Heartbeat Logo & Sleek Minimal Progress Bar Container */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative flex items-center justify-center w-48 h-48 sm:w-56 sm:h-56 mb-8">
            <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-sky-400/35 via-cyan-300/30 to-blue-600/40 blur-3xl animate-heartbeat-aura pointer-events-none" />
            <div className="relative z-20 w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center animate-heartbeat-logo">
              <img
                src="/wolf-logo-emblem.png"
                alt="Wolf Emblem Logo"
                loading="eager"
                decoding="sync"
                // @ts-ignore
                fetchPriority="high"
                className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(56,189,248,0.95)] contrast-[1.12] brightness-[1.18]"
              />
            </div>
          </div>

          <div className="w-52 sm:w-64 flex flex-col items-center gap-2">
            <div className="relative w-full h-1.5 sm:h-2 rounded-full bg-slate-900/80 border border-sky-400/25 overflow-hidden shadow-[0_0_15px_rgba(56,189,248,0.25)] backdrop-blur-md">
              <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-sky-400 to-cyan-200 rounded-full animate-progress-shimmer shadow-[0_0_12px_#38bdf8]" />
            </div>
            <div className="w-24 h-1 bg-sky-400/30 rounded-full blur-xs" />
          </div>
        </div>
      </div>
    );
  }

  const hostName = invitationData?.event?.host_name || "Nguyễn Quốc Mạnh";
  const university = invitationData?.event?.university || "Đại học Tôn Đức Thắng";
  const eventDate = invitationData?.event?.event_date || "23.10 - 2026";
  const eventTime = invitationData?.event?.event_time || "11h - 18h";
  const location = invitationData?.event?.location || "Đại học Tôn Đức Thắng";
  const theme = invitationData?.event?.theme || "CLASS OF 2026";
  const guestName = invitationData?.name || "Gia đình, Anh chị em & Bạn bè";
  const avatarUrl = invitationData?.event?.avatar_url || "/avatar-werewolf.png";

  return (
    <div className="w-full min-h-screen bg-[#030A16] text-slate-100 font-sans relative selection:bg-[#2563EB] selection:text-white overflow-x-hidden flex flex-col">
      {/* Background Ambience Orbs & Cosmic Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[620px] h-[620px] bg-blue-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-[35%] -right-40 w-[680px] h-[680px] bg-indigo-600/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[720px] h-[720px] bg-sky-500/10 rounded-full blur-[180px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
      </div>

      {/* SECTION 1: HERO SECTION CHỦ ĐẠO - FULL WIDTH 100% TRÀN VIỀN MÀN HÌNH */}
      <div className="w-full relative z-10">
        <HeroSection
          hostName={hostName}
          university={university}
          eventDate={eventDate}
          eventTime={eventTime}
          location={location}
          theme={theme}
          avatarUrl={avatarUrl}
          guestName={guestName}
          slug={slug}
          onDownloadIcs={downloadIcs}
          onOpenVenueDrawer={() => setIsVenueDrawerOpen(true)}
        />
      </div>

      {/* ================= SPEED DIAL / EXPANDABLE FLOATING ACTION BUTTON GROUP ================= */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end gap-3">
        {/* CÁC NÚT CON HIỂN THỊ KHI BẤM NÚT CHÍNH (EXPANDED ITEMS) */}
        <div
          className={`flex flex-col items-end gap-2.5 transition-all duration-300 origin-bottom ${isFloatMenuOpen
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
              : "opacity-0 scale-75 translate-y-4 pointer-events-none"
            }`}
        >
          {/* Nút Gọi Điện (Hotline) */}
          <div className="flex items-center gap-2 group">
            <span className="px-2.5 py-1 rounded-lg bg-[#0B192C]/90 border border-sky-400/20 text-sky-100 text-[11px] font-medium shadow-md backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
              Gọi Cử Nhân
            </span>
            <a
              href="tel:0865936210"
              title="Gọi điện cho cử nhân"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-[#0b3b44] to-[#0ea5e9] hover:from-[#0d4f5b] hover:to-[#38bdf8] text-white flex items-center justify-center shadow-lg shadow-sky-950/60 border border-teal-300/40 backdrop-blur-md transition-all hover:scale-110 active:scale-95 cursor-pointer ring-1 ring-teal-400/20"
            >
              <PhoneCall size={18} className="text-teal-100 drop-shadow" />
            </a>
          </div>

          {/* Nút Xem Địa Điểm (Mở Drawer từ dưới lên) */}
          <div className="flex items-center gap-2 group">
            <span className="px-2.5 py-1 rounded-lg bg-[#0B192C]/90 border border-sky-400/20 text-sky-100 text-[11px] font-medium shadow-md backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
              Vị Trí & Bản Đồ
            </span>
            <button
              onClick={() => {
                setIsVenueDrawerOpen(true);
                setIsFloatMenuOpen(false);
              }}
              type="button"
              title="Xem địa điểm & sơ đồ đỗ xe"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-[#0b2847] to-[#0284c7] hover:from-[#0f355c] hover:to-[#38bdf8] text-white flex items-center justify-center shadow-lg shadow-sky-950/60 border border-sky-300/40 backdrop-blur-md transition-all hover:scale-110 active:scale-95 cursor-pointer ring-1 ring-sky-400/20"
            >
              <MapPin size={18} className="text-sky-100 drop-shadow" />
            </button>
          </div>

          {/* Nút Lưu Lịch Hẹn */}
          <div className="flex items-center gap-2 group">
            <span className="px-2.5 py-1 rounded-lg bg-[#0B192C]/90 border border-sky-400/20 text-sky-100 text-[11px] font-medium shadow-md backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
              Lưu Vào Lịch
            </span>
            <button
              onClick={() => {
                downloadIcs();
                setIsFloatMenuOpen(false);
              }}
              type="button"
              title="Lưu lịch hẹn vào điện thoại"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-[#162055] to-[#3b82f6] hover:from-[#1e2c6f] hover:to-[#60a5fa] text-white flex items-center justify-center shadow-lg shadow-indigo-950/60 border border-indigo-300/40 backdrop-blur-md transition-all hover:scale-110 active:scale-95 cursor-pointer ring-1 ring-indigo-400/20"
            >
              <CalendarPlus size={18} className="text-indigo-100 drop-shadow" />
            </button>
          </div>
        </div>

        {/* NÚT CHÍNH (TRIGGER TOGGLE BUTTON) */}
        <button
          onClick={() => setIsFloatMenuOpen(!isFloatMenuOpen)}
          type="button"
          aria-label={isFloatMenuOpen ? "Đóng danh sách tiện ích" : "Mở danh sách tiện ích"}
          title={isFloatMenuOpen ? "Đóng tiện ích" : "Mở tiện ích nhanh"}
          className={`w-12 h-12 sm:w-13 sm:h-13 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 cursor-pointer border ${isFloatMenuOpen
              ? "bg-[#162238]/95 text-sky-200 border-sky-400/40 rotate-90 scale-95 shadow-black/80 ring-1 ring-sky-400/30 hover:bg-[#1f2e4d]"
              : "bg-gradient-to-tr from-[#0c2340] via-[#0284c7] to-[#38bdf8] text-white border-sky-300/60 hover:scale-110 active:scale-95 shadow-sky-950/80 hover:shadow-sky-500/50 ring-1 ring-white/30"
            }`}
        >
          {isFloatMenuOpen ? (
            <X size={20} className="transition-transform duration-300" />
          ) : (
            <div className="relative flex items-center justify-center">
              <Layers size={21} className="drop-shadow-md" />
            </div>
          )}
        </button>
      </div>

      {/* DRAWER ĐỊA ĐIỂM TRƯỢT TỪ DƯỚI LÊN (BOTTOM DRAWER) */}
      <Drawer
        placement="bottom"
        open={isVenueDrawerOpen}
        onClose={() => setIsVenueDrawerOpen(false)}
        height="88vh"
        closable={false}
        className="venue-info-drawer"
        styles={{
          body: {
            backgroundColor: "#030A16",
            padding: "0 16px env(safe-area-inset-bottom, 24px) 16px",
            color: "#FFFFFF",
            overflowY: "auto",
            overscrollBehavior: "contain"
          },
          section: {
            borderTopLeftRadius: "28px",
            borderTopRightRadius: "28px",
            backgroundColor: "#030A16",
            borderTop: "1px solid rgba(56, 189, 248, 0.35)",
            maxHeight: "88vh"
          }
        }}
      >
        <div className="w-full max-w-5xl mx-auto flex flex-col relative">
          {/* Header Ghim (Sticky Header) & Nút Đóng Trên Cùng */}
          <div className="sticky top-0 z-40 w-full flex items-center justify-between py-3.5 bg-[#030A16]/95 backdrop-blur-md border-b border-white/10 mb-4 pt-[calc(0.5rem+env(safe-area-inset-top,0px))]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              <span className="font-bold text-xs uppercase tracking-widest text-sky-300">
                Thông Tin Địa Điểm và Đỗ Xe
              </span>
            </div>

            {/* Nút X nổi bật, vùng bấm rộng chuẩn mobile (min 44px) */}
            <button
              onClick={() => setIsVenueDrawerOpen(false)}
              aria-label="Đóng bảng thông tin"
              title="Đóng"
              className="w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-white/15 hover:bg-white/25 active:bg-sky-500/30 text-slate-200 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 shadow-md shrink-0"
            >
              <X size={18} />
            </button>
          </div>

          {/* Nội dung VenueAndDressCode hiển thị bên trong Drawer */}
          <VenueAndDressCode university={university} hostName={hostName} />

          {/* Nút Đóng Lại ở chân trang (Footer Sticky / Bottom Action) để lướt xuống cuối không bị kẹt */}
          <div className="w-full pt-8 pb-4 flex justify-center">
            <button
              onClick={() => setIsVenueDrawerOpen(false)}
              type="button"
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-slate-200 hover:text-white text-xs font-bold uppercase tracking-wider border border-white/20 backdrop-blur-md transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <X size={15} />
              <span>Đóng Bảng Thông Tin</span>
            </button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
