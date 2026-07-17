import React, { useEffect, useState } from "react";

interface InputProps {
	value?: string | number;
	onValueChange?: (value: string | number) => void;
}

const Input: React.FC<InputProps> = ({ ...props }) => {
	useEffect(() => {
		setValue(props.value ? String(props.value) : "");
	}, [props.value]);

	const [value, setValue] = useState<string>(
		props.value ? String(props.value) : "",
	);

	function onChange(value: string) {
		setValue(value);
		props.onValueChange?.(value);
	}

	return (
		<input
			className="h-8.5 min-w-16 w-fit rounded-sm border border-slate-300 flex items-center gap-x-2 justify-between px-2"
			onChange={(e) => onChange(e.target.value)}
			value={value}
		/>
	);
};

export default Input;
