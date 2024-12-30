import React from "react";
import { XCircleIcon } from "@heroicons/react/outline";

type IncorrectRowProps = {
  hymn: string;
  isDarkMode: boolean;
};

export const IncorrectRow = React.memo(({ hymn, isDarkMode }: IncorrectRowProps) => {
  return (
    <div className="flex pb-2">
      <div
        className={`w-full h-14 border-solid border-2 flex items-center mx-0.5 font-bold rounded ${
          isDarkMode
            ? "bg-gray-800 text-gray-300 border-red-700"
            : "bg-white text-black border-red-600"
        }`}
      >
        <XCircleIcon
          className={`w-10 h-10 mx-2 ${
            isDarkMode ? "text-red-400" : "text-red-500"
          }`}
        />
        <div>{hymn}</div>
      </div>
    </div>
  );
});
