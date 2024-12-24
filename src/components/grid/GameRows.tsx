import { HYMNS } from "../../constants/hymn";
import { CorrectRow } from "./CorrectRow";
import { EmptyRow } from "./EmptyRow";
import { IncorrectRow } from "./IncorrectRow";
import { SkippedRow } from "./SkippedRow";
import { useEffect, useState } from "react";

type GameRowsProps = {
  guesses: string[];
  skippedRows: number[]; // Add skippedRows prop
  isGameWon: boolean;
};

export const GameRows = ({ guesses, skippedRows, isGameWon }: GameRowsProps) => {
  const [guessIds, setGuessIds] = useState<number[]>([]);

  useEffect(() => {
    if (guesses.length > 0) {
      const updatedGuessIds = guesses
        .map((guess) => {
          const hymnIndex = HYMNS.findIndex((hymn) => hymn.title === guess);
          return hymnIndex !== -1 ? hymnIndex : null; // return the ID or null if not found
        })
        .filter((id) => id !== null) as number[];

      setGuessIds(updatedGuessIds);
    }
  }, [guesses]);

  return (
    <div className="max-w-screen-sm w-full mx-auto">
      {guessIds.map((id, index) => {
        if (index === guessIds.length - 1 && isGameWon) {
          return <CorrectRow key={id} hymn={HYMNS[id]} />;
        } else {
          return <IncorrectRow key={id} hymn={HYMNS[id]} />;
        }
      })}

      {skippedRows.map((row, index) => (
        <SkippedRow key={`skipped-${index}`} hymn={null} />
      ))}

      {6 - guessIds.length - skippedRows.length > 0 &&
        Array.from({ length: 6 - guessIds.length - skippedRows.length }).map(
          (_, index) => <EmptyRow key={index} />
        )}
    </div>
  );
};
