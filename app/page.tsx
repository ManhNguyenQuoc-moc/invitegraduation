import { redirect } from 'next/navigation';

export default function RootPage() {
  // Mặc định khi vào trang chủ sẽ chuyển hướng thẳng về trang thiệp mời
  redirect('/invite');
}
