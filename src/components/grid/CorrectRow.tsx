import { CheckCircleIcon } from "@heroicons/react/outline";

type Props = {
  hymn: any
}

export const CorrectRow = ({hymn}: Props) => {
  return (
    <div className="flex pb-2">
      <div className="w-full h-14 border-solid border-2 flex items-center mx-0.5 font-bold rounded dark:text-white border-green-600 dark:border-slate-700">
        <CheckCircleIcon className="w-10 h-10 text-green-500 dark:stroke-white mx-2"/>
        <div>
            {hymn.number}. {hymn.title}
        </div>
      </div>
    </div>
  );
};
