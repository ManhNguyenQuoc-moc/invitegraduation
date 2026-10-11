import { IInvitationDTO, IWishDTO } from "../types/invitation.dto";
import eventFallback from "./event.json";

// Danh sách khách mời mẫu có sẵn slug để preview / builder chỉnh sửa
export const MOCK_GUESTS_LIST = [
  { slug: "nguyen-van-b", name: "Nguyễn Văn B", group: "Bạn Bè Đồng Môn" },
  { slug: "nguyen-van-a", name: "Nguyễn Văn A", group: "Bạn Bè" },
  { slug: "tran-thi-b", name: "Trần Thị B", group: "Đồng Nghiệp" },
  { slug: "le-hoang-c", name: "Lê Hoàng C", group: "Người Thân" },
  { slug: "thay-le-dinh-vu", name: "Thầy TS. Lê Đình Vũ", group: "Giảng Viên Hướng Dẫn" },
  { slug: "khach-moi", name: "Quý Khách Mời Danh Dự", group: "Khách Quý VIP" },
];

export const getMockInvitationData = (slug: string = ""): IInvitationDTO => {
  const foundGuest = MOCK_GUESTS_LIST.find(g => g.slug === slug);
  const defaultGuestName = "Gia đình, Anh chị em & Bạn bè";
  const guestName = foundGuest ? foundGuest.name : defaultGuestName;
  const groupName = foundGuest ? foundGuest.group : "Khách Quý Thân Thiết";

  return {
    id: `guest-${slug || "default"}`,
    name: guestName,
    phone: "0865936210",
    personalized_slug: slug || "default",
    group_name: groupName,
    event: {
      title: "LỄ TRAO BẰNG CỬ NHÂN",
      host_name: eventFallback.hostName || "Nguyễn Quốc Mạnh",
      university: eventFallback.university || "Đại học Tôn Đức Thắng",
      event_date: eventFallback.date || "23.10 - 2026",
      event_time: eventFallback.time || "11h - 18h",
      location: eventFallback.location || "Đại học Tôn Đức Thắng",
      theme: eventFallback.theme || "CLASS OF 2026",
      avatar_url: eventFallback.avatarUrl || "/avatar-werewolf.png"
    },
    rsvp: null
  };
};

export const INITIAL_MOCK_WISHES: IWishDTO[] = [
  {
    id: 1,
    author: "Thầy TS. Lê Đình Vũ",
    relation: "Giảng viên hướng dẫn",
    relationColor: "bg-blue-100 text-blue-900 border-blue-200",
    content:
      "“Chúc mừng Quốc Mạnh - chàng sinh viên xuất sắc, kiên định và luôn đam mê sáng tạo công nghệ. Tấm bằng Cử nhân hôm nay là bước đệm vững chắc cho em trên con đường sự nghiệp tương lai!”",
    time: "Hôm qua lúc 19:45"
  },
  {
    id: 2,
    author: "Gia Đình Bác Hai & Các Chị",
    relation: "Họ hàng thân thiết",
    relationColor: "bg-slate-100 text-slate-800 border-slate-300",
    content:
      "“Cả nhà vô cùng tự hào về Mạnh! Mới ngày nào còn háo hức bước chân vào giảng đường Tôn Đức Thắng mà nay đã hoàn thành xuất sắc chặng đường đại học rồi. Chúc con luôn vững vàng và thành công rực rỡ!”",
    time: "Hôm nay lúc 08:12"
  },
  {
    id: 3,
    author: "Hội Bạn Thân TDTU K22",
    relation: "Bạn bè đồng môn",
    relationColor: "bg-cyan-50 text-cyan-800 border-cyan-200",
    content:
      "“Chúc mừng bạn thân chí cốt của tụi tao! Cảm ơn 4 năm thanh xuân cùng nhau thức đêm làm đồ án tốt nghiệp. Ngày 23/10 này tụi tao sẽ có mặt sớm nhất để chụp ảnh cháy máy cùng mày nhé!”",
    time: "Hôm nay lúc 09:30"
  }
];
