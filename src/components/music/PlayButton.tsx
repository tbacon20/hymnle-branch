import { PlayIcon, PauseIcon } from "@heroicons/react/outline";
import { useEffect, useState, useRef } from "react";

type Props = {
  audioUrl: string; // URL of the audio file to play
  playDuration: number; // Duration to play audio in seconds
};

export const PlayButton = ({ audioUrl, playDuration }: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio(audioUrl));
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Effect for initializing and cleaning up the audio
  useEffect(() => {
    const audio = audioRef.current;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.pause();
      if (timerRef.current) clearTimeout(timerRef.current); // Clear the timeout if exists
    };
  }, []);

  // Toggle play/pause
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      if (timerRef.current) clearTimeout(timerRef.current); // Clear the timeout when manually paused
    } else {
      audio.play();
      timerRef.current = setTimeout(() => {
        audio.pause();
        setIsPlaying(false);
      }, playDuration * 1000); // Convert seconds to milliseconds
    }
  };

  return (
    <div className="flex justify-center">
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
  );
};
