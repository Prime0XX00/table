import React, { type ButtonHTMLAttributes } from "react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	icon: IconName;
}

const IconButton: React.FC<IconButtonProps> = ({ icon, ...props }) => {
	return (
		<button
			{...props}
			className={`${props.className} disabled:opacity-disabled not-disabled:hover:bg-main-hover not-disabled:cursor-pointer p-1.5 rounded-full bg-transparent`}
		>
			<DynamicIcon
				name={icon}
				size={18}
			></DynamicIcon>
		</button>
	);
};

export default React.memo(IconButton);
