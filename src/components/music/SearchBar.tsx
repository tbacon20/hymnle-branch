import { useEffect, useRef } from "react";
import { songTitles } from "../../lib/searchbar";
import { autocomplete } from "../../lib/searchbar";

type SearchBarProps = {
  onSelect: (guess: string) => void;
  isDisabled: boolean;
};

export const SearchBar = ({ onSelect, isDisabled }: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      autocomplete(inputRef.current, songTitles, onSelect);
    }
  }, [onSelect]);

  return (
    <div className="flex justify-center p-2 autocomplete">
      <input
        ref={inputRef}
        type="text"
        id="searchBarInput"
        placeholder="Search for a song..."
        className={`w-full ${isDisabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
        disabled={isDisabled}
      />
    </div>
  );
};
