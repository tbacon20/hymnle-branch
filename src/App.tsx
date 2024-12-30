import { useState, useEffect } from "react";
import { InfoModal } from "./components/modals/InfoModal";
import { StatsModal } from "./components/modals/StatsModal";
import { SongModal } from "./components/modals/SongModal";
import { SettingsModal } from "./components/modals/SettingsModal";

import {
  WIN_MESSAGES,
  GAME_COPIED_MESSAGE,
  CORRECT_SONG_MESSAGE,
  HARD_MODE_ALERT_MESSAGE,
} from "./constants/strings";
import {
  MAX_CHALLENGES,
  WELCOME_INFO_MODAL_MS,
} from "./constants/settings";
import {
  isWinningSong,
  solution,
  solutionMp3Url,
  getRandomSong,
  setNewSolution,
} from "./lib/songs";
import { addStatsForCompletedGame, loadStats } from "./lib/stats";
import {
  loadGameStateFromLocalStorage,
  saveGameStateToLocalStorage,
} from "./lib/localStorage";

import "./App.css";
import { AlertContainer } from "./components/alerts/AlertContainer";
import { useAlert } from "./context/AlertContext";
import { Navbar } from "./components/navbar/Navbar";
import { PlayButton } from "./components/music/PlayButton";
import { SearchBar } from "./components/music/SearchBar";
import { SubmitButton } from "./components/music/SubmitButton";
import { SkipButton } from "./components/music/SkipButton";
import { GameRows } from "./components/grid/GameRows";
import { songTitles } from "./lib/searchbar";

function App() {
  const prefersDarkMode = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  const { showError: showErrorAlert, showSuccess: showSuccessAlert } =
    useAlert();
  const [currentGuess, setCurrentGuess] = useState("");
  const [currentTurn, setCurrentTurn] = useState(1);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isSongModalOpen, setIsSongModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isGameLost, setIsGameLost] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme")
      ? localStorage.getItem("theme") === "dark"
      : prefersDarkMode
        ? true
        : false
  );

  const [skippedRows, setSkippedRows] = useState<number[]>([]);
  const [stats, setStats] = useState(() => loadStats());

  const [isHardMode, setIsHardMode] = useState(
    localStorage.getItem("gameMode")
      ? localStorage.getItem("gameMode") === "hard"
      : false
  );

  const resetGame = () => {
    const newSongData = getRandomSong();
    setNewSolution(newSongData);

    setGuesses([]);
    setSkippedRows([]);
    setCurrentGuess('');
    setCurrentTurn(1);
    setIsGameWon(false);
    setIsGameLost(false);

    saveGameStateToLocalStorage({ guesses: [], solution: newSongData.solution });
  };

  const [guesses, setGuesses] = useState<string[]>(() => {
    const loaded = loadGameStateFromLocalStorage()
    if (loaded?.solution !== solution) {
      return []
    }
    const gameWasWon = loaded.guesses.includes(solution)
    if (gameWasWon) {
      setIsGameWon(true)
    }
    if (loaded.guesses.length === MAX_CHALLENGES && !gameWasWon) {
      setIsGameLost(true)
      showErrorAlert(CORRECT_SONG_MESSAGE(solution), {
        delayMs: 500,
      })
    }
    return loaded.guesses
  })

  useEffect(() => {
    // if no game state on load,
    // show the user the how-to info modal
    if (!loadGameStateFromLocalStorage()) {
      setTimeout(() => {
        setIsInfoModalOpen(true);
      }, WELCOME_INFO_MODAL_MS);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleDarkMode = (isDark: boolean) => {
    setIsDarkMode(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  const handleHardMode = (isHard: boolean) => {
    if (guesses.length === 0 || localStorage.getItem("gameMode") === "hard") {
      setIsHardMode(isHard);
      localStorage.setItem("gameMode", isHard ? "hard" : "normal");
    } else {
      showErrorAlert(HARD_MODE_ALERT_MESSAGE);
    }
  };

  const normalPlayDurations = new Map<number, number>([
    [1, 2],
    [2, 3],
    [3, 5],
    [4, 9],
    [5, 16],
    [6, 31],
    [7, 31],
  ]);

  const hardModePlayDurations = new Map<number, number>([
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 7],
  ]);

  const getPlayDuration = (turn: number): number => {
    const playDurations = isHardMode ? hardModePlayDurations : normalPlayDurations;
    return playDurations.get(turn) ?? 31; // Fallback to 31 seconds if turn not found
  };

  useEffect(() => {
    saveGameStateToLocalStorage({ guesses, solution })
  }, [guesses])

  useEffect(() => {
    if (isGameWon) {
      const winMessage =
        WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)];
      const delayMs = 500;
      return showSuccessAlert(winMessage, {
        delayMs,
        onClose: () => setIsSongModalOpen(true),
      });
    }

    if (isGameLost) {
      const delayMs = 500;
      setTimeout(() => {
        setIsSongModalOpen(true);
      }, delayMs);
    }
  }, [isGameWon, isGameLost, showSuccessAlert]);

  const onSelect = (selectedHymn: string) => {
    setCurrentGuess(selectedHymn);
  };

  const onEnter = () => {
    if (currentGuess) {
      if (guesses.includes(currentGuess)) {
        return showErrorAlert("You've already guessed this song");
      }
      const hymn = songTitles.find((s) => s === currentGuess);
      const winningSong = isWinningSong(currentGuess);
      if (hymn && currentTurn <= MAX_CHALLENGES && !isGameWon) {
        setGuesses([...guesses, currentGuess]);
        setCurrentGuess('');
        if (winningSong) {
          setStats(addStatsForCompletedGame(stats, guesses.length + 1));
          setIsGameWon(true);
        } else if (currentTurn === MAX_CHALLENGES) {
          setStats(addStatsForCompletedGame(stats, guesses.length + 1));
          setIsGameLost(true);
          showErrorAlert(CORRECT_SONG_MESSAGE(solution), {
            delayMs: 500,
          });
        }
        setCurrentTurn((prevTurn) => prevTurn + 1);
      } else if (guesses.length >= MAX_CHALLENGES) {
        return showErrorAlert("No more guesses left");
      } else {
        return showErrorAlert("Hymn title not found");
      }
    } else {
      return showErrorAlert("No hymn selected");
    }

    const searchBar = document.getElementById("searchBarInput") as HTMLInputElement;
    if (searchBar) {
      searchBar.value = "";
    }
    setCurrentGuess("");
  };

  const onSkip = () => {
    if (currentTurn <= MAX_CHALLENGES) {
      setSkippedRows((prev) => [...prev, currentTurn - 1]);
      setGuesses((prevGuesses) => {
        const updatedGuesses = [...prevGuesses, "SKIPPED"];
        if (guesses.length === MAX_CHALLENGES - 1) {
          setStats(addStatsForCompletedGame(stats, guesses.length + 1))
          setIsGameLost(true)
          showErrorAlert(CORRECT_SONG_MESSAGE(solution), {
            persist: true,
            delayMs: 500,
          })
        }
        return updatedGuesses;
      });
      setCurrentTurn((prev) => prev + 1);
    } else {
      return showErrorAlert("No more guesses left");
    }
  };

  const playDuration = getPlayDuration(currentTurn);


  const calculateTimeAdded = (turn: number): number => {
    const playDurations = isHardMode ? hardModePlayDurations : normalPlayDurations;
    const currentDuration = playDurations.get(turn) ?? 0;
    const nextDuration = playDurations.get(turn + 1) ?? 0;
    return nextDuration - currentDuration;
  };
  
  const timeAdded = calculateTimeAdded(currentTurn);


  return (
    <div className="h-screen flex flex-col">
      <Navbar
        setIsInfoModalOpen={setIsInfoModalOpen}
        setIsStatsModalOpen={setIsStatsModalOpen}
        setIsSettingsModalOpen={setIsSettingsModalOpen}
      />
      <div className="pt-2 px-1 pb-8 md:max-w-7xl w-full mx-auto sm:px-6 lg:px-8 flex flex-col grow">
        <GameRows guesses={guesses} skippedRows={skippedRows} isGameWon={isGameWon} isDarkMode={isDarkMode} />
        <PlayButton audioUrl={solutionMp3Url} isDarkMode={isDarkMode} playDuration={playDuration} />
        <div className="max-w-screen-sm w-full mx-auto flex-col">
          <SearchBar onSelect={onSelect} isDarkMode={isDarkMode} isDisabled={isGameWon || isGameLost} />
          <div className="flex justify-between mt-4">
            {isGameWon || isGameLost ? (
              <div className="flex justify-center w-full">
                <button
                  onClick={resetGame}
                  className={`w-30 rounded-md border border-indigo-600 shadow-sm px-4 py-2 bg-white text-indigo-600 font-medium hover:bg-gray-100 ${isDarkMode ? 'dark:bg-gray-800 dark:text-white' : ''
                    }`}
                >
                  New Song?
                </button>
              </div>
            ) : (
              <>
                <SkipButton onSkip={onSkip} timeAdded={timeAdded} isDarkMode={isDarkMode} isDisabled={isGameWon || isGameLost} />
                <SubmitButton onClick={onEnter} isDisabled={isGameWon || isGameLost} />
              </>
            )}
          </div>
        </div>
        <InfoModal
          isOpen={isInfoModalOpen}
          handleClose={() => setIsInfoModalOpen(false)}
        />
        <StatsModal
          isOpen={isStatsModalOpen}
          handleClose={() => setIsStatsModalOpen(false)}
          guesses={guesses}
          gameStats={stats}
          isGameLost={isGameLost}
          isGameWon={isGameWon}
          handleShareToClipboard={() => showSuccessAlert(GAME_COPIED_MESSAGE)}
          isHardMode={isHardMode}
          isDarkMode={isDarkMode}
          numberOfGuessesMade={guesses.length}
        />
        <SongModal
          isOpen={isSongModalOpen}
          handleClose={() => {
            setIsSongModalOpen(false)
            setIsStatsModalOpen(true)
          }}
          guesses={guesses}
          isGameLost={isGameLost}
          isGameWon={isGameWon}
          handleShareToClipboard={() => showSuccessAlert(GAME_COPIED_MESSAGE)}
          isHardMode={isHardMode}
          isDarkMode={isDarkMode}
        />
        <SettingsModal
          isOpen={isSettingsModalOpen}
          handleClose={() => setIsSettingsModalOpen(false)}
          isHardMode={isHardMode}
          handleHardMode={handleHardMode}
          isDarkMode={isDarkMode}
          handleDarkMode={handleDarkMode}
        />
        <AlertContainer />
      </div>
    </div>
  );
}

export default App;