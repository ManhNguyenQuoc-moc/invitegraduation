import { NextRequest, NextResponse } from 'next/server';
import { getGuestsDb, saveGuestDb, bulkInsertGuestsDb, deleteGuestDb } from '@/services/hybridDb';
import { IGuestItem } from '@/types/guest.dto';

// GET: Lấy danh sách khách mời từ DB
export async function GET() {
  const guests = await getGuestsDb();
  return NextResponse.json({ success: true, data: guests });
}

// POST: Thêm 1 hoặc nhiều khách mời
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (Array.isArray(body)) {
      // Import hàng loạt
      await bulkInsertGuestsDb(body);
      const updated = await getGuestsDb();
      return NextResponse.json({ success: true, data: updated, message: 'Đã import thành công danh sách khách mời!' });
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

    await saveGuestDb(newGuest);

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

    const guests = await getGuestsDb();
    const existing = guests.find((g) => (id ? g.id === id : g.slug === slug));

    if (!existing) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy khách mời!' }, { status: 404 });
    }

    const updatedGuest: IGuestItem = { ...existing, ...updates };
    await saveGuestDb(updatedGuest);

    return NextResponse.json({ success: true, data: updatedGuest, message: 'Cập nhật thành công!' });
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

    await deleteGuestDb(id, slug);

    return NextResponse.json({ success: true, message: 'Đã xóa khách mời thành công!' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
