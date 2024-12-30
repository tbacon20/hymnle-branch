import { GAME_TITLE } from '../constants/strings';

export const shareStatus = (
  guesses: string[],
  lost: boolean,
  isHardMode: boolean,
  handleShareToClipboard: () => void
) => {
  const formatDate = () => {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const year = today.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const generateEmojiString = (guesses: string[]) => {
    return guesses
      .map((guess, index) => {
        if (lost) return guess === 'SKIPPED' ? '⏭️' : '❌';
        if (index === guesses.length - 1) return '✅';
        return guess === 'SKIPPED' ? '⏭️' : '❌';
      })
      .join('');
  };

  const emojiString = generateEmojiString(guesses);
  const todayDate = formatDate();

  const textToShare = lost
    ? `${GAME_TITLE} ${todayDate}, oh no, I lost!\n${emojiString}\nTry to beat my score at https://hymnle.com`
    : `${GAME_TITLE} ${todayDate}, I solved it in ${guesses.length} tries${
        isHardMode ? ' on hard mode' : ''
      }!\n${emojiString}\nTry to beat my score at https://hymnle.com`;

  // Copy text to clipboard
  navigator.clipboard.writeText(textToShare).then(() => {
    // Trigger success alert
    handleShareToClipboard();
  }).catch((error) => {
    console.error("Failed to copy text to clipboard:", error);
  });
};
