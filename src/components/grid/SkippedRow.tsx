import { MinusCircleIcon } from "@heroicons/react/outline";

type Props = {
  hymn: any;
};

export const SkippedRow = ({ hymn }: Props) => {
  return (
    <div className="flex pb-2">
      <div className="w-full h-14 border-solid border-2 border-slate-400 flex items-center mx-0.5 font-bold rounded dark:text-white">
      <MinusCircleIcon className="w-10 h-10 mx-2 text-gray-400" />
        <div className="text-gray-400 dark:text-slate-700">SKIPPED</div>
      </div>
    </div>
  );
};