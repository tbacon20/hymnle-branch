import { BaseModal } from "./BaseModal";
import { shareStatus } from "../../lib/share";
import { SHARE_TEXT } from "../../constants/strings";
import { songUrl } from "../../lib/songs";

type Props = {
  isOpen: boolean;
  handleClose: () => void;
  guesses: string[];
  isGameLost: boolean;
  isGameWon: boolean;
  handleShareToClipboard: () => void;
  isHardMode: boolean;
  isDarkMode: boolean;
};

export const SongModal = ({
  isOpen,
  handleClose,
  guesses,
  isGameLost,
  handleShareToClipboard,
  isHardMode,
  isDarkMode,
}: Props) => {
  const removeNumberPrefix = (title: string) => title.replace(/^\d+[a-zA-Z]?\.\s*/, "");

  return (
    <BaseModal title="Your Guesses:" isOpen={isOpen} handleClose={handleClose}>
      {generateResultEmojis(guesses, isGameLost, removeNumberPrefix, isDarkMode)}
      <div className={`mt-5 sm:mt-6 ${isDarkMode ? "text-gray-300" : "text-black"}`}>
        Listen to the full song{" "}
        <a
          href={songUrl}
          target="_blank"
          className={`underline font-bold ${
            isDarkMode ? "text-blue-400" : "text-blue-700"
          }`}
          rel="noreferrer"
          tabIndex={-1}
        >
          here
        </a>
      </div>
      <div className={`mt-5 sm:mt-6 columns-2 ${isDarkMode ? "text-gray-300" : "text-black"}`}>
        <div>
          <button
            type="button"
            className={`mt-2 w-full rounded-md border ${
              isDarkMode ? "border-gray-600 bg-gray-800 text-white" : "border-indigo-600 bg-white text-indigo-600"
            } shadow-sm px-4 py-2 text-base font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm`}
            onClick={() => {
              handleClose();
            }}
            tabIndex={-1}
          >
            See Stats
          </button>
        </div>
        <div>
          <button
            type="button"
            className={`mt-2 w-full rounded-md border border-transparent shadow-sm px-4 py-2 ${
              isDarkMode ? "bg-indigo-700 text-white hover:bg-indigo-800" : "bg-indigo-600 text-white hover:bg-indigo-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm`}
            onClick={() => {
              shareStatus(guesses, isGameLost, isHardMode, handleShareToClipboard);
            }}
            tabIndex={-1}
          >
            {SHARE_TEXT}
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export const generateResultEmojis = (
  guesses: string[],
  isGameLost: boolean,
  removeNumberPrefix: (title: string) => string,
  isDarkMode: boolean
) => {
  return (
    <div className="flex flex-col items-center mt-4 space-y-2">
      {guesses.map((guess, index) => {
        const guessText = guess === "SKIPPED" ? "Skipped" : removeNumberPrefix(guess);
        const textColor = isDarkMode ? "text-gray-300" : "text-black";
        return (
          <div
            key={index}
            className="flex items-center space-x-2 w-full max-w-xs justify-start"
          >
            <span className="w-6 text-lg text-center">
              {guess === "SKIPPED" ? "⏭️" : !isGameLost && index === guesses.length - 1 ? "✅" : "❌"}
            </span>
            <span className={`text-medium font-medium ${textColor}`}>{guessText}</span>
          </div>
        );
      })}
    </div>
  );
};