import React, { type ButtonHTMLAttributes, type Ref } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	ref?: Ref<HTMLButtonElement>;
}

const Button: React.FC<ButtonProps> = ({ ref, ...props }) => {
	return (
		<button
			{...props}
			ref={ref}
			className={`${props.className} disabled:opacity-50 not-disabled:hover:bg-slate-100 not-disabled:cursor-pointer h-8.5 p-1 rounded-md border border-slate-300`}
		>
			{props.children}
		</button>
	);
};

export default Button;
