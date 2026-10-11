export interface ITrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  tag?: string;
  isCustom?: boolean;
}

// Danh sách các bản nhạc chất lượng cao có sẵn (hosted trên các CDN ổn định, hỗ trợ phát trực tiếp không bị chặn CORS)
export const DEFAULT_PLAYLIST: ITrack[] = [
  {
    id: "piano-inspiring",
    title: "Inspirational Graduation Piano",
    artist: "Acoustic Melody",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    tag: "Trang trọng & Sâu lắng"
  },
  {
    id: "cinematic-triumph",
    title: "Triumph & Future Horizons",
    artist: "Cinematic Symphony",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    tag: "Hào hùng & Khởi đầu mới"
  },
  {
    id: "acoustic-journey",
    title: "Youth Memories & Friends",
    artist: "Acoustic Strings",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    tag: "Kỷ niệm thanh xuân"
  },
  {
    id: "gentle-peace",
    title: "Peaceful Steps to Tomorrow",
    artist: "Gentle Harmony",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    tag: "Ấm áp & Nhẹ nhàng"
  }
];

export const PLAYLIST = DEFAULT_PLAYLIST;

const STORAGE_KEY = "graduation_music_playlist_custom";

/**
 * Lấy danh sách phát từ API /api/music (nguồn chính từ data/music.json) kèm fallback LocalStorage
 */
export const getActivePlaylist = (): ITrack[] => {
  if (typeof window === "undefined") return DEFAULT_PLAYLIST;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed: ITrack[] = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Lỗi khi đọc playlist:", err);
  }
  return DEFAULT_PLAYLIST;
};

/**
 * Fetch danh sách bài hát từ data/music.json qua API
 */
export const fetchPlaylistFromDb = async (): Promise<ITrack[]> => {
  try {
    const res = await fetch("/api/music", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        // Chỉ lưu thầm lặng vào LocalStorage, TUYỆT ĐỐI KHÔNG bắn event playlist_updated gây vòng lặp vô tận
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data.data));
          } catch {
            // ignore
          }
        }
        return data.data;
      }
    }
  } catch (err) {
    console.warn("Lỗi khi fetch playlist từ API:", err);
  }
  return getActivePlaylist();
};

/**
 * Lưu danh sách phát mới vào LocalStorage và tùy chọn đồng bộ lên data/music.json
 */
export const saveActivePlaylist = (tracks: ITrack[], syncApi: boolean = true): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tracks));
    // Phát event để đồng bộ các tab hoặc component đang mở (chỉ khi có người thao tác thêm/xóa bài)
    window.dispatchEvent(new Event("playlist_updated"));

    if (syncApi) {
      fetch("/api/music", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tracks),
      }).catch((err) => console.warn("Lỗi đồng bộ music.json:", err));
    }
  } catch (err) {
    console.error("Lỗi khi lưu playlist:", err);
  }
};
