import { SONGS } from '../constants/songs'

export const isWinningSong = (song: string) => {
  return solution === song
}

export const getSongOfDay = () => {
  // January 1, 2024 Game Epoch
  const epochMs = new Date(2024, 0).valueOf()
  const now = Date.now()
  const msInDay = 86400000
  const index = Math.floor((now - epochMs) / msInDay)
  const nextday = (index + 1) * msInDay + epochMs
  const song = SONGS[0]
  let bookSuffix = song.book === "CHILDREN'S" ? " (Children's)" : "";
  let solution = `${song.number}. ${song.title}${bookSuffix}`;

  return {
    solution: solution,
    solutionIndex: index,
    tomorrow: nextday,
    url: song.url
  }
}

export const { solution, solutionIndex, tomorrow, url } = getSongOfDay()
