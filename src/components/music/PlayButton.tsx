import { PauseIcon } from "@heroicons/react/outline";
import { PlayIcon } from "@heroicons/react/solid"
import { useEffect, useState, useRef } from "react";

type Props = {
  audioUrl: string;
  playDuration: number;
  isDarkMode: boolean;
};

export const PlayButton = ({ audioUrl, playDuration, isDarkMode = false }: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [remainingTime, setRemainingTime] = useState(playDuration);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    const handleCanPlayThrough = () => {
      setIsLoading(false);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("canplaythrough", handleCanPlayThrough);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    audio.load();

    return () => {
      audio.removeEventListener("canplaythrough", handleCanPlayThrough);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.pause();
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [audioUrl]);

  useEffect(() => {
    if (isPlaying) {
      resetAudioAndTimer();
    } else {
      setRemainingTime(playDuration);
    }
  }, [playDuration]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [isPlaying]);

  const resetAudioAndTimer = () => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
    setRemainingTime(playDuration);
    audio.play();
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      audio.pause();
      setIsPlaying(false);
      setRemainingTime(playDuration);
    }, playDuration * 1000);
  };

  const togglePlayPause = () => {
    if (!audioRef.current || isLoading) return;

    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      resetAudioAndTimer();
    }
  };

  return (
    <div className="flex items-center justify-center space-x-4">
      <div className="flex items-center">
        {isLoading ? (
          <div className="w-14 h-14 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-400"></div>
          </div>
        ) : isPlaying ? (
          <PauseIcon
            className={`w-14 h-14 cursor-pointer ${
              isDarkMode ? "text-gray-500" : "text-[#185642]"
            }`}
            onClick={togglePlayPause}
          />
        ) : (
          <PlayIcon
            className={`w-14 h-14 cursor-pointer ${
              isDarkMode ? "text-gray-300" : "text-[#185642]"
            }`}
            onClick={togglePlayPause}
          />
        )}
      </div>
        <div
          className={`text-xl font-semibold ${
            isDarkMode ? "text-gray-300" : "text-[#185642]"
          }`}
        >
          {formatTime(remainingTime)}
        </div>    
      </div>
  );
};

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60)
    .toString()
    .padStart(2, "0");
  const seconds = ((time % 60) - 1).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

