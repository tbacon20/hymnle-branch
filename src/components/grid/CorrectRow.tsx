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
            ? "bg-gray-800 text-gray-300 border-[#3d8464]"
            : "bg-[#3d8464] text-white border-[#3d8464]"
        }`}
      >
        <CheckCircleIcon
          className={`w-10 h-10 mx-2 ${
            isDarkMode ? "text-green-300" : "text-white"
          }`}
        />
        <div>{hymn}</div>
      </div>
    </div>
  );
});
