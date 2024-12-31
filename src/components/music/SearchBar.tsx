import { useEffect, useRef } from "react";
import { songTitles } from "../../lib/searchbar";
import { autocomplete } from "../../lib/searchbar";

type SearchBarProps = {
  onSelect: (guess: string) => void;
  isDisabled: boolean;
  isDarkMode: boolean;
};

export const SearchBar = ({ onSelect, isDisabled, isDarkMode }: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      autocomplete(inputRef.current, songTitles, onSelect, isDarkMode);
    }
  }, [onSelect, isDarkMode]);

  return (
    <div className={`flex justify-center p-2 autocomplete ${isDarkMode ? "dark" : ""}`}>
      <input
        ref={inputRef}
        type="text"
        id="searchBarInput"
        placeholder="Search for a song..."
        className={`w-full p-2 rounded-md border focus:outline-[#185642] ${
          isDisabled
            ? "bg-gray-100 text-gray-500 cursor-not-allowed"
            : isDarkMode
            ? "bg-gray-800 text-white border-gray-600"
            : "bg-white text-black border-gray-300"
        }`}
        disabled={isDisabled}
      />
    </div>
  );
};
