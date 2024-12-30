import { SONGS } from '../constants/songs';

export const getSongOfDay = () => {
  const epochMs = new Date(2024, 0).valueOf(); // January 1, 2024 Game Epoch
  const msInDay = 86400000;
  const index = Math.floor(Math.random() * SONGS.length);
  const nextday = (index + 1) * msInDay + epochMs;

  const song = SONGS[index % SONGS.length];
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

export const getRandomSong = () => {
  const randomIndex = Math.floor(Math.random() * SONGS.length);
  const song = SONGS[randomIndex];
  let bookSuffix = song.book === "CHILDREN'S" ? " (Children's)" : "";
  let solution = `${song.number}. ${song.title}${bookSuffix}`;

  return {
    solution,
    solutionIndex: randomIndex,
    solutionMp3Url: song.mp3_url,
    songUrl: song.url,
  };
};

export let { solution, solutionIndex, tomorrow, solutionMp3Url, songUrl } = getSongOfDay();

export const setNewSolution = (newSongData: ReturnType<typeof getRandomSong>) => {
  solution = newSongData.solution;
  solutionIndex = newSongData.solutionIndex;
  solutionMp3Url = newSongData.solutionMp3Url;
  songUrl = newSongData.songUrl;
};

export const isWinningSong = (song: string) => {
  return solution === song;
};
