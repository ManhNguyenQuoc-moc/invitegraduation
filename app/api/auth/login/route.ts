import { NextRequest, NextResponse } from 'next/server';
import { readJsonFile } from '@/services/jsonDb';

interface IUserAccount {
  id: string;
  username: string;
  password: string;
  name: string;
  role: string;
}

const FILE_NAME = 'auth.json';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    const users = readJsonFile<IUserAccount[]>(FILE_NAME, [
      {
        id: "1",
        username: "admin",
        password: "manhnecon",
        name: "Nguyễn Quốc Mạnh (Host)",
        role: "ADMIN"
      }
    ]);

    const targetUser = users.find(
      u => (u.username.toLowerCase() === (username || '').trim().toLowerCase()) && u.password === (password || '').trim()
    );

    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: 'Tài khoản hoặc mật khẩu không chính xác!' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        token: `mock_jwt_token_${targetUser.id}_${Date.now()}`,
        user: {
          id: targetUser.id,
          username: targetUser.username,
          name: targetUser.name,
          role: targetUser.role
        }
      },
      message: 'Đăng nhập thành công!'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Lỗi máy chủ khi đăng nhập' },
      { status: 500 }
    );
  }
}
