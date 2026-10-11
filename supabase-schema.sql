-- BƯỚC 1: TẠO BẢNG KHÁCH MỜI (GUESTS)
create table if not exists public.guests (
  id text primary key,
  name text not null,
  phone text default 'Chưa có SĐT',
  slug text unique not null,
  "group" text default 'Bạn Bè',
  status text default 'pending',
  "attendingCount" int default 1,
  "wishesCount" int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- BƯỚC 2: TẠO BẢNG DANH SÁCH NHẠC (MUSIC)
create table if not exists public.music (
  id text primary key,
  title text not null,
  artist text default 'Tùy chọn',
  url text not null,
  tag text default 'Nhạc Tự Chọn',
  "isCustom" boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- BƯỚC 3: MỞ QUYỀN ĐỌC GHI CHO APP
alter table public.guests enable row level security;
alter table public.music enable row level security;

create policy "Cho phép toàn quyền khách mời" on public.guests for all using (true) with check (true);
create policy "Cho phép toàn quyền nhạc" on public.music for all using (true) with check (true);

-- BƯỚC 4: NẠP DỮ LIỆU BAN ĐẦU
insert into public.guests (id, name, phone, slug, "group", status, "attendingCount", "wishesCount")
values 
  ('1791694855348', 'Đôn Khôi', 'Chưa có SĐT', 'don-khoi-427', 'Bạn Bè', 'pending', 1, 0),
  ('1791693516880', 'Nguyễn Quốc Mạnh', 'Chưa có SĐT', 'nguyen-quoc-manh-629', 'Bạn Bè', 'pending', 1, 0),
  ('1791692836917', 'Nguyễn Quốc Mạnh', 'Chưa có SĐT', 'nguyen-quoc-manh-323', 'Bạn Bè', 'pending', 1, 0)
on conflict (id) do nothing;

insert into public.music (id, title, artist, url, tag, "isCustom")
values
  ('steam-train-bg', 'Tiếng Tàu Hỏa & Thiên Nhiên', 'Âm thanh môi trường thư giãn', '/music/steam-train.mp3', 'Thiên nhiên & Tàu hỏa', true),
  ('forest-birds-bg', 'Rừng Cây Chim Hót & Suối Reo', 'Âm thanh thiên nhiên', '/music/forest-birds.mp3', 'Thiên nhiên êm dịu', true),
  ('piano-inspiring', 'Inspirational Graduation Piano', 'Acoustic Melody', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 'Trang trọng & Sâu lắng', false),
  ('cinematic-triumph', 'Triumph & Future Horizons', 'Cinematic Symphony', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 'Hào hùng & Khởi đầu mới', false),
  ('acoustic-journey', 'Youth Memories & Friends', 'Acoustic Strings', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', 'Kỷ niệm thanh xuân', false)
on conflict (id) do nothing;
