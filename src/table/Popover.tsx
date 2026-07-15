import React, { useEffect, useRef, useState, type ReactElement } from "react";
import { createPortal } from "react-dom";

interface PopoverProps {
	trigger: ReactElement<{
		onClick?: () => void;
		ref?: React.Ref<HTMLElement>;
	}>;
	children: ReactElement;
}

const Popover: React.FC<PopoverProps> = ({ ...props }) => {
	const [position, setPosition] = useState<{ left: number; top: number }>({
		left: 0,
		top: 0,
	});

	const [visible, setVisible] = useState(false);

	const triggerRef = useRef<HTMLElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);

	function toggle() {
		setVisible((prev) => !prev);
	}

	useEffect(() => {
		if (!visible || !triggerRef.current || !popoverRef.current) return;

		const triggerRect = triggerRef.current.getBoundingClientRect();
		const popoverRect = popoverRef.current.getBoundingClientRect();
		setPosition({
			left: triggerRect.left + triggerRect.width - popoverRect.width,
			top: triggerRect.top + triggerRect.height + 4,
		});
	}, [visible]);

	useEffect(() => {
		const handleClickOutside = (e: any) => {
			if (!triggerRef.current) return;
			if (!popoverRef.current) return;
			if (!visible) return;

			const isOutside =
				!triggerRef.current.contains(e.target) &&
				!popoverRef.current.contains(e.target);

			if (isOutside) {
				setVisible(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [triggerRef, popoverRef, visible]);

	return (
		<>
			{React.cloneElement(props.trigger, {
				ref: triggerRef,
				onClick: toggle,
			})}

			{visible &&
				createPortal(
					<div
						ref={popoverRef}
						className="border border-slate-300 py-2 rounded-sm bg-white absolute shadow-lg"
						style={{ left: position.left, top: position.top }}
					>
						{props.children}
					</div>,
					document.body,
				)}
		</>
	);
};

export default Popover;
