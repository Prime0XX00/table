import { CheckIcon, MinusIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

interface CheckboxProps {
	checked?: boolean | undefined;
	onChange?: (checked: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ ...props }) => {
	useEffect(() => {
		setChecked(props.checked ?? false);
	}, [props.checked]);

	function onChange(checked: boolean) {
		setChecked(checked);
		props.onChange?.(checked);
	}

	const [checked, setChecked] = useState(props.checked ?? false);

	return (
		<div
			onClick={() => onChange(!checked)}
			className={`${checked != false ? "bg-blue-600 border-blue-600 text-white" : "border-slate-300 bg-white"} size-4 border rounded-sm flex items-center justify-center cursor-pointer`}
		>
			{checked == true && <CheckIcon></CheckIcon>}
			{checked == undefined && <MinusIcon></MinusIcon>}
		</div>
	);
};

export default Checkbox;
