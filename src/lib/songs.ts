import { SONG_OF_THE_DAY } from '../constants/songOfTheDay';

export const getSongOfDay = () => {
  const epochMs = new Date(2024, 11, 30).valueOf();
  const msInDay = 86400000;
  const index = Math.floor((Date.now() - epochMs) / msInDay);
  const nextday = ((index + 1) * msInDay) + epochMs;

  const song = SONG_OF_THE_DAY[index % SONG_OF_THE_DAY.length];
  let bookSuffix = song.book === "CHILDREN'S" ? " (Children's)" : "";
  let solution = `${song.number}. ${song.title}${bookSuffix}`;

  return {
    solution,
    solutionIndex: index,
    tomorrow: nextday,
    solutionMp3Url: song.mp3_url,
    songUrl: song.url,
  };
};

export let { solution, solutionIndex, tomorrow, solutionMp3Url, songUrl } = getSongOfDay();

export const isWinningSong = (song: string) => {
  return solution === song;
};