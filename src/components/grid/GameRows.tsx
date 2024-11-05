import { HYMNS } from "../../constants/hymn";
import { CorrectRow } from "./CorrectRow";
import { EmptyRow } from "./EmptyRow";
import { IncorrectRow } from "./IncorrectRow";
import { useEffect, useState } from "react";

type GameRowsProps = {
  guesses: string[];
}; 

export const GameRows = ({guesses}: GameRowsProps) => {
  const [guessIds, setGuessIds] = useState<number[]>([]);
  
  useEffect(() => {
    if (guesses.length > 0) {
      // Map over the guesses and get only the IDs of valid guesses
      const updatedGuessIds = guesses
        .map((guess) => {
          const hymnIndex = HYMNS.findIndex((hymn) => hymn.title === guess);
          return hymnIndex !== -1 ? hymnIndex : null; // return the ID or null if not found
        })
        .filter((id) => id !== null) as number[];

      setGuessIds(updatedGuessIds);
      alert("Current guess IDs: " + updatedGuessIds.join(", "));
    }
  }, [guesses]);
  
  const fakeIncorrectHymn = HYMNS[0]
  const fakeCorrectHymn = HYMNS[1];
  return (
    <div className="max-w-screen-sm w-full mx-auto grow">
      {/* Render IncorrectRow for each valid guess ID */}
      {guessIds.map((id) => (
        <IncorrectRow key={id} hymn={HYMNS[id]} />
      ))}
      
      {/* Render CorrectRow if there's a correct guess, placeholder for now 
      <CorrectRow hymn={HYMNS[1]} />*/}

      {/* Render EmptyRows for remaining spaces */}
      {6 - guessIds.length > 0 && 
        Array.from({ length: 6 - guessIds.length }).map((_, index) => (
          <EmptyRow key={index} />
        ))}
    </div>
  );
};
