import { cn } from "clsx-for-tailwind";

interface Props {
  label: string;
}
const DropDownList = ({ label }: Props) => {
  return (
    <div className={cn("w-[170px]", "flex flex-col gap-1")}>
      <label
        className={cn("text-sm font-semibold")}
        htmlFor={`drop-down-list-${label}`}
      >
        {label}
      </label>
      <select
        className={cn("py-1 px-2", "border border-black/20 rounded-lg")}
        id={`drop-down-list-${label}`}
      >
        <option value="psicología">Psicología</option>
        <option value="general">General</option>
        <option value="radiologia">Radiología</option>
      </select>
    </div>
  );
};

export default DropDownList;
