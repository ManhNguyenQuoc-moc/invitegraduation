"use client";

import InvitationPage from "./[slug]/page";

// Khi người dùng truy cập /invite (không có slug cụ thể của từng khách)
// Hệ thống sẽ render trực tiếp giao diện thiệp mời với template mặc định: "Kính mời Quý Bạn & Anh Chị"
export default function DefaultInvitationPage() {
  return <InvitationPage />;
}
