import { readJsonFile, writeJsonFile } from './jsonDb';
import { supabase, isSupabaseConfigured } from './supabase';
import { IGuestItem } from '@/types/guest.dto';
import { ITrack } from '@/data/musicPlaylist';

const GUESTS_FILE = 'guests.json';
const MUSIC_FILE = 'music.json';

// ================= GUESTS SERVICES =================
export async function getGuestsDb(): Promise<IGuestItem[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('guests').select('*').order('created_at', { ascending: false });
      if (!error && Array.isArray(data) && data.length > 0) {
        return data as IGuestItem[];
      }
    } catch (e) {
      console.warn('Supabase get guests error:', e);
    }
  }
  return readJsonFile<IGuestItem[]>(GUESTS_FILE, []);
}

export async function saveGuestDb(guest: IGuestItem): Promise<boolean> {
  let success = false;
  if (isSupabaseConfigured && supabase) {
    try {
      // Thử lưu đầy đủ bao gồm cả isSent (nếu bảng trên Supabase đã thêm cột)
      const { error } = await supabase.from('guests').upsert(guest, { onConflict: 'id' });
      if (!error) {
        success = true;
      } else if (error.code === 'PGRST204') {
        // Nếu cột 'isSent' chưa có trên schema cache của Supabase, tách isSent ra để lưu các trường còn lại
        const { isSent, ...guestWithoutSent } = guest;
        const retryRes = await supabase.from('guests').upsert(guestWithoutSent, { onConflict: 'id' });
        if (!retryRes.error) success = true;
      }
    } catch (e) {
      console.warn('Supabase save guest error:', e);
    }
  }

  // Local JSON fallback
  const guests = readJsonFile<IGuestItem[]>(GUESTS_FILE, []);
  const existingIdx = guests.findIndex((g) => g.id === guest.id || g.slug === guest.slug);
  let updatedList: IGuestItem[];
  if (existingIdx >= 0) {
    guests[existingIdx] = { ...guests[existingIdx], ...guest };
    updatedList = [...guests];
  } else {
    updatedList = [guest, ...guests];
  }
  writeJsonFile(GUESTS_FILE, updatedList);
  return success || true;
}

export async function bulkInsertGuestsDb(newGuests: IGuestItem[]): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('guests').upsert(newGuests, { onConflict: 'id' });
      if (error && error.code === 'PGRST204') {
        // Tách isSent ra nếu bảng chưa có cột isSent
        const sanitized = newGuests.map(({ isSent, ...rest }) => rest);
        await supabase.from('guests').upsert(sanitized, { onConflict: 'id' });
      }
    } catch (e) {
      console.warn('Supabase bulk save error:', e);
    }
  }
  const guests = readJsonFile<IGuestItem[]>(GUESTS_FILE, []);
  writeJsonFile(GUESTS_FILE, [...newGuests, ...guests]);
  return true;
}

export async function deleteGuestDb(id?: string | null, slug?: string | null): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      if (id) await supabase.from('guests').delete().eq('id', id);
      else if (slug) await supabase.from('guests').delete().eq('slug', slug);
    } catch (e) {
      console.warn('Supabase delete guest error:', e);
    }
  }
  const guests = readJsonFile<IGuestItem[]>(GUESTS_FILE, []);
  const filtered = guests.filter((g) => (id ? g.id !== id : g.slug !== slug));
  writeJsonFile(GUESTS_FILE, filtered);
  return true;
}

// ================= MUSIC SERVICES =================
export async function getMusicDb(): Promise<ITrack[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('music').select('*');
      if (!error && Array.isArray(data) && data.length > 0) {
        return data as ITrack[];
      }
    } catch (e) {
      console.warn('Supabase get music error:', e);
    }
  }
  return readJsonFile<ITrack[]>(MUSIC_FILE, []);
}

export async function saveTrackDb(track: ITrack): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('music').upsert(track, { onConflict: 'id' });
    } catch (e) {
      console.warn('Supabase save music error:', e);
    }
  }
  const tracks = readJsonFile<ITrack[]>(MUSIC_FILE, []);
  const idx = tracks.findIndex((t) => t.id === track.id);
  let updatedList: ITrack[];
  if (idx >= 0) {
    tracks[idx] = { ...tracks[idx], ...track };
    updatedList = [...tracks];
  } else {
    updatedList = [track, ...tracks];
  }
  writeJsonFile(MUSIC_FILE, updatedList);
  return true;
}

export async function replaceMusicDb(tracks: ITrack[]): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      // Xóa tất cả các bài hiện có trên Supabase rồi nạp lại danh sách mới nhất
      await supabase.from('music').delete().neq('id', '___non_existent___');
      if (tracks.length > 0) {
        await supabase.from('music').insert(tracks);
      }
    } catch (e) {
      console.warn('Supabase replace music error:', e);
    }
  }
  writeJsonFile(MUSIC_FILE, tracks);
  return true;
}

export async function deleteTrackDb(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('music').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete track error:', e);
    }
  }
  const tracks = readJsonFile<ITrack[]>(MUSIC_FILE, []);
  const filtered = tracks.filter((t) => t.id !== id);
  writeJsonFile(MUSIC_FILE, filtered);
  return true;
}
