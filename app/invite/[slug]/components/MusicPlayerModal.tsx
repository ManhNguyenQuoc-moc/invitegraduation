"use client";

import React, { useState } from "react";
import { 
  Music, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Check, 
  Disc, 
  SkipForward, 
  SkipBack, 
  X 
} from "lucide-react";
import { ITrack, PLAYLIST } from "@/data/musicPlaylist";

interface IMusicPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrack: ITrack;
  isPlaying: boolean;
  playlist?: ITrack[];
  onSelectTrack: (track: ITrack) => void;
  onTogglePlay: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
}

export const MusicPlayerModal: React.FC<IMusicPlayerModalProps> = ({
  isOpen,
  onClose,
  currentTrack,
  isPlaying,
  playlist = [],
  onSelectTrack,
  onTogglePlay,
  onNextTrack,
  onPrevTrack
}) => {
  const displayPlaylist = playlist.length > 0 ? playlist : PLAYLIST;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      {/* Backdrop click to close */}
      <div 
        className="absolute inset-0" 
        onClick={onClose} 
      />

      {/* Modal Dialog Content */}
      <div className="text-white relative w-full max-w-[440px] p-5 sm:p-6 select-none bg-[#0B1528] rounded-[24px] border border-sky-400/25 shadow-2xl overflow-hidden z-10 transition-all scale-100">
        {/* Glow ambient background */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-400/30 flex items-center justify-center">
              <Music size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                Giai Điệu Thiệp Mời
              </h3>
              <p className="text-[11px] text-slate-400">Chọn bản nhạc bạn muốn thưởng thức</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Now Playing Showcase Card */}
        <div className="my-5 p-4 rounded-2xl bg-gradient-to-br from-sky-950/40 via-slate-900/60 to-blue-950/40 border border-sky-400/20 shadow-inner flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative shrink-0">
              <div className={`w-12 h-12 rounded-full bg-slate-950 border border-sky-400/40 flex items-center justify-center shadow-lg ${isPlaying ? "animate-spin" : ""}`} style={{ animationDuration: "6s" }}>
                <Disc size={26} className="text-sky-300" />
              </div>
            </div>

            <div className="min-w-0">
              <div className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">
                {isPlaying ? "Đang phát" : "Đã tạm dừng"}
              </div>
              <div className="font-semibold text-sm text-white truncate mt-0.5">
                {currentTrack.title}
              </div>
              <div className="text-xs text-slate-400 truncate">
                {currentTrack.artist} • {currentTrack.tag}
              </div>
            </div>
          </div>

          {/* Quick Play/Pause on Card */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={onPrevTrack}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all cursor-pointer"
              title="Bài trước"
            >
              <SkipBack size={15} />
            </button>
            <button
              onClick={onTogglePlay}
              className="w-9 h-9 rounded-full bg-sky-500 hover:bg-sky-400 active:scale-95 text-slate-950 flex items-center justify-center shadow-md transition-all cursor-pointer"
              title={isPlaying ? "Tạm dừng" : "Phát"}
            >
              {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
            </button>
            <button
              onClick={onNextTrack}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all cursor-pointer"
              title="Bài kế tiếp"
            >
              <SkipForward size={15} />
            </button>
          </div>
        </div>

        {/* Playlist List */}
        <div className="space-y-2 relative z-10 max-h-60 overflow-y-auto pr-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
            Danh sách phát ({displayPlaylist.length} bản nhạc)
          </div>

          {displayPlaylist.map((track, idx) => {
            const isSelected = track.id === currentTrack.id;
            return (
              <div
                key={track.id}
                onClick={() => onSelectTrack(track)}
                className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? "bg-sky-500/15 border-sky-400/50 shadow-md text-white"
                    : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/15 text-slate-300"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-6 text-center text-xs font-mono ${isSelected ? "text-sky-300 font-bold" : "text-slate-500"}`}>
                    {isSelected && isPlaying ? (
                      <Volume2 size={15} className="mx-auto text-sky-400 animate-pulse" />
                    ) : (
                      `0${idx + 1}`
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className={`text-xs font-semibold truncate ${isSelected ? "text-sky-200" : "text-white"}`}>
                      {track.title}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {track.artist} <span className="opacity-40">•</span> <span className="text-sky-300/80">{track.tag}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center">
                  {isSelected ? (
                    <span className="w-6 h-6 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center">
                      <Check size={13} strokeWidth={3} />
                    </span>
                  ) : (
                    <span className="w-6 h-6 rounded-full border border-white/20 text-slate-400 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Play size={10} fill="currentColor" className="ml-0.5" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
