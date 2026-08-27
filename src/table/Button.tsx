import React, { type ButtonHTMLAttributes, type Ref } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	ref?: Ref<HTMLButtonElement>;
}

const Button: React.FC<ButtonProps> = ({ ref, ...props }) => {
	return (
		<button
			{...props}
			ref={ref}
			className={`${props.className} disabled:opacity-disabled not-disabled:hover:bg-main-hover not-disabled:cursor-pointer h-element p-1 rounded-md border border-border bg-main`}
		>
			{props.children}
		</button>
	);
};

export default Button;
