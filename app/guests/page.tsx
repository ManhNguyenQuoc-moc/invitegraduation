'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/core/context/AuthContext';
import { 
  CoreButton, 
  CoreInput, 
  CoreTable, 
  CoreModal, 
  CoreSelect, 
  CoreTag, 
  CoreCard,
  message 
} from '@core';
import { 
  Users, 
  UserPlus, 
  Upload, 
  FileSpreadsheet, 
  Download, 
  Copy, 
  QrCode, 
  ExternalLink, 
  Search, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Trash2, 
  Sparkles,
  Filter,
  LogOut,
  Music,
  Play,
  Pause,
  Plus,
  Pencil,
  Edit,
  Save,
  Send,
  CheckSquare,
  Square
} from 'lucide-react';
import { ITrack, getActivePlaylist, saveActivePlaylist, fetchPlaylistFromDb } from '@/data/musicPlaylist';
import * as XLSX from 'xlsx';

export interface IGuestItem {
  id: string;
  name: string;
  phone: string;
  slug: string;
  group: string;
  status: 'confirmed' | 'pending' | 'declined';
  attendingCount: number;
  wishesCount: number;
  isSent?: boolean;
}

export default function GuestManagementPage() {
  const router = useRouter();
  const { isAuthenticated, logout, user } = useAuth();
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [guests, setGuests] = useState<IGuestItem[]>([]);
  const [isLoadingGuests, setIsLoadingGuests] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedSentFilter, setSelectedSentFilter] = useState<'all' | 'sent' | 'unsent'>('all');
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isMusicManagerOpen, setIsMusicManagerOpen] = useState(false);
  const [qrModalGuest, setQrModalGuest] = useState<IGuestItem | null>(null);

  // Excel Import States
  const [isImporting, setIsImporting] = useState(false);
  const [importedPreview, setImportedPreview] = useState<IGuestItem[]>([]);
  const [importFileName, setImportFileName] = useState<string>('');

  // Modal Sửa Khách Mời
  const [editingGuest, setEditingGuest] = useState<IGuestItem | null>(null);

  // Music Playlist State
  const [playlist, setPlaylist] = useState<ITrack[]>([]);
  const [newTrackTitle, setNewTrackTitle] = useState('');
  const [newTrackArtist, setNewTrackArtist] = useState('');
  const [newTrackUrl, setNewTrackUrl] = useState('');
  const [newTrackTag, setNewTrackTag] = useState('Nhạc Tự Chọn');
  const [previewTrackUrl, setPreviewTrackUrl] = useState<string | null>(null);

  // Key lưu trữ trạng thái đã gửi thiệp (đảm bảo không bị mất dù bảng Supabase chưa có cột isSent)
  const SENT_STORAGE_KEY = 'guest_invitation_sent_status_v1';

  const getLocalSentMap = (): Record<string, boolean> => {
    if (typeof window === 'undefined') return {};
    try {
      const saved = localStorage.getItem(SENT_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  };

  const saveLocalSentStatus = (id: string, isSent: boolean) => {
    if (typeof window === 'undefined') return;
    try {
      const current = getLocalSentMap();
      current[id] = isSent;
      localStorage.setItem(SENT_STORAGE_KEY, JSON.stringify(current));
    } catch (e) {
      console.warn('Lỗi lưu sent status vào LocalStorage:', e);
    }
  };

  // Load Guests from JSON DB & Supabase, kết hợp trạng thái đã gửi
  const loadGuestsFromDb = async () => {
    try {
      setIsLoadingGuests(true);
      const res = await fetch('/api/guests');
      const data = await res.json();
      const localSentMap = getLocalSentMap();

      if (data.success && Array.isArray(data.data)) {
        const mergedGuests: IGuestItem[] = data.data.map((g: IGuestItem) => ({
          ...g,
          isSent: localSentMap[g.id] !== undefined ? localSentMap[g.id] : Boolean(g.isSent)
        }));
        setGuests(mergedGuests);
      } else {
        setGuests([]);
      }
    } catch (err) {
      console.warn('Lỗi khi tải danh sách khách từ DB JSON:', err);
      setGuests([]);
    } finally {
      setIsLoadingGuests(false);
    }
  };

  useEffect(() => {
    loadGuestsFromDb();
  }, []);

  // Load Playlist from JSON Database
  useEffect(() => {
    fetchPlaylistFromDb().then((data) => setPlaylist(data));
  }, []);

  const handleAddTrack = async () => {
    if (!newTrackTitle.trim() || !newTrackUrl.trim()) {
      message.error('Vui lòng nhập tên bài hát và liên kết URL file âm thanh (.mp3)!');
      return;
    }
    const trackItem: ITrack = {
      id: 'custom-' + Date.now(),
      title: newTrackTitle.trim(),
      artist: newTrackArtist.trim() || 'Tác giả',
      url: newTrackUrl.trim(),
      tag: newTrackTag.trim() || 'Nhạc Tự Chọn',
      isCustom: true
    };
    const updated = [trackItem, ...playlist];
    setPlaylist(updated);
    saveActivePlaylist(updated, true);
    setNewTrackTitle('');
    setNewTrackArtist('');
    setNewTrackUrl('');
    message.success(`Đã thêm bài hát "${trackItem.title}" vào data/music.json!`);
  };

  const handleDeleteTrack = async (id: string) => {
    try {
      const updated = playlist.filter((t) => t.id !== id);
      setPlaylist(updated);
      saveActivePlaylist(updated, false); // Lưu LocalStorage và dispatch event

      if (previewTrackUrl && playlist.find((t) => t.id === id)?.url === previewTrackUrl) {
        setPreviewTrackUrl(null);
      }

      // Gọi API DELETE để xóa trực tiếp khỏi data/music.json
      const res = await fetch(`/api/music?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        message.success('Đã xóa bài hát khỏi danh sách và file data/music.json!');
      } else {
        // Fallback ghi đè cả mảng
        await fetch('/api/music', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        });
        message.success('Đã cập nhật danh sách bài hát!');
      }
    } catch (err) {
      console.error('Lỗi khi xóa bài hát:', err);
      message.error('Không thể kết nối đến máy chủ để xóa bài hát');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|wav|m4a|ogg|aac)$/i)) {
      message.error('Vui lòng chọn file âm thanh định dạng hợp lệ (.mp3, .wav, .m4a, .ogg)!');
      e.target.value = '';
      return;
    }

    const hideLoading = message.loading(`Đang tải file "${file.name}" lên hệ thống...`, 0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/music/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      hideLoading();

      if (res.ok && result.success && result.url) {
        const trackItem: ITrack = {
          id: 'uploaded-' + Date.now(),
          title: result.fileName || file.name.replace(/\.[^/.]+$/, ''),
          artist: 'Nhạc Tải Lên',
          url: result.url,
          tag: 'Tệp Tải Lên',
          isCustom: true
        };
        const updated = [trackItem, ...playlist];
        setPlaylist(updated);
        saveActivePlaylist(updated, true);
        message.success(`Đã lưu "${trackItem.title}" vào danh sách phát thành công!`);
      } else {
        message.error(result.message || 'Lỗi khi tải file nhạc lên máy chủ');
      }
    } catch (err: any) {
      hideLoading();
      console.error('Lỗi upload file:', err);
      message.error(err?.message || 'Không thể kết nối đến máy chủ để tải file');
    } finally {
      e.target.value = '';
    }
  };

  // Bảo vệ route: Chỉ cho phép vào khi đã đăng nhập
  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (!token && !isAuthenticated) {
      router.replace('/login');
    } else {
      setCheckingAuth(false);
    }
  }, [isAuthenticated, router]);

  // New guest form
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');
  const [newGuestGroup, setNewGuestGroup] = useState('Bạn Bè');

  // Copy helper
  const copyInviteLink = (slug: string) => {
    const url = `${window.location.origin}/invite/${slug}`;
    navigator.clipboard.writeText(url);
    message.success(`Đã sao chép liên kết thiệp cho "${slug}"!`);
  };

  // Create Slug helper
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/([^0-9a-z-\s])/g, '')
      .replace(/(\s+)/g, '-')
      .replace(/^-+|-+$/g, '') + '-' + Math.floor(100 + Math.random() * 900);
  };

  // THÊM KHÁCH MỜI (GỌI API LƯU JSON DB)
  const handleCreateGuest = async () => {
    if (!newGuestName.trim()) {
      message.error('Vui lòng nhập tên khách mời!');
      return;
    }
    const slug = generateSlug(newGuestName);
    const item: IGuestItem = {
      id: Date.now().toString(),
      name: newGuestName.trim(),
      phone: newGuestPhone.trim() || 'Chưa có SĐT',
      slug,
      group: newGuestGroup,
      status: 'pending',
      attendingCount: 1,
      wishesCount: 0
    };

    try {
      const res = await fetch('/api/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      const result = await res.json();
      if (result.success) {
        setGuests([item, ...guests]);
        setIsAddModalOpen(false);
        setNewGuestName('');
        setNewGuestPhone('');
        message.success(`Đã thêm khách mời "${item.name}" vào CSDL JSON!`);
      } else {
        message.error(result.message || 'Lỗi khi lưu khách mời');
      }
    } catch {
      // Fallback local
      setGuests([item, ...guests]);
      setIsAddModalOpen(false);
      setNewGuestName('');
      setNewGuestPhone('');
      message.success(`Đã thêm khách mời "${item.name}"!`);
    }
  };

  // CẬP NHẬT / SỬA KHÁCH MỜI (GỌI API PUT)
  const handleUpdateGuest = async () => {
    if (!editingGuest || !editingGuest.name.trim()) {
      message.error('Tên khách mời không được để trống!');
      return;
    }

    try {
      const res = await fetch('/api/guests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingGuest),
      });
      const result = await res.json();
      if (result.success) {
        setGuests(guests.map((g) => (g.id === editingGuest.id ? editingGuest : g)));
        setEditingGuest(null);
        message.success('Đã cập nhật thông tin khách mời vào file JSON thành công!');
      } else {
        message.error(result.message || 'Lỗi cập nhật');
      }
    } catch {
      setGuests(guests.map((g) => (g.id === editingGuest.id ? editingGuest : g)));
      setEditingGuest(null);
      message.success('Đã cập nhật thông tin khách mời thành công!');
    }
  };

  // XÓA KHÁCH MỜI (GỌI API DELETE LƯU JSON DB)
  const handleDeleteGuest = async (id: string) => {
    try {
      const res = await fetch(`/api/guests?id=${id}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (result.success) {
        setGuests(guests.filter(g => g.id !== id));
        message.success('Đã xóa khách mời khỏi CSDL JSON!');
      } else {
        message.error(result.message || 'Lỗi khi xóa khách');
      }
    } catch {
      setGuests(guests.filter(g => g.id !== id));
      message.success('Đã xóa khách mời');
    }
  };

  // TẢI FILE MẪU EXCEL CHUẨN
  const handleDownloadTemplate = () => {
    try {
      const sampleData = [
        {
          'Họ và tên': 'Nguyễn Văn An',
          'Số điện thoại': '0901234567',
          'Nhóm quan hệ': 'Bạn Bè Đại Học'
        },
        {
          'Họ và tên': 'Trần Thị Mai & Gia Đình',
          'Số điện thoại': '0912345678',
          'Nhóm quan hệ': 'Họ Hàng Thân Thiết'
        },
        {
          'Họ và tên': 'Lê Hoàng Nam',
          'Số điện thoại': '0988776655',
          'Nhóm quan hệ': 'Đồng Nghiệp'
        }
      ];

      const ws = XLSX.utils.json_to_sheet(sampleData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'DanhSachKhachMoi');
      XLSX.writeFile(wb, 'danh_sach_khach_moi.xlsx');
      message.success('Đã tải xuống file mẫu danh_sach_khach_moi.xlsx');
    } catch (err) {
      console.error('Lỗi xuất file mẫu:', err);
      message.error('Không thể tạo file mẫu excel');
    }
  };

  // ĐỌC VÀ PARSE FILE EXCEL / CSV THỰC TẾ
  const handleFileUploadExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFileName(file.name);
    setIsImporting(true);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      
      const firstSheetName = workbook.SheetNames[0];
      if (!firstSheetName) {
        message.error('File Excel không có trang tính (sheet) nào!');
        setIsImporting(false);
        return;
      }

      const worksheet = workbook.Sheets[firstSheetName];
      const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      if (!rawRows || rawRows.length === 0) {
        message.warning('File Excel không chứa dòng dữ liệu nào!');
        setIsImporting(false);
        return;
      }

      // Map linh hoạt các tên cột (Việt / Anh / Không dấu)
      const parsedGuests: IGuestItem[] = [];

      for (let i = 0; i < rawRows.length; i++) {
        const row = rawRows[i];
        
        // Tìm tên khách
        const nameVal = 
          row['Họ và tên'] || 
          row['Họ và Tên'] || 
          row['Họ tên'] || 
          row['Họ Tên'] || 
          row['Tên'] || 
          row['Name'] || 
          row['Full Name'] || 
          row['Khách mời'] || 
          row['Khách Mời'] || 
          Object.values(row)[0]; // Fallback lấy cột đầu tiên

        const name = typeof nameVal === 'string' ? nameVal.trim() : String(nameVal || '').trim();
        if (!name) continue; // Bỏ qua dòng trống tên

        // Tìm số điện thoại
        const phoneVal = 
          row['Số điện thoại'] || 
          row['Số Điện Thoại'] || 
          row['SĐT'] || 
          row['SDT'] || 
          row['Phone'] || 
          row['Mobile'] || 
          '';
        const phone = typeof phoneVal === 'string' ? phoneVal.trim() : String(phoneVal || '').trim();

        // Tìm nhóm
        const groupVal = 
          row['Nhóm'] || 
          row['Nhóm quan hệ'] || 
          row['Nhóm Quan Hệ'] || 
          row['Group'] || 
          row['Mối quan hệ'] || 
          'Bạn Bè';
        const group = typeof groupVal === 'string' && groupVal.trim() ? groupVal.trim() : 'Bạn Bè';

        const newGuest: IGuestItem = {
          id: `${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
          name: name,
          phone: phone || 'Chưa có SĐT',
          slug: generateSlug(name),
          group: group,
          status: 'pending',
          attendingCount: 1,
          wishesCount: 0
        };

        parsedGuests.push(newGuest);
      }

      if (parsedGuests.length === 0) {
        message.error('Không tìm thấy dữ liệu tên khách mời hợp lệ trong file!');
        setIsImporting(false);
        return;
      }

      setImportedPreview(parsedGuests);
      message.success(`Đã đọc thành công ${parsedGuests.length} khách mời từ file ${file.name}!`);
    } catch (err) {
      console.error('Lỗi khi đọc file Excel:', err);
      message.error('Không thể đọc file. Vui lòng kiểm tra định dạng .xlsx, .xls hoặc .csv');
    } finally {
      setIsImporting(false);
      // Reset input value để có thể chọn lại file cùng tên nếu cần
      e.target.value = '';
    }
  };

  // XÁC NHẬN LƯU DANH SÁCH ĐÃ IMPORT LÊN SERVER & DB
  const handleConfirmImport = async () => {
    if (importedPreview.length === 0) {
      message.warning('Chưa có khách mời nào để lưu!');
      return;
    }

    setIsImporting(true);
    const hide = message.loading(`Đang lưu ${importedPreview.length} khách mời vào hệ thống...`, 0);

    try {
      const res = await fetch('/api/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(importedPreview),
      });
      const result = await res.json();
      hide();

      if (result.success) {
        setGuests([...importedPreview, ...guests]);
        setIsImportModalOpen(false);
        setImportedPreview([]);
        setImportFileName('');
        message.success(`Đã lưu thành công ${importedPreview.length} khách mời vào cơ sở dữ liệu!`);
      } else {
        message.error(result.message || 'Lỗi khi lưu khách mời vào cơ sở dữ liệu');
      }
    } catch (err) {
      hide();
      console.error('Lỗi khi gửi dữ liệu lên server:', err);
      setGuests([...importedPreview, ...guests]);
      setIsImportModalOpen(false);
      setImportedPreview([]);
      setImportFileName('');
      message.success(`Đã thêm ${importedPreview.length} khách mời vào danh sách!`);
    } finally {
      setIsImporting(false);
    }
  };

  // BẬT / TẮT ĐÁNH DẤU ĐÃ GỬI THIỆP (LƯU DB & SUPABASE)
  const handleToggleSent = async (guest: IGuestItem, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const newStatus = !guest.isSent;
    const updatedGuest: IGuestItem = { ...guest, isSent: newStatus };

    // Cập nhật UI ngay lập tức (optimistic UI)
    setGuests(guests.map((g) => (g.id === guest.id ? updatedGuest : g)));
    // Lưu vào LocalStorage phòng trường hợp bảng Supabase chưa có cột isSent
    saveLocalSentStatus(guest.id, newStatus);

    try {
      const res = await fetch('/api/guests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedGuest),
      });
      const result = await res.json();
      if (result.success) {
        message.success(newStatus ? `Đã đánh dấu đã gửi thiệp cho ${guest.name}` : `Đã bỏ đánh dấu gửi thiệp cho ${guest.name}`);
      }
    } catch (err) {
      console.warn('Lỗi lưu trạng thái đã gửi lên server:', err);
      message.info(newStatus ? `Đã đánh dấu gửi thiệp cho ${guest.name}` : `Đã hủy đánh dấu gửi`);
    }
  };

  // Filtered list
  const filteredGuests = guests.filter(g => {
    const matchQuery = g.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       g.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       g.phone.includes(searchQuery);
    const matchGroup = selectedGroup === 'all' || g.group === selectedGroup;
    const matchSent = selectedSentFilter === 'all' 
      ? true 
      : selectedSentFilter === 'sent' 
        ? Boolean(g.isSent) 
        : !g.isSent;
    return matchQuery && matchGroup && matchSent;
  });

  const confirmedCount = guests.filter(g => g.status === 'confirmed').length;
  const pendingCount = guests.filter(g => g.status === 'pending').length;
  const declinedCount = guests.filter(g => g.status === 'declined').length;
  const sentCount = guests.filter(g => Boolean(g.isSent)).length;

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm">
        Đang xác thực quyền truy cập Host...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
                <Users className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                  Quản Lý & Import Khách Mời
                </h1>
                <p className="text-slate-400 text-sm mt-0.5">
                  Tạo thiệp cá nhân hóa, xuất link mời riêng biệt và theo dõi phản hồi RSVP
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/invite/nguyen-van-b" target="_blank">
              <button className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center transition-all">
                <ExternalLink className="w-4 h-4 mr-2 text-sky-400" />
                Xem Thiệp Mẫu
              </button>
            </Link>

            <button 
              className="px-4 py-2 rounded-xl border border-indigo-500/40 text-indigo-300 hover:bg-indigo-950/40 text-xs font-semibold flex items-center transition-all cursor-pointer shadow-sm"
              onClick={() => setIsMusicManagerOpen(true)}
              title="Quản lý và tải lên nhạc nền cho thiệp mời"
            >
              <Music className="w-4 h-4 mr-2 text-indigo-400" />
              Quản Lý Nhạc Thiệp ({playlist.length})
            </button>

            <button 
              className="px-4 py-2 rounded-xl border border-emerald-600/40 text-emerald-400 hover:bg-emerald-950/40 text-xs font-semibold flex items-center transition-all"
              onClick={() => setIsImportModalOpen(true)}
            >
              <Upload className="w-4 h-4 mr-2" />
              Import Excel / CSV
            </button>

            <button 
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-white text-xs flex items-center shadow-md transition-all"
              onClick={() => setIsAddModalOpen(true)}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Thêm Khách Mới
            </button>

            <button 
              className="px-3.5 py-2 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-950/30 text-xs font-semibold flex items-center transition-all"
              onClick={() => logout()}
              title="Đăng xuất khỏi bảng quản lý"
            >
              <LogOut className="w-4 h-4 mr-1.5" />
              Đăng Xuất
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Tổng Khách Mời</div>
            <div className="text-2xl font-bold text-white mt-1">{guests.length}</div>
            <div className="text-xs text-blue-400 mt-1 font-medium">Đã phát hành link thiệp</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
            <div className="text-indigo-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5" /> Đã Gửi Thiệp
            </div>
            <div className="text-2xl font-bold text-indigo-300 mt-1">{sentCount} / {guests.length}</div>
            <div className="text-xs text-slate-400 mt-1">Đã tick gửi đến khách</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
            <div className="text-emerald-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Sẽ Tham Dự
            </div>
            <div className="text-2xl font-bold text-emerald-300 mt-1">{confirmedCount}</div>
            <div className="text-xs text-slate-400 mt-1">Đã phản hồi qua form RSVP</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
            <div className="text-amber-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Chưa Phản Hồi
            </div>
            <div className="text-2xl font-bold text-amber-300 mt-1">{pendingCount}</div>
            <div className="text-xs text-slate-400 mt-1">Cần nhắc gửi lời chúc</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
            <div className="text-rose-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5" /> Bận Không Đến
            </div>
            <div className="text-2xl font-bold text-rose-300 mt-1">{declinedCount}</div>
            <div className="text-xs text-slate-400 mt-1">Đã để lại lời chúc từ xa</div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên, số điện thoại, slug thiệp..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Lọc Trạng Thái Gửi Thiệp */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setSelectedSentFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  selectedSentFilter === 'all'
                    ? 'bg-slate-800 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Tất cả ({guests.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedSentFilter('sent')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1 ${
                  selectedSentFilter === 'sent'
                    ? 'bg-indigo-600/40 text-indigo-200 border border-indigo-500/50 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-indigo-300'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
                Đã gửi ({sentCount})
              </button>
              <button
                type="button"
                onClick={() => setSelectedSentFilter('unsent')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1 ${
                  selectedSentFilter === 'unsent'
                    ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-amber-300'
                }`}
              >
                <Square className="w-3.5 h-3.5 text-amber-400" />
                Chưa gửi ({guests.length - sentCount})
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-400 hidden sm:inline">Nhóm:</span>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="all">Tất cả các nhóm</option>
                <option value="Bạn Bè Đồng Môn">Bạn Bè Đồng Môn</option>
                <option value="Bạn Bè">Bạn Bè</option>
                <option value="Người Thân">Người Thân</option>
                <option value="Đồng Nghiệp">Đồng Nghiệp</option>
                <option value="Giảng Viên Hướng Dẫn">Giảng Viên Hướng Dẫn</option>
                <option value="Khách Quý VIP">Khách Quý VIP</option>
              </select>
            </div>
          </div>
        </div>

        {/* Guest Table */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/70 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-3 text-center w-28">Đã Gửi Thiệp</th>
                  <th className="py-3.5 px-4">Tên Khách Mời</th>
                  <th className="py-3.5 px-4">Số Điện Thoại</th>
                  <th className="py-3.5 px-4">Nhóm Phân Loại</th>
                  <th className="py-3.5 px-4">Liên Kết Thiệp Riêng</th>
                  <th className="py-3.5 px-4 text-center">Trạng Thái RSVP</th>
                  <th className="py-3.5 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredGuests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      Không tìm thấy khách mời nào phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredGuests.map((guest) => {
                    const inviteUrl = `/invite/${guest.slug}`;
                    return (
                      <tr 
                        key={guest.id} 
                        className={`transition-colors ${
                          guest.isSent 
                            ? 'bg-slate-900/40 hover:bg-slate-800/50' 
                            : 'hover:bg-slate-800/40'
                        }`}
                      >
                        {/* CỘT ĐÁNH DẤU ĐÃ GỬI THIỆP */}
                        <td className="py-4 px-3 text-center">
                          <button
                            type="button"
                            onClick={(e) => handleToggleSent(guest, e)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                              guest.isSent
                                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 hover:bg-indigo-500/30 shadow-sm'
                                : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:bg-slate-800 hover:text-slate-200'
                            }`}
                            title={guest.isSent ? 'Nhấn để bỏ đánh dấu' : 'Nhấn để đánh dấu đã gửi thiệp'}
                          >
                            <input
                              type="checkbox"
                              checked={Boolean(guest.isSent)}
                              onChange={() => {}} // Đã xử lý ở onClick button
                              className="w-3.5 h-3.5 rounded accent-indigo-500 cursor-pointer pointer-events-none"
                            />
                            <span className="text-[11px] font-semibold">
                              {guest.isSent ? 'Đã gửi' : 'Chưa gửi'}
                            </span>
                          </button>
                        </td>

                        <td className="py-4 px-4 font-semibold text-white">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs ${
                              guest.isSent 
                                ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30' 
                                : 'bg-blue-600/20 text-blue-400'
                            }`}>
                              {guest.name.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span>{guest.name}</span>
                                {guest.isSent && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" title="Đã gửi thiệp" />
                                )}
                              </div>
                              <div className="text-xs font-normal text-slate-400 font-mono">slug: {guest.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-300">
                          {guest.phone}
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-block px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                            {guest.group}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 max-w-xs">
                            <span className="truncate text-xs font-mono text-blue-400 bg-blue-950/40 border border-blue-900/50 px-2 py-1 rounded">
                              /invite/{guest.slug}
                            </span>
                            <button
                              onClick={() => copyInviteLink(guest.slug)}
                              title="Sao chép link"
                              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-md transition-colors"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <Link 
                              href={inviteUrl} 
                              target="_blank"
                              title="Mở xem trực tiếp"
                              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-blue-400 rounded-md transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          {guest.status === 'confirmed' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                              <CheckCircle2 className="w-3 h-3" /> Đã xác nhận ({guest.attendingCount} vé)
                            </span>
                          )}
                          {guest.status === 'pending' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-950/60 text-amber-400 border border-amber-800/60">
                              <Clock className="w-3 h-3" /> Đang chờ
                            </span>
                          )}
                          {guest.status === 'declined' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-950/60 text-rose-400 border border-rose-800/60">
                              <XCircle className="w-3 h-3" /> Bận không tới
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setEditingGuest(guest)}
                              title="Sửa thông tin khách"
                              className="p-2 text-slate-300 hover:text-sky-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setQrModalGuest(guest)}
                              title="Xem mã QR thiệp"
                              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            >
                              <QrCode className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteGuest(guest.id)}
                              title="Xóa khách"
                              className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* MODAL: THÊM KHÁCH MỜI */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-400" />
              Thêm Khách Mời Mới
            </h3>
            <p className="text-slate-400 text-xs">
              Mỗi khách mời sẽ được tự động cấp một liên kết thiệp riêng biệt với tên và chỗ ngồi tương ứng.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Tên khách mời *</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Hoàng Minh Tuấn"
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Số điện thoại</label>
                <input
                  type="text"
                  placeholder="09xx xxx xxx"
                  value={newGuestPhone}
                  onChange={(e) => setNewGuestPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Nhóm khách mời</label>
                <select
                  value={newGuestGroup}
                  onChange={(e) => setNewGuestGroup(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Bạn Bè Đồng Môn">Bạn Bè Đồng Môn</option>
                  <option value="Bạn Bè">Bạn Bè</option>
                  <option value="Người Thân">Người Thân</option>
                  <option value="Đồng Nghiệp">Đồng Nghiệp</option>
                  <option value="Giảng Viên Hướng Dẫn">Giảng Viên Hướng Dẫn</option>
                  <option value="Khách Quý VIP">Khách Quý VIP</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleCreateGuest}
                className="px-5 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white"
              >
                Xác Nhận Thêm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CHỈNH SỬA THÔNG TIN KHÁCH MỜI */}
      {editingGuest && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Pencil className="w-4 h-4 text-sky-400" />
                Sửa Thông Tin Khách Mời
              </h3>
              <button
                onClick={() => setEditingGuest(null)}
                className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Họ và tên khách mời *</label>
                <input
                  type="text"
                  value={editingGuest.name}
                  onChange={(e) => setEditingGuest({ ...editingGuest, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Số điện thoại</label>
                <input
                  type="text"
                  value={editingGuest.phone}
                  onChange={(e) => setEditingGuest({ ...editingGuest, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Nhóm khách mời</label>
                <select
                  value={editingGuest.group}
                  onChange={(e) => setEditingGuest({ ...editingGuest, group: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="Bạn Bè Đồng Môn">Bạn Bè Đồng Môn</option>
                  <option value="Bạn Bè">Bạn Bè</option>
                  <option value="Người Thân">Người Thân</option>
                  <option value="Đồng Nghiệp">Đồng Nghiệp</option>
                  <option value="Giảng Viên Hướng Dẫn">Giảng Viên Hướng Dẫn</option>
                  <option value="Khách Quý VIP">Khách Quý VIP</option>
                  <option value="Khách Mời">Khách Mời</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">Trạng thái RSVP</label>
                  <select
                    value={editingGuest.status}
                    onChange={(e) => setEditingGuest({ ...editingGuest, status: e.target.value as 'confirmed' | 'pending' | 'declined' })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="confirmed">Xác nhận tham dự</option>
                    <option value="pending">Chờ phản hồi</option>
                    <option value="declined">Không thể tham dự</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">Số người đi kèm</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={editingGuest.attendingCount || 1}
                    onChange={(e) => setEditingGuest({ ...editingGuest, attendingCount: Number(e.target.value) || 1 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Tùy chọn đánh dấu đã gửi thiệp */}
              <div className="pt-1">
                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    checked={Boolean(editingGuest.isSent)}
                    onChange={(e) => setEditingGuest({ ...editingGuest, isSent: e.target.checked })}
                    className="w-4 h-4 rounded accent-indigo-500 cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-white block">Đã gửi thiệp mời cho khách này</span>
                    <span className="text-[11px] text-slate-400">Đánh dấu để theo dõi tiến độ gửi thiệp trên bảng</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setEditingGuest(null)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateGuest}
                className="px-5 py-2 rounded-xl text-sm font-semibold bg-sky-600 hover:bg-sky-500 text-white cursor-pointer shadow-lg shadow-sky-600/20"
              >
                Lưu Thay Đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: IMPORT EXCEL / CSV */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                Import Khách Mời Từ Excel / CSV
              </h3>
              <button
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportedPreview([]);
                  setImportFileName('');
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* VÙNG CHỌN HOẶC KÉO THẢ TỆP */}
            <label className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl p-6 text-center transition-all bg-slate-950/50 hover:bg-slate-950/80 cursor-pointer block group">
              <FileSpreadsheet className="w-12 h-12 text-slate-500 group-hover:text-emerald-400 mx-auto mb-2 transition-colors" />
              <div className="text-sm font-semibold text-slate-200 group-hover:text-emerald-300 transition-colors">
                {importFileName ? `Đã chọn: ${importFileName}` : 'Nhấn vào đây hoặc kéo thả file .xlsx / .csv'}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Các cột hỗ trợ: <span className="text-emerald-400 font-medium">Họ và tên</span>, <span className="text-sky-400 font-medium">Số điện thoại</span>, <span className="text-amber-400 font-medium">Nhóm</span>
              </p>
              
              <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow transition-all pointer-events-none">
                <Upload className="w-3.5 h-3.5" />
                {importFileName ? 'Chọn file khác' : 'Chọn tệp Excel từ máy tính'}
              </div>

              <input
                type="file"
                accept=".xlsx, .xls, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleFileUploadExcel}
                className="hidden"
              />
            </label>

            {/* BẢNG XEM TRƯỚC (PREVIEW) KHI ĐÃ ĐỌC FILE */}
            {importedPreview.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    Đã đọc được {importedPreview.length} khách mời hợp lệ:
                  </span>
                  <button
                    onClick={() => {
                      setImportedPreview([]);
                      setImportFileName('');
                    }}
                    className="text-[11px] text-rose-400 hover:underline cursor-pointer"
                  >
                    Hủy xem trước
                  </button>
                </div>

                <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/70 p-2 space-y-1.5 divide-y divide-slate-800/60 text-xs">
                  {importedPreview.slice(0, 50).map((g, idx) => (
                    <div key={g.id || idx} className="pt-1.5 first:pt-0 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <span className="font-medium text-white truncate block">{idx + 1}. {g.name}</span>
                        <span className="text-[11px] text-slate-400">{g.phone}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300 shrink-0">
                        {g.group}
                      </span>
                    </div>
                  ))}
                  {importedPreview.length > 50 && (
                    <div className="text-center text-[11px] text-slate-500 py-1 font-mono">
                      ... và {importedPreview.length - 50} khách mời khác
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TẢI FILE MẪU CHUẨN */}
            <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 flex items-center justify-between gap-2">
              <div className="text-xs text-slate-400">
                Chưa có file mẫu chuẩn? Tải file mẫu <span className="text-slate-200 font-mono">danh_sach_khach_moi.xlsx</span>:
              </div>
              <button 
                type="button"
                onClick={handleDownloadTemplate}
                className="text-xs text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1 font-semibold shrink-0 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Tải file mẫu
              </button>
            </div>

            {/* HÀNG NÚT ĐIỀU HƯỚNG */}
            <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportedPreview([]);
                  setImportFileName('');
                }}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                Đóng
              </button>

              {importedPreview.length > 0 && (
                <button
                  type="button"
                  disabled={isImporting}
                  onClick={handleConfirmImport}
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Xác Nhận Import ({importedPreview.length} Khách)
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: QR CODE PREVIEW */}
      {qrModalGuest && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 text-center space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Mã QR Thiệp Cá Nhân Hóa</h3>
            <p className="text-xs text-slate-400">
              Khách mời: <span className="font-semibold text-white">{qrModalGuest.name}</span>
            </p>

            <div className="p-4 bg-white rounded-2xl inline-block shadow-inner">
              {/* Giả lập QR code với API QuickChart hoặc SVG */}
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(typeof window !== 'undefined' ? `${window.location.origin}/invite/${qrModalGuest.slug}` : '')}`} 
                alt="QR Code" 
                className="w-44 h-44 mx-auto"
              />
            </div>

            <div className="text-xs font-mono text-slate-400 break-all px-2">
              {typeof window !== 'undefined' && `${window.location.origin}/invite/${qrModalGuest.slug}`}
            </div>

            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={() => copyInviteLink(qrModalGuest.slug)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" /> Sao chép link
              </button>
              <button
                onClick={() => setQrModalGuest(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: QUẢN LÝ & IMPORT NHẠC CHO THIỆP MỜI */}
      {isMusicManagerOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                  <Music className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Quản Lý & Import Nhạc Thiệp</h3>
                  <p className="text-xs text-slate-400">Tùy biến playlist để khách mời tự do thưởng thức khi mở thiệp</p>
                </div>
              </div>
              <button
                onClick={() => setIsMusicManagerOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Khung Thêm Nhạc Mới */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 space-y-3.5">
              <div className="text-xs font-semibold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Thêm Bài Hát Mới
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Tên bài hát *</label>
                  <input
                    type="text"
                    value={newTrackTitle}
                    onChange={(e) => setNewTrackTitle(e.target.value)}
                    placeholder="VD: Thời Học Sinh Kỷ Niệm"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Ca sĩ / Thể loại</label>
                  <input
                    type="text"
                    value={newTrackArtist}
                    onChange={(e) => setNewTrackArtist(e.target.value)}
                    placeholder="VD: Acoustic Guitar"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Đường dẫn file MP3 (URL) *</label>
                <input
                  type="url"
                  value={newTrackUrl}
                  onChange={(e) => setNewTrackUrl(e.target.value)}
                  placeholder="https://example.com/audio.mp3"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                {/* Tải lên trực tiếp từ máy */}
                <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-all">
                  <Upload className="w-3.5 h-3.5 text-sky-400" />
                  <span>Hoặc tải tệp MP3 từ máy</span>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleAddTrack}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md cursor-pointer ml-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Thêm Vào Playlist
                </button>
              </div>
            </div>

            {/* Danh Sách Bài Hát Hiện Tại */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
                <span>Danh Sách Bài Hát ({playlist.length})</span>
                <span className="text-[11px] text-slate-500 normal-case">Tự động đồng bộ sang trang thiệp mời</span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {playlist.map((track, idx) => (
                  <div
                    key={track.id}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 text-center text-xs font-mono text-slate-500">
                        0{idx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white truncate flex items-center gap-2">
                          <span>{track.title}</span>
                          {track.isCustom && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                              Tùy chọn
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {track.artist} • <span className="text-sky-300/80">{track.tag}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Thử nghe */}
                      <button
                        onClick={() => {
                          if (previewTrackUrl === track.url) {
                            setPreviewTrackUrl(null);
                          } else {
                            setPreviewTrackUrl(track.url);
                          }
                        }}
                        className={`p-2 rounded-lg text-xs transition-all cursor-pointer ${
                          previewTrackUrl === track.url
                            ? "bg-sky-500 text-slate-950 font-bold"
                            : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                        }`}
                        title="Nghe thử"
                      >
                        {previewTrackUrl === track.url ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>

                      {/* Nút Xóa */}
                      <button
                        onClick={() => handleDeleteTrack(track.id)}
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all cursor-pointer"
                        title="Xóa bài hát"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trình nghe thử âm thanh ẩn */}
              {previewTrackUrl && (
                <audio
                  src={previewTrackUrl}
                  autoPlay
                  onEnded={() => setPreviewTrackUrl(null)}
                  className="hidden"
                />
              )}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  setPreviewTrackUrl(null);
                  setIsMusicManagerOpen(false);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all cursor-pointer"
              >
                Xong
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
