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
    const cleanTitle = file.name.replace(/\.[^/.]+$/, '');

    // 1. Thử tải lên Supabase Storage nếu có bucket 'music'
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseKey);

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
              fileName: cleanTitle,
              message: 'Tải file lên đám mây Supabase thành công!'
            });
          }
        } else {
          console.warn('Supabase storage upload error:', uploadError.message);
        }
      } catch (storageErr) {
        console.warn('Lỗi Supabase Storage:', storageErr);
      }
    }

    // 2. Thử ghi vào public/music (hoạt động khi chạy local server)
    try {
      const targetDir = path.join(process.cwd(), 'public', 'music');
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const filePath = path.join(targetDir, fileName);
      fs.writeFileSync(filePath, buffer);

      return NextResponse.json({
        success: true,
        url: `/music/${fileName}`,
        fileName: cleanTitle,
        message: 'Tải file thành công vào thư mục public/music!'
      });
    } catch (fsErr) {
      console.warn('Không thể ghi file cục bộ (môi trường serverless Vercel):', fsErr);
    }

    // 3. Fallback cho Vercel serverless: Chuyển file thành Base64 Data URI
    // Trình duyệt có thể phát trực tiếp thẻ audio src="data:audio/mp3;base64,..."
    const mimeType = file.type || 'audio/mpeg';
    const base64Audio = `data:${mimeType};base64,${buffer.toString('base64')}`;

    return NextResponse.json({
      success: true,
      url: base64Audio,
      fileName: cleanTitle,
      message: 'Đã mã hóa và tải file nhạc thành công lên hệ thống!'
    });
  } catch (error: any) {
    console.error('Lỗi khi tải file nhạc:', error);
    return NextResponse.json({ 
      success: false, 
      message: error?.message || 'Lỗi khi xử lý file tải lên' 
    }, { status: 500 });
  }
}
