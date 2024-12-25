import { useState, useEffect } from "react";
import { InfoModal } from "./components/modals/InfoModal";
import { StatsModal } from "./components/modals/StatsModal";
import { SettingsModal } from "./components/modals/SettingsModal";

import {
  WIN_MESSAGES,
  GAME_COPIED_MESSAGE,
  CORRECT_SONG_MESSAGE,
  HARD_MODE_ALERT_MESSAGE,
} from "./constants/strings";
import {
  MAX_CHALLENGES,
  GAME_LOST_INFO_DELAY,
  WELCOME_INFO_MODAL_MS,
} from "./constants/settings";
import {
  isWinningSong,
  solution,
} from "./lib/songs";
import { addStatsForCompletedGame, loadStats } from "./lib/stats";
import {
  loadGameStateFromLocalStorage,
  saveGameStateToLocalStorage,
  setStoredIsHighContrastMode,
  getStoredIsHighContrastMode,
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
import { HYMNS } from "./constants/hymnBook";

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
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isGameLost, setIsGameLost] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme")
      ? localStorage.getItem("theme") === "dark"
      : prefersDarkMode
      ? true
      : false
  );
  const [isHighContrastMode, setIsHighContrastMode] = useState(
    getStoredIsHighContrastMode()
  );
  const [skippedRows, setSkippedRows] = useState<number[]>([]); // Track skipped rows
  const [guesses, setGuesses] = useState<string[]>([]);
  const [stats, setStats] = useState(() => loadStats());

  const [isHardMode, setIsHardMode] = useState(
    localStorage.getItem("gameMode")
      ? localStorage.getItem("gameMode") === "hard"
      : false
  );

  // moved to searchbar.tsx useEffect(()=> {  autocomplete(document.getElementById("searchBarInput"), hymnTitles);});

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

    if (isHighContrastMode) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  }, [isDarkMode, isHighContrastMode]);

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

  const handleHighContrastMode = (isHighContrast: boolean) => {
    setIsHighContrastMode(isHighContrast);
    setStoredIsHighContrastMode(isHighContrast);
  };

  const playDurations = new Map<number, number>([
    [1, 2],
    [2, 3],
    [3, 5],
    [4, 11],
    [5, 16],
    [6, 31],
  ]);
  
  const getPlayDuration = (turn: number): number => {
    return playDurations.get(turn) ?? 31; // Default to 30 if turn is not in the map
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
        onClose: () => setIsStatsModalOpen(true),
      });
    }
  
    if (isGameLost) {
      setTimeout(() => {
        setIsStatsModalOpen(true);
      }, GAME_LOST_INFO_DELAY);
    }
  }, [isGameWon, isGameLost, showSuccessAlert]);

  const onSelect = (selectedHymn: string) => {
    setCurrentGuess(selectedHymn);
  };

  const onEnter = () => {
    if (currentGuess) {
      const hymn = HYMNS.find((h: { title: string }) => h.title === currentGuess);
      const winningSong = isWinningSong(currentGuess);  
      if (hymn && currentTurn <= MAX_CHALLENGES) {
        setGuesses((prevGuesses) => {
          const updatedGuesses = [...prevGuesses, currentGuess];
          if (winningSong) {
            setStats(addStatsForCompletedGame(stats, updatedGuesses.length));
            setIsGameWon(true);
          }
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
        setCurrentTurn((prevTurn) => prevTurn + 1);
      } else if (guesses.length > MAX_CHALLENGES) {
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

  //TODO update audioURL based on selected hymn. Was "https://assets.churchofjesuschrist.org/1b/13/1b13523680a0201653cfc366afbef38cde7fe1aa/the_morning_breaks_vocal_accompaniment_eng.mp3"
  const audioUrl = HYMNS[0]?.mp3_url;
  const playDuration = getPlayDuration(currentTurn);

  return (
    <div className="h-screen flex flex-col">
      <Navbar
        setIsInfoModalOpen={setIsInfoModalOpen}
        setIsStatsModalOpen={setIsStatsModalOpen}
        setIsSettingsModalOpen={setIsSettingsModalOpen}
      />
      <div className="pt-2 px-1 pb-8 md:max-w-7xl w-full mx-auto sm:px-6 lg:px-8 flex flex-col grow">
        <GameRows guesses={guesses} skippedRows={skippedRows} isGameWon={isGameWon} />
        <PlayButton audioUrl={audioUrl} playDuration={playDuration} />
        <div className="max-w-screen-sm w-full mx-auto flex-col">
        <SearchBar onSelect={onSelect} isDisabled={isGameWon || isGameLost} />
          <div className="flex justify-between">
            <SkipButton onSkip={onSkip} isDisabled={isGameWon || isGameLost} />
            <SubmitButton onClick={onEnter} isDisabled={isGameWon || isGameLost} />
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
          isHighContrastMode={isHighContrastMode}
          numberOfGuessesMade={guesses.length}
        />
        <SettingsModal
          isOpen={isSettingsModalOpen}
          handleClose={() => setIsSettingsModalOpen(false)}
          isHardMode={isHardMode}
          handleHardMode={handleHardMode}
          isDarkMode={isDarkMode}
          handleDarkMode={handleDarkMode}
          isHighContrastMode={isHighContrastMode}
          handleHighContrastMode={handleHighContrastMode}
        />
        <AlertContainer />
      </div>
    </div>
  );
}

export default App;