import { ChevronDownIcon } from "lucide-react";
import Popover from "./Popover";
import { useCallback, useEffect, useMemo, useState } from "react";
import React from "react";
import Checkbox from "./Checkbox";

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
		if (props.options.length == 0) return;
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
			<div className="h-8.5 min-w-16 w-fit rounded-sm border border-border hover:bg-main-hover bg-main cursor-pointer flex items-center gap-x-2 justify-between px-2">
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
					className={`${
						option.value == selectedOption.value
							? "bg-accent/10 hover:bg-accent/15"
							: "hover:bg-main-hover"
					} h-8.5 flex gap-x-2 px-2 items-center`}
				>
					<Checkbox
						checked={option.value == selectedOption.value}
						onChange={() => onChange(option)}
					></Checkbox>
					<span>{option.display}</span>
				</div>
			)),
		[props.options, selectedOption],
	);

	return (
		<Popover trigger={trigger}>
			<div className="flex flex-col min-w-20">{options}</div>
		</Popover>
	);
};

export default React.memo(Select);
