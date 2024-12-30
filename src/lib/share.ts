import { GAME_TITLE } from '../constants/strings';
import { UAParser } from 'ua-parser-js';

const webShareApiDeviceTypes: string[] = ['mobile', 'smarttv', 'wearable'];
const parser = new UAParser();
const browser = parser.getBrowser();
const device = parser.getDevice();

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
        if (lost) return guess === 'SKIPPED' ? '⏭️' : '❌'; // All guesses are ❌ if lost
        if (index === guesses.length - 1) return '✅'; // Last guess is ✅ if not lost
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

  const shareData = { text: textToShare };

  let shareSuccess = false;

  try {
    if (attemptShare(shareData)) {
      navigator.share(shareData);
      shareSuccess = true;
    }
  } catch (error) {
    shareSuccess = false;
  }

  if (!shareSuccess) {
    navigator.clipboard.writeText(textToShare);
    handleShareToClipboard();
  }
};

const attemptShare = (shareData: object) => {
  return (
    // Exclude Firefox Mobile due to Web Share API issues
    browser.name?.toUpperCase().indexOf('FIREFOX') === -1 &&
    webShareApiDeviceTypes.indexOf(device.type ?? '') !== -1 &&
    navigator.canShare &&
    navigator.canShare(shareData) &&
    navigator.share
  );
};
