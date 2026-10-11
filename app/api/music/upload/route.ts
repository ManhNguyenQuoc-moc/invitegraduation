import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy file tải lên!' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Chuẩn hóa tên file an toàn
    const originalName = file.name || 'audio.mp3';
    const ext = path.extname(originalName) || '.mp3';
    const baseName = path.basename(originalName, ext)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9_-]/g, '-');
    
    const targetDir = path.join(process.cwd(), 'public', 'music');
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const fileName = `${baseName}-${Date.now()}${ext}`;
    const filePath = path.join(targetDir, fileName);

    fs.writeFileSync(filePath, buffer);

    // Trả về URL tĩnh trực tiếp trong public
    const publicUrl = `/music/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: file.name.replace(/\.[^/.]+$/, ''),
      message: 'Tải file thành công vào public/music!'
    });
  } catch (error) {
    console.error('Lỗi khi tải file nhạc lên public:', error);
    return NextResponse.json({ success: false, message: 'Lỗi khi lưu file lên máy chủ' }, { status: 500 });
  }
}
