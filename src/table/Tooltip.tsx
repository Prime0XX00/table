import React, {
	useEffect,
	useRef,
	useState,
	type ReactElement,
	type ReactNode,
} from "react";
import { createPortal } from "react-dom";

type TooltipPlacement = "top" | "bottom";

interface TooltipProps {
	trigger: ReactElement<{
		onMouseEnter?: (e: React.MouseEvent) => void;
		onMouseLeave?: (e: React.MouseEvent) => void;
		onFocus?: (e: React.FocusEvent) => void;
		onBlur?: (e: React.FocusEvent) => void;
		ref?: React.Ref<HTMLElement>;
	}>;
	children: ReactNode;
	placement?: TooltipPlacement;
	delay?: number;
}

const Tooltip: React.FC<TooltipProps> = ({
	trigger,
	children,
	placement = "top",
	delay = 50,
}) => {
	const [visible, setVisible] = useState(false);
	const [position, setPosition] = useState<{ left: number; top: number }>({
		left: 0,
		top: 0,
	});

	const triggerRef = useRef<HTMLElement>(null);
	const tooltipRef = useRef<HTMLDivElement>(null);
	const showTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

	const clearShowTimeout = () => {
		if (showTimeout.current) {
			clearTimeout(showTimeout.current);
			showTimeout.current = null;
		}
	};

	const show = () => {
		clearShowTimeout();
		showTimeout.current = setTimeout(() => setVisible(true), delay);
	};

	const hide = () => {
		clearShowTimeout();
		setVisible(false);
	};

	useEffect(() => {
		return () => clearShowTimeout();
	}, []);

	useEffect(() => {
		if (!visible || !triggerRef.current || !tooltipRef.current) return;

		const triggerRect = triggerRef.current.getBoundingClientRect();
		const tooltipRect = tooltipRef.current.getBoundingClientRect();

		const left =
			triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
		const top =
			placement === "top"
				? triggerRect.top - tooltipRect.height - 6
				: triggerRect.top + triggerRect.height + 6;

		setPosition({ left, top });
	}, [visible, placement]);

	// Bei Scroll/Resize ausblenden statt neu zu positionieren
	useEffect(() => {
		if (!visible) return;

		const handleScrollOrResize = () => setVisible(false);

		window.addEventListener("scroll", handleScrollOrResize, true);
		window.addEventListener("resize", handleScrollOrResize);
		return () => {
			window.removeEventListener("scroll", handleScrollOrResize, true);
			window.removeEventListener("resize", handleScrollOrResize);
		};
	}, [visible]);

	return (
		<>
			{React.cloneElement(trigger, {
				ref: triggerRef,
				onMouseEnter: (e: React.MouseEvent) => {
					trigger.props.onMouseEnter?.(e);
					show();
				},
				onMouseLeave: (e: React.MouseEvent) => {
					trigger.props.onMouseLeave?.(e);
					hide();
				},
				onFocus: (e: React.FocusEvent) => {
					trigger.props.onFocus?.(e);
					show();
				},
				onBlur: (e: React.FocusEvent) => {
					trigger.props.onBlur?.(e);
					hide();
				},
			})}

			{visible &&
				createPortal(
					<div
						ref={tooltipRef}
						role="tooltip"
						className="z-100 py-1 px-2 rounded-sm bg-slate-700 text-slate-200 absolute shadow-lg text-sm pointer-events-none"
						style={{ left: position.left, top: position.top }}
					>
						{children}
					</div>,
					document.body,
				)}
		</>
	);
};

export default React.memo(Tooltip);
