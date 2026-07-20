import React, { useEffect, useRef } from "react";

interface ResizerProps {
	isResizable?: boolean;
	container?: HTMLDivElement | null;
	callback?: (width: number) => void;
}

const HeaderResizer: React.FC<ResizerProps> = ({
	isResizable = true,
	...props
}) => {
	const resizerRef = useRef<HTMLDivElement>(null);
	const dragRef = useRef(false);

	useEffect(() => {
		if (!isResizable) return;

		const el = resizerRef.current;
		if (!el) return;

		const onMouseDown = () => {
			dragRef.current = true;
		};

		const onMouseUp = () => {
			dragRef.current = false;
		};

		const onMouseMove = (e: MouseEvent) => {
			if (!dragRef.current) return;
			handleMove(e.clientX);
		};

		el.addEventListener("mousedown", onMouseDown);
		window.addEventListener("mouseup", onMouseUp);
		window.addEventListener("mousemove", onMouseMove);

		return () => {
			el.removeEventListener("mousedown", onMouseDown);
			window.removeEventListener("mouseup", onMouseUp);
			window.removeEventListener("mousemove", onMouseMove);
		};
	}, [props.container, props.callback]);

	function handleMove(x: number) {
		if (!resizerRef.current || !props.container) return;
		const resizerRect = resizerRef.current.getBoundingClientRect();
		const containerRect = props.container.getBoundingClientRect();

		const newWidth = x + resizerRect.width / 2 - containerRect.left;
		props.callback?.(newWidth);
	}

	return (
		<div
			className={`${isResizable ? "cursor-col-resize" : ""} group min-w-3 w-full max-w-3 h-full flex justify-center items-center`}
			ref={resizerRef}
		>
			<div
				className={`${isResizable ? "group-hover:bg-blue-600 group-hover:w-1 transition-all" : ""} bg-slate-200 rounded-sm w-px h-1/2`}
			></div>
		</div>
	);
};

export default HeaderResizer;
