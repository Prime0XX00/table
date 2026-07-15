import { CheckIcon, MinusIcon } from "lucide-react";
import React from "react";

interface CheckboxProps {
	checked: boolean | undefined;
	onChange?: (checked: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ ...props }) => {
	return (
		<div
			onClick={() => props.onChange?.(!props.checked)}
			className={`${props.checked != false ? "bg-blue-600 border-blue-600 text-white" : "border-slate-300 bg-white"} size-4 border rounded-sm flex items-center justify-center cursor-pointer`}
		>
			{props.checked == true && <CheckIcon></CheckIcon>}
			{props.checked == undefined && <MinusIcon></MinusIcon>}
		</div>
	);
};

export default Checkbox;
