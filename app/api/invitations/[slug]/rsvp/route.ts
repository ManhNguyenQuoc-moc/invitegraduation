import { NextRequest, NextResponse } from 'next/server';
import { getGuestsDb, saveGuestDb } from '@/services/hybridDb';
import { IGuestItem } from '@/types/guest.dto';

// PUT: Cập nhật phản hồi RSVP của khách trực tiếp vào DB
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const guests = await getGuestsDb();

    const existing = guests.find((g) => g.slug === slug);
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy khách mời!' }, { status: 404 });
    }

    const { status, plus_ones } = body;
    // Map DTO status sang format local
    const mappedStatus = status === 'ATTENDING' ? 'confirmed' : status === 'DECLINED' ? 'declined' : 'pending';
    
    const updatedGuest: IGuestItem = {
      ...existing,
      status: mappedStatus,
      attendingCount: status === 'ATTENDING' ? (plus_ones || 0) + 1 : 0,
    };

    await saveGuestDb(updatedGuest);

    return NextResponse.json({
      success: true,
      data: updatedGuest,
      message: 'Xác nhận tham dự thành công!'
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
