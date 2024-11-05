import { useEffect } from "react";
import { hymnTitles } from "../../lib/searchbar";
import { autocomplete } from "../../lib/searchbar";

type SearchBarProps = {
  onSelect: (guess: string) => void; // Accept onSelect prop
};

export const SearchBar = ({ onSelect }: SearchBarProps) => {
  useEffect(() => {
    const inputElement = document.getElementById("searchBarInput") as HTMLInputElement;
    autocomplete(inputElement, hymnTitles, onSelect); // Pass onSelect to autocomplete
  }, [onSelect]);

  return (
    <div className="flex justify-center p-2 autocomplete">
        <input type="text" id="searchBarInput" placeholder="Search for a song..." className="w-full"/>
    </div>
  );
};
