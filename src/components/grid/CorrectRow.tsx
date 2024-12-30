import React from "react";
import { CheckCircleIcon } from "@heroicons/react/outline";

type CorrectRowProps = {
  hymn: string;
  isDarkMode: boolean;
};

export const CorrectRow = React.memo(({ hymn, isDarkMode }: CorrectRowProps) => {
  return (
    <div className="flex pb-2">
      <div
        className={`w-full h-14 border-solid border-2 flex items-center mx-0.5 font-bold rounded ${
          isDarkMode
            ? "bg-gray-800 text-gray-300 border-green-700"
            : "bg-white text-black border-green-600"
        }`}
      >
        <CheckCircleIcon
          className={`w-10 h-10 mx-2 ${
            isDarkMode ? "text-green-400" : "text-green-500"
          }`}
        />
        <div>{hymn}</div>
      </div>
    </div>
  );
});
