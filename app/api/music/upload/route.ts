import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'API Music Upload Endpoint hoạt động bình thường (Hỗ trợ phương thức POST multipart/form-data).'
  });
}

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
    
    const fileName = `${baseName}-${Date.now()}${ext}`;

    // Kiểm tra nếu có Supabase Storage (Ưu tiên lưu đám mây khi chạy trên Vercel)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Upload vào bucket 'music'
        const { error: uploadError } = await supabase.storage
          .from('music')
          .upload(fileName, buffer, {
            contentType: file.type || 'audio/mpeg',
            upsert: true,
          });

        if (!uploadError) {
          const { data: publicData } = supabase.storage.from('music').getPublicUrl(fileName);
          if (publicData?.publicUrl) {
            return NextResponse.json({
              success: true,
              url: publicData.publicUrl,
              fileName: file.name.replace(/\.[^/.]+$/, ''),
              message: 'Tải file lên đám mây Supabase thành công!'
            });
          }
        }
      } catch (storageErr) {
        console.warn('Lỗi upload qua Supabase Storage, chuyển sang lưu public local:', storageErr);
      }
    }

    // Fallback lưu local trong public/music khi chạy local
    const targetDir = path.join(process.cwd(), 'public', 'music');
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const filePath = path.join(targetDir, fileName);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/music/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: file.name.replace(/\.[^/.]+$/, ''),
      message: 'Tải file thành công vào public/music!'
    });
  } catch (error) {
    console.error('Lỗi khi tải file nhạc:', error);
    return NextResponse.json({ success: false, message: 'Lỗi khi lưu file lên máy chủ' }, { status: 500 });
  }
}
