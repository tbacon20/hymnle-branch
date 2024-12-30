import React from "react";
import { MinusCircleIcon } from "@heroicons/react/outline";

type SkippedRowProps = {
  isDarkMode: boolean;
};

export const SkippedRow = React.memo(({ isDarkMode }: SkippedRowProps) => {
  return (
    <div className="flex pb-2">
      <div
        className={`w-full h-14 border-solid border-2 flex items-center mx-0.5 font-bold rounded ${
          isDarkMode
            ? "bg-gray-800 text-slate-300 border-slate-600"
            : "bg-gray-100 text-gray-400 border-slate-400"
        }`}
      >
        <MinusCircleIcon
          className={`w-10 h-10 mx-2 ${
            isDarkMode ? "text-slate-400" : "text-gray-400"
          }`}
        />
        <div className={`${isDarkMode ? "text-slate-300" : "text-gray-400"}`}>
          SKIPPED
        </div>
      </div>
    </div>
  );
});