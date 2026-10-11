import { NextRequest, NextResponse } from 'next/server';
import { readJsonFile, writeJsonFile } from '@/services/jsonDb';
import { IGuestItem } from '@/types/guest.dto';

const FILE_NAME = 'guests.json';

// PUT: Cập nhật phản hồi RSVP của khách trực tiếp vào data/guests.json
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const guests = readJsonFile<IGuestItem[]>(FILE_NAME, []);

    const index = guests.findIndex((g) => g.slug === slug);
    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy khách mời!' }, { status: 404 });
    }

    const { status, plus_ones, note } = body;
    // Map DTO status sang format local
    const mappedStatus = status === 'ATTENDING' ? 'confirmed' : status === 'DECLINED' ? 'declined' : 'pending';
    
    guests[index] = {
      ...guests[index],
      status: mappedStatus,
      attendingCount: status === 'ATTENDING' ? (plus_ones || 0) + 1 : 0,
    };

    writeJsonFile(FILE_NAME, guests);

    return NextResponse.json({
      success: true,
      data: guests[index],
      message: 'Xác nhận tham dự thành công!'
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
