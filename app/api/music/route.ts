import { NextRequest, NextResponse } from 'next/server';
import { getMusicDb, saveTrackDb, replaceMusicDb, deleteTrackDb } from '@/services/hybridDb';
import { ITrack } from '@/data/musicPlaylist';

// GET: Lấy toàn bộ danh sách nhạc nền từ DB
export async function GET() {
  const tracks = await getMusicDb();
  return NextResponse.json({ success: true, data: tracks });
}

// POST: Thêm 1 bài hát mới hoặc ghi đè danh sách phát
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (Array.isArray(body)) {
      await replaceMusicDb(body);
      return NextResponse.json({ success: true, data: body, message: 'Đã cập nhật danh sách bài hát!' });
    }

    if (!body.title || !body.url) {
      return NextResponse.json({ success: false, message: 'Thiếu tên bài hát hoặc URL âm thanh!' }, { status: 400 });
    }

    const newTrack: ITrack = {
      id: body.id || `track-${Date.now()}`,
      title: body.title,
      artist: body.artist || 'Tùy chọn',
      url: body.url,
      tag: body.tag || 'Nhạc tùy chỉnh',
      isCustom: true,
    };

    await saveTrackDb(newTrack);

    return NextResponse.json({
      success: true,
      data: newTrack,
      message: 'Đã thêm bài hát vào danh sách phát thành công!'
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi máy chủ khi thêm nhạc' }, { status: 500 });
  }
}

// DELETE: Xóa bài hát khỏi DB theo id
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get('id');

    if (!id) {
      try {
        const body = await req.json();
        id = body?.id;
      } catch {
        // không có json body
      }
    }

    if (!id) {
      return NextResponse.json({ success: false, message: 'Thiếu ID bài hát cần xóa' }, { status: 400 });
    }

    await deleteTrackDb(id);
    const updated = await getMusicDb();

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Đã xóa bài hát thành công!'
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi khi xóa bài hát' }, { status: 500 });
  }
}
