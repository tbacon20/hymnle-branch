
export const GAME_TITLE = process.env.REACT_APP_GAME_NAME!

export const WIN_MESSAGES = ['Celestial!', 'Heavenly!', 'Hurrah for Israel!', 'Blessed!', 'You are awesome!', 'Jesus Loves You!']
export const GAME_COPIED_MESSAGE = 'Game copied to clipboard'
export const HARD_MODE_ALERT_MESSAGE =
  'Hard Mode can only be enabled at the start!'
export const HARD_MODE_DESCRIPTION =
  'Only 1 second more added to the song each time'
export const CORRECT_SONG_MESSAGE = (solution: string) =>
  `The song was ${solution}`
export const STATISTICS_TITLE = 'Statistics'
export const GUESS_DISTRIBUTION_TEXT = 'Guess Distribution'
export const NEW_SONG_TEXT = 'New song in'
export const SHARE_TEXT = 'Share'
export const TOTAL_TRIES_TEXT = 'Total tries'
export const SUCCESS_RATE_TEXT = 'Success rate'
export const CURRENT_STREAK_TEXT = 'Current streak'
export const BEST_STREAK_TEXT = 'Best streak'