type SkipButtonProps = {
  onSkip: () => void;
  isDisabled: boolean;
  isDarkMode: boolean;
  timeAdded: number;
};

export const SkipButton = ({ onSkip, isDisabled, isDarkMode, timeAdded }: SkipButtonProps) => {
  return (
    <button
      type="button"
      className={`flex rounded-md border-2 shadow-sm mx-2 px-4 py-2 text-base font-medium sm:text-sm ${
        isDisabled
          ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-500"
          : isDarkMode
          ? "bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700"
          : "bg-white text-[#185642] border-[#185642] hover:bg-gray-200"
      }`}
      onClick={onSkip}
      disabled={isDisabled}
    >
      Skip{timeAdded > 0 ? ` (+${timeAdded}s)` : ""}
    </button>
  );
};
