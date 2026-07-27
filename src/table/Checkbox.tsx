import { CheckIcon, MinusIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

interface CheckboxProps {
	checked?: boolean | undefined;
	onChange?: (checked: boolean) => void;
	readonly?: boolean;
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
			onClick={!props.readonly ? () => onChange(!checked) : undefined}
			className={`${checked != false ? "bg-accent border-accent text-main" : "border-border bg-main"} ${props.readonly ? "" : "cursor-pointer"} size-4 border rounded-sm flex items-center justify-center`}
		>
			{checked == true && <CheckIcon></CheckIcon>}
			{checked == undefined && <MinusIcon></MinusIcon>}
		</div>
	);
};

export default Checkbox;
