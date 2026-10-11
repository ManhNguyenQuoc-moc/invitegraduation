import { NextRequest, NextResponse } from 'next/server';
import { getGuestsDb } from '@/services/hybridDb';
import eventFallback from '@/data/event.json';
import { IInvitationDTO } from '@/types/invitation.dto';

// GET: Lấy danh sách hoặc thiệp mặc định
export async function GET(req: NextRequest) {
  const guests = await getGuestsDb();

  const defaultInvitation: IInvitationDTO = {
    id: 'default',
    name: 'Gia đình, Anh chị em & Bạn bè',
    phone: '0865936210',
    personalized_slug: 'default',
    group_name: 'Khách Quý Thân Thiết',
    event: {
      title: 'LỄ TRAO BẰNG CỬ NHÂN',
      host_name: eventFallback.hostName || 'Nguyễn Quốc Mạnh',
      university: eventFallback.university || 'Đại học Tôn Đức Thắng',
      event_date: eventFallback.date || '23.10 - 2026',
      event_time: eventFallback.time || '11h - 18h',
      location: eventFallback.location || 'Đại học Tôn Đức Thắng',
      theme: eventFallback.theme || 'CLASS OF 2026',
      avatar_url: eventFallback.avatarUrl || '/avatar-werewolf.png',
    },
    rsvp: null,
  };

  return NextResponse.json({
    success: true,
    data: defaultInvitation,
    guestsCount: guests.length,
  });
}
