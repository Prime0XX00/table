import React, { useEffect, useState, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	value?: string | number;
	onValueChange?: (value: string | number) => void;
}

const Input: React.FC<InputProps> = ({ value, onValueChange, ...props }) => {
	useEffect(() => {
		setVal(value ? String(value) : "");
	}, [value]);

	const [val, setVal] = useState<string>(value ? String(value) : "");

	function onChange(value: string) {
		setVal(value);
		onValueChange?.(value);
	}

	return (
		<input
			{...props}
			className={`${props.className} h-element min-w-16 w-fit rounded-sm border border-border bg-main flex items-center gap-x-2 justify-between px-2`}
			onChange={(e) => onChange(e.target.value)}
			value={val}
		/>
	);
};

export default Input;
