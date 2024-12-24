import { HYMNS } from "../../constants/hymn";
import { CorrectRow } from "./CorrectRow";
import { EmptyRow } from "./EmptyRow";
import { IncorrectRow } from "./IncorrectRow";
import { useEffect, useState } from "react";

type GameRowsProps = {
  guesses: string[];
  isGameWon: boolean;
};

export const GameRows = ({ guesses, isGameWon }: GameRowsProps) => {
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
    }
  }, [guesses]);

  // Render the rows
  return (
    <div className="max-w-screen-sm w-full mx-auto">
      {/* Render each guess, check if it's the last guess and if the game is won */}
      {guessIds.map((id, index) => {
        if (index === guessIds.length - 1 && isGameWon) {
          // If it's the last guess and the game is won, render CorrectRow
          return <CorrectRow key={id} hymn={HYMNS[id]} />;
        } else {
          // For all other guesses, render IncorrectRow
          return <IncorrectRow key={id} hymn={HYMNS[id]} />;
        }
      })}

      {/* Render EmptyRows for remaining spaces */}
      {6 - guessIds.length > 0 &&
        Array.from({ length: 6 - guessIds.length }).map((_, index) => (
          <EmptyRow key={index} />
        ))}
    </div>
  );
};
