import { HYMNS } from "../../constants/hymn";
import { CorrectRow } from "./CorrectRow";
import { EmptyRow } from "./EmptyRow";
import { IncorrectRow } from "./IncorrectRow";

export const GameRows = () => {
  const fakeIncorrectHymn = HYMNS[0]
  const fakeCorrectHymn = HYMNS[1];
  return (
    <div className="max-w-screen-sm w-full mx-auto grow">
      <IncorrectRow hymn={fakeIncorrectHymn} />
      <CorrectRow hymn={fakeCorrectHymn} />
      <EmptyRow />
      <EmptyRow />
      <EmptyRow />
      <EmptyRow />
    </div>
  );
};
