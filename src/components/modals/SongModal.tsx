import { BaseModal } from "./BaseModal";
import { shareStatus } from "../../lib/share";
import {
  SHARE_TEXT,
} from "../../constants/strings";

import { solution, songUrl } from "../../lib/songs";

type Props = {
  isOpen: boolean;
  handleClose: () => void;
  guesses: string[];
  isGameLost: boolean;
  isGameWon: boolean;
  handleShareToClipboard: () => void;
  isHardMode: boolean;
  isDarkMode: boolean;
  isHighContrastMode: boolean;
  numberOfGuessesMade: number;
};

export const SongModal = ({
    isOpen,
    handleClose,
    guesses,
    isGameLost,
    handleShareToClipboard,
    isHardMode,
    isDarkMode,
    isHighContrastMode,
  }: Props) => {
    return (
      <BaseModal title="Your Guesses:" isOpen={isOpen} handleClose={handleClose}>
        {generateResultEmojis(guesses, isGameLost)}
  
        <div className="mt-5 sm:mt-6 dark:text-white">
          Solution:{" "}
          <a
            href={songUrl}
            target="_blank"
            className="underline font-bold text-blue-700"
            rel="noreferrer"
            tabIndex={-1}
          >
            {solution}
          </a>
        </div>
  
        <div className="mt-5 sm:mt-6 columns-2 dark:text-white">
          <div>
            <button
              type="button"
              className="mt-2 w-full rounded-md border border-indigo-600 shadow-sm px-4 py-2 bg-white text-base font-medium text-indigo-600 hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
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
              className="mt-2 w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
              onClick={() => {
                shareStatus(
                  guesses,
                  isGameLost,
                  isHardMode,
                  handleShareToClipboard
                );
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

  export const generateResultEmojis = (guesses: string[], isGameLost: boolean) => {
    return (
      <div className="flex flex-col items-center mt-4">
        {guesses.map((guess, index) => {
          if (guess === "SKIPPED") {
            return (
              <span key={index} className="text-2xl">
                ⏭️
              </span>
            );
          }
          if (!isGameLost && index === guesses.length - 1) {
            return (
              <span key={index} className="text-2xl">
                ✅
              </span>
            );
          }
          return (
            <span key={index} className="text-2xl">
              ❌
            </span>
          );
        })}
      </div>
    );
  };
  