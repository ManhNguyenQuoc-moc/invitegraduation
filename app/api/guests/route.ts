import { NextRequest, NextResponse } from 'next/server';
import { readJsonFile, writeJsonFile } from '@/services/jsonDb';
import { IGuestItem } from '@/types/guest.dto';

const FILE_NAME = 'guests.json';

// GET: Lấy danh sách khách mời từ file JSON
export async function GET() {
  const guests = readJsonFile<IGuestItem[]>(FILE_NAME, []);
  return NextResponse.json({ success: true, data: guests });
}

// POST: Thêm 1 hoặc nhiều khách mời vào file JSON
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const guests = readJsonFile<IGuestItem[]>(FILE_NAME, []);

    if (Array.isArray(body)) {
      // Import hàng loạt
      const newGuests = [...body, ...guests];
      writeJsonFile(FILE_NAME, newGuests);
      return NextResponse.json({ success: true, data: newGuests, message: 'Đã import thành công danh sách khách mời!' });
    }

    // Thêm 1 khách
    const newGuest: IGuestItem = {
      id: body.id || Date.now().toString(),
      name: body.name || 'Khách Mời',
      phone: body.phone || 'Chưa có SĐT',
      slug: body.slug || `guest-${Date.now()}`,
      group: body.group || 'Bạn Bè',
      status: body.status || 'pending',
      attendingCount: body.attendingCount ?? 1,
      wishesCount: body.wishesCount ?? 0,
    };

    const newGuests = [newGuest, ...guests];
    writeJsonFile(FILE_NAME, newGuests);

    return NextResponse.json({ success: true, data: newGuest, message: 'Thêm khách mời thành công!' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// PUT: Cập nhật thông tin khách mời
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, slug, ...updates } = body;

    const guests = readJsonFile<IGuestItem[]>(FILE_NAME, []);
    const index = guests.findIndex((g) => (id ? g.id === id : g.slug === slug));

    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy khách mời!' }, { status: 404 });
    }

    guests[index] = { ...guests[index], ...updates };
    writeJsonFile(FILE_NAME, guests);

    return NextResponse.json({ success: true, data: guests[index], message: 'Cập nhật thành công!' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// DELETE: Xóa khách mời theo id hoặc slug
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');

    if (!id && !slug) {
      return NextResponse.json({ success: false, message: 'Thiếu id hoặc slug để xóa!' }, { status: 400 });
    }

    const guests = readJsonFile<IGuestItem[]>(FILE_NAME, []);
    const filtered = guests.filter((g) => (id ? g.id !== id : g.slug !== slug));

    writeJsonFile(FILE_NAME, filtered);

    return NextResponse.json({ success: true, message: 'Đã xóa khách mời thành công!' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
