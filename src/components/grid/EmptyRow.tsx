import React from "react";

type EmptyRowProps = {
  isDarkMode: boolean;
};

export const EmptyRow = React.memo(({ isDarkMode }: EmptyRowProps) => {
  return (
    <div className="flex pb-2">
      <div
        className={`w-full h-14 border-solid border-2 flex items-center justify-center mx-0.5 font-bold rounded ${
          isDarkMode ? "bg-gray-800 border-gray-600 text-gray-400" : "bg-white border-[#6b9184] text-black"
        }`}
      ></div>
    </div>
  );
});
