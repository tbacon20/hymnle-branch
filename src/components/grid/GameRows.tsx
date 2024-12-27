import { songTitles } from "../../lib/searchbar";
import { CorrectRow } from "./CorrectRow";
import { EmptyRow } from "./EmptyRow";
import { IncorrectRow } from "./IncorrectRow";
import { SkippedRow } from "./SkippedRow";
import { useEffect, useState } from "react";
import { useMemo } from "react";

type GameRowsProps = {
  guesses: string[];
  skippedRows: number[];
  isGameWon: boolean;
};

export const GameRows = ({ guesses, skippedRows, isGameWon }: GameRowsProps) => {
  const [guessIds, setGuessIds] = useState<(number | null)[]>([]);

  useEffect(() => {
    const updatedGuessIds = guesses.map((guess) => {
      if (guess === "SKIPPED") return null;
      const songIndex = songTitles.findIndex((song) => song === guess);
      return songIndex !== -1 ? songIndex : null;
    });
    setGuessIds(updatedGuessIds);
  }, [guesses]);

  const combinedRows = useMemo(() => {
    return Array.from({ length: 6 }).map((_, index) => {
      if (skippedRows.includes(index)) {
        return { type: "skipped", id: `skipped-${index}` };
      } else if (index < guesses.length) {
        const guessId = guessIds[index];
        if (guessId === null) {
          return { type: "skipped", id: `skipped-${index}` };
        }
        return {
          type: "guess",
          id: guessId,
          isCorrect: index === guesses.length - 1 && isGameWon,
        };
      } else {
        return { type: "empty", id: `empty-${index}` };
      }
    });
  }, [guesses, skippedRows, guessIds, isGameWon]);

  return (
    <div className="max-w-screen-sm w-full mx-auto">
      {combinedRows.map((row) => {
        switch (row.type) {
          case "skipped":
            return <SkippedRow key={row.id}/>;
          case "guess":
            if (typeof row.id === "number") {
              return row.isCorrect ? (
                <CorrectRow key={row.id} hymn={songTitles[row.id]} />
              ) : (
                <IncorrectRow key={row.id} hymn={songTitles[row.id]} />
              );
            }
            break;
          case "empty":
          default:
            return <EmptyRow key={row.id} />;
        }
      })}
    </div>
  );
};
