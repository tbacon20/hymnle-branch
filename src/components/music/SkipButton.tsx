export const SkipButton = ({ onSkip, isDisabled }: { onSkip: () => void, isDisabled: boolean }) => {
  return (
    <button
      type="button"
      className={`flex rounded-md border-2 border-indigo-600 shadow-sm mx-2 px-4 py-2 bg-white text-base font-medium text-indigo-600 hover:bg-gray-200 focus:outline-none sm:text-sm ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
      onClick={onSkip}
      disabled={isDisabled}
    >
      Skip(+1s)
    </button>
  );
};