import { PlayIcon, PauseIcon } from "@heroicons/react/outline";
import { useEffect, useState, useRef } from "react";

type Props = {
  audioUrl: string; // URL of the audio file to play
  playDuration: number; // Duration to play audio in seconds
};

export const PlayButton = ({ audioUrl, playDuration }: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [remainingTime, setRemainingTime] = useState(playDuration); // Track remaining time
  const audioRef = useRef(new Audio(audioUrl));
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const audio = audioRef.current;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.pause();
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

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
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      resetAudioAndTimer();
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = ((time % 60)).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="flex items-center justify-center space-x-4">
      <div className="flex items-center">
        {isPlaying ? (
          <PauseIcon
            className="w-14 h-14 cursor-pointer dark:stroke-white"
            onClick={togglePlayPause}
          />
        ) : (
          <PlayIcon
            className="w-14 h-14 cursor-pointer dark:stroke-white"
            onClick={togglePlayPause}
          />
        )}
      </div>
      <div className="text-xl font-semibold">{formatTime(remainingTime)}</div>
    </div>
  );
};
