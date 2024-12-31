interface SubmitButtonProps {
  onClick: () => void;
  isDisabled: boolean;
}

export const SubmitButton = ({ onClick, isDisabled }: SubmitButtonProps) => {
  return (
    <button
      type="button"
      className={`flex rounded-md border border-transparent shadow-sm mx-2 px-4 py-2 bg-[#185642] text-base font-medium text-white sm:text-sm ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
      onClick={onClick}
      disabled={isDisabled}
    >
      Submit
    </button>
  );
};