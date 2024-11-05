interface SubmitButtonProps {
  onClick: () => void;  // Prop for the onClick handler
}

export const SubmitButton = ({ onClick }: SubmitButtonProps) => {
  return (
    <button
      type="button"
      className="flex rounded-md border border-transparent shadow-sm mx-2 px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:text-sm"
      onClick={onClick}
    >
      Submit
    </button>
  );
};
