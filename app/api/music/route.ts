import { NextRequest, NextResponse } from 'next/server';
import { readJsonFile, writeJsonFile } from '@/services/jsonDb';
import { ITrack } from '@/data/musicPlaylist';

const FILE_NAME = 'music.json';

// GET: Lấy toàn bộ danh sách nhạc nền từ data/music.json
export async function GET() {
  const tracks = readJsonFile<ITrack[]>(FILE_NAME, []);
  return NextResponse.json({ success: true, data: tracks });
}

// POST: Thêm 1 bài hát mới vào danh sách phát
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tracks = readJsonFile<ITrack[]>(FILE_NAME, []);

    if (Array.isArray(body)) {
      writeJsonFile(FILE_NAME, body);
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

    const updated = [newTrack, ...tracks];
    writeJsonFile(FILE_NAME, updated);

    return NextResponse.json({
      success: true,
      data: newTrack,
      message: 'Đã thêm bài hát vào danh sách phát và lưu vào data/music.json!'
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi máy chủ khi thêm nhạc' }, { status: 500 });
  }
}

// DELETE: Xóa bài hát khỏi file JSON theo id
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Thiếu ID bài hát cần xóa' }, { status: 400 });
    }

    const tracks = readJsonFile<ITrack[]>(FILE_NAME, []);
    const filtered = tracks.filter((t) => t.id !== id);

    writeJsonFile(FILE_NAME, filtered);

    return NextResponse.json({
      success: true,
      data: filtered,
      message: 'Đã xóa bài hát khỏi data/music.json!'
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi khi xóa bài hát' }, { status: 500 });
  }
}
