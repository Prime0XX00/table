import { ChevronDownIcon } from "lucide-react";
import Popover from "./Popover";
import { useCallback, useEffect, useMemo, useState } from "react";
import React from "react";

interface SelectProps {
	options: SelectOption[];
	value?: string | number;
	onChange?: (value: string | number) => void;
}

export interface SelectOption {
	value: string | number;
	display: string;
}

const Select: React.FC<SelectProps> = ({ ...props }) => {
	useEffect(() => {
		setSelectedOption(
			props.options.find((option) => option.value === props.value) ??
				props.options[0],
		);
	}, [props.value, props.options]);

	const [selectedOption, setSelectedOption] = useState<SelectOption>(
		props.options.find((option) => option.value === props.value) ??
			props.options[0],
	);

	const onChange = useCallback(
		(option: SelectOption) => {
			setSelectedOption(option);
			props.onChange?.(option.value);
		},
		[props.onChange],
	);

	const trigger = useMemo(
		() => (
			<div className="h-8.5 min-w-16 w-fit rounded-sm border border-slate-300 hover:bg-slate-100 cursor-pointer flex items-center gap-x-2 justify-between px-2">
				<span>
					{selectedOption ? selectedOption.display : "Auswählen..."}
				</span>
				<ChevronDownIcon size={18}></ChevronDownIcon>
			</div>
		),
		[selectedOption],
	);

	const options = useMemo(
		() =>
			props.options.map((option, index) => (
				<div
					key={`option-${index}`}
					className={`${option.value == selectedOption.value ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-slate-100"} n cursor-pointer px-2 h-8.5 flex items-center justify-center`}
					onClick={() => onChange(option)}
				>
					{option.display}
				</div>
			)),
		[props.options, selectedOption],
	);

	return (
		<Popover trigger={trigger}>
			<div className="flex flex-col min-w-15.5">{options}</div>
		</Popover>
	);
};

export default React.memo(Select);
