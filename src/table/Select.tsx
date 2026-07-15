import { ChevronDownIcon } from "lucide-react";
import Popover from "./Popover";

interface SelectProps {
	options: Option[];
	value?: string | number;
	onChange?: (value: string | number) => void;
}

interface Option {
	value: string | number;
	display: string;
}

const Select: React.FC<SelectProps> = ({ ...props }) => {
	const selectedValue = props.value ?? props.options[0].value;

	function onChange(option: Option) {
		props.onChange?.(option.value);
	}

	return (
		<Popover
			trigger={
				<div className="h-8.5 min-w-16 w-fit rounded-sm border border-slate-300 hover:bg-slate-100 cursor-pointer flex items-center gap-x-2 justify-between px-2">
					<span>{props.value ? props.value : "Auswählen..."}</span>
					<ChevronDownIcon size={18}></ChevronDownIcon>
				</div>
			}
		>
			<div className="flex flex-col min-w-15.5">
				{props.options.map((option, index) => (
					<div
						key={`option-${index}`}
						className={`${option.value == selectedValue ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-slate-100"} n cursor-pointer px-2 h-8.5 flex items-center justify-center`}
						onClick={() => onChange(option)}
					>
						{option.display}
					</div>
				))}
			</div>
		</Popover>
	);
};

export default Select;
