import React from "react";

export const EmptyRow = React.memo(() => {
  return (
    <div className="flex pb-2">
      <div className="w-full h-14 border-solid border-2 border-slate-400 flex items-center justify-center mx-0.5 font-bold rounded dark:text-white"></div>
    </div>
  );
});