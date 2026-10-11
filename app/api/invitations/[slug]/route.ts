import { NextRequest, NextResponse } from 'next/server';
import { getGuestsDb } from '@/services/hybridDb';
import { IGuestItem } from '@/types/guest.dto';
import eventFallback from '@/data/event.json';
import { IInvitationDTO } from '@/types/invitation.dto';

// GET: Lấy thông tin thiệp mời theo slug từ DB
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const guests = await getGuestsDb();
  
  const found = guests.find((g) => g.slug === slug);
  const guestName = found ? found.name : (slug ? 'Quý Bạn & Anh Chị' : 'Quý Bạn & Anh Chị');
  const groupName = found ? found.group : 'Khách Quý Thân Thiết';

  const invitation: IInvitationDTO = {
    id: found ? found.id : `guest-${slug || 'default'}`,
    name: guestName,
    phone: found?.phone || '0865936210',
    personalized_slug: slug || 'default',
    group_name: groupName,
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
    rsvp: found
      ? {
          status: found.status === 'confirmed' ? 'ATTENDING' : found.status === 'declined' ? 'DECLINED' : 'PENDING',
          plus_ones: found.attendingCount > 1 ? found.attendingCount - 1 : 0,
        }
      : null,
  };

  return NextResponse.json({ success: true, data: invitation });
}
