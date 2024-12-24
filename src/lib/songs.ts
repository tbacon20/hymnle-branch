import { HYMNS } from '../constants/hymn'

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
  const solutionDict = HYMNS[0]

  return {
    solution: solutionDict.title,
    solutionIndex: index,
    tomorrow: nextday,
    url: solutionDict.url
  }
}

export const { solution, solutionIndex, tomorrow, url } = getSongOfDay()
