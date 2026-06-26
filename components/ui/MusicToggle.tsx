"use client";

import { useEffect, useRef, useState } from "react";

export function MusicToggle({ src }: { src?: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!src) return;
    audioRef.current = new Audio(src);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [src]);

  if (!src) return null;

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      try {
        await a.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={playing ? "Pause music" : "Play music"}
      className="fixed bottom-5 right-5 z-40 h-12 w-12 rounded-full bg-[var(--accent)] text-white shadow-lg flex items-center justify-center hover:scale-105 transition"
    >
      <span className={playing ? "animate-pulse" : ""}>{playing ? "❚❚" : "♪"}</span>
    </button>
  );
}
