"use client";

import { useState, useRef, useEffect } from "react";

interface Ayat {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: Record<string, string>;
}

interface SurahDetail {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  ayat: Ayat[];
}

interface Qari {
  id: string;
  name: string;
}

interface AudioPlayerProps {
  surah: SurahDetail;
  qariList: Qari[];
}

export default function AudioPlayer({
  surah,
  qariList,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentQari, setCurrentQari] = useState("01");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAyat, setCurrentAyat] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Auto scroll ke ayat yang sedang diputar
  useEffect(() => {
    const ayatElement = document.getElementById(`ayat-${currentAyat}`);
    if (ayatElement) {
      ayatElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentAyat]);

  // Handle play/pause
  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Auto play next ayat
  const handleAyatEnded = () => {
    if (currentAyat < surah.jumlahAyat) {
      setCurrentAyat(currentAyat + 1);
    } else {
      setIsPlaying(false);
    }
  };

  // Update current ayat when qari changes
  useEffect(() => {
    if (audioRef.current) {
      const audioUrl = surah.ayat[currentAyat - 1]?.audio[currentQari];
      if (audioUrl) {
        audioRef.current.src = audioUrl;
        if (isPlaying) {
          audioRef.current.play();
        }
      }
    }
  }, [currentQari, surah.ayat, currentAyat, isPlaying]);

  // Format time
  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="border-t border-white/20 bg-white/5 backdrop-blur">
      <audio
        ref={audioRef}
        src={surah.ayat[currentAyat - 1]?.audio[currentQari]}
        onEnded={handleAyatEnded}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() =>
          setDuration(audioRef.current?.duration || 0)
        }
      />

      <div className="p-4 max-h-75 overflow-auto">
        {/* Qari Selection */}
        <div className="mb-4">
          <p className="text-xs text-white/70 mb-2">Pilih Qari:</p>
          <div className="grid grid-cols-2 gap-2">
            {qariList.map((qari) => (
              <button
                key={qari.id}
                onClick={() => {
                  setCurrentQari(qari.id);
                  setCurrentTime(0);
                }}
                className={`p-2 text-xs rounded transition ${
                  currentQari === qari.id
                    ? "bg-white text-black"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                {qari.name}
              </button>
            ))}
          </div>
        </div>

        {/* Current Ayat Info */}
        <div className="mb-4 p-3 bg-white/10 rounded text-sm">
          <p className="text-white/70">
            Ayat {currentAyat} dari {surah.jumlahAyat}
          </p>
        </div>

        {/* Playback Controls */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => setCurrentAyat(Math.max(1, currentAyat - 1))}
              className="p-2 bg-white/10 hover:bg-white/20 rounded transition"
              title="Ayat Sebelumnya"
            >
              ⏮
            </button>

            <button
              onClick={handlePlayPause}
              className="flex-1 p-2 bg-white text-black font-bold rounded hover:bg-white/90 transition"
            >
              {isPlaying ? "⏸ Pause" : "▶ Play"}
            </button>

            <button
              onClick={() =>
                setCurrentAyat(
                  Math.min(surah.jumlahAyat, currentAyat + 1)
                )
              }
              className="p-2 bg-white/10 hover:bg-white/20 rounded transition"
              title="Ayat Selanjutnya"
            >
              ⏭
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 text-xs">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={(e) => {
                if (audioRef.current) {
                  audioRef.current.currentTime = parseFloat(e.target.value);
                  setCurrentTime(parseFloat(e.target.value));
                }
              }}
              className="flex-1 cursor-pointer"
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Ayat List for Quick Selection */}
        <div>
          <p className="text-xs text-white/70 mb-2">Pilih Ayat:</p>
          <div className="grid grid-cols-7 gap-1">
            {surah.ayat.map((ayat) => (
              <button
                key={ayat.nomorAyat}
                onClick={() => {
                  setCurrentAyat(ayat.nomorAyat);
                  setCurrentTime(0);
                }}
                className={`p-2 text-xs rounded transition ${
                  currentAyat === ayat.nomorAyat
                    ? "bg-white text-black font-bold"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                {ayat.nomorAyat}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
