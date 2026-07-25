import React, { useEffect, useRef } from "react";

interface ResizerProps {
	isResizable?: boolean;
	container?: HTMLDivElement | null;
	onResize?: (width: number) => void;
	onRelease?: (width: number) => void;
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

		const onMouseUp = (e: MouseEvent) => {
			if (!dragRef.current) return;
			const newWidth = handleMove(e.clientX);
			props.onRelease?.(newWidth);
			dragRef.current = false;
		};

		const onMouseMove = (e: MouseEvent) => {
			if (!dragRef.current) return;
			const newWidth = handleMove(e.clientX);
			props.onResize?.(newWidth);
		};

		el.addEventListener("mousedown", onMouseDown);
		window.addEventListener("mouseup", onMouseUp);
		window.addEventListener("mousemove", onMouseMove);

		return () => {
			el.removeEventListener("mousedown", onMouseDown);
			window.removeEventListener("mouseup", onMouseUp);
			window.removeEventListener("mousemove", onMouseMove);
		};
	}, [props.container, props.onResize, props.onRelease]);

	function handleMove(x: number): number {
		if (!resizerRef.current || !props.container) return 0;
		const resizerRect = resizerRef.current.getBoundingClientRect();
		const containerRect = props.container.getBoundingClientRect();

		const newWidth = x + resizerRect.width / 2 - containerRect.left;
		return newWidth;
	}

	return (
		<div
			className={`${isResizable ? "cursor-col-resize" : ""} group min-w-4 w-full max-w-4 h-full flex justify-center items-center`}
			ref={resizerRef}
		>
			<div
				className={`${isResizable ? "group-hover:bg-blue-600 group-hover:w-1 transition-all" : ""} bg-slate-200 rounded-sm w-px h-1/2`}
			></div>
		</div>
	);
};

export default HeaderResizer;
