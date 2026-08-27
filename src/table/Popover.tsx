import React, {
	createContext,
	forwardRef,
	useCallback,
	useContext,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
	type FocusEvent,
	type MouseEvent,
	type ReactElement,
} from "react";
import { createPortal } from "react-dom";

interface PopoverNestingContextValue {
	registerDescendant: (el: HTMLElement) => () => void;
	close: () => void;
}

const PopoverNestingContext = createContext<PopoverNestingContextValue | null>(
	null,
);

function mergeHandlers<E>(
	...handlers: Array<((e: E) => void) | undefined>
): (e: E) => void {
	return (e: E) => {
		for (const handler of handlers) handler?.(e);
	};
}

interface PopoverOwnProps {
	trigger: ReactElement<Record<string, any>>;
	children: ReactElement;
}

type PopoverProps = PopoverOwnProps & Record<string, any>;

const Popover = forwardRef<HTMLElement, PopoverProps>(
	({ trigger, children, ...rest }, forwardedRef) => {
		const [position, setPosition] = useState<{ left: number; top: number }>(
			{
				left: 0,
				top: 0,
			},
		);
		const [visible, setVisible] = useState(false);

		const triggerRef = useRef<HTMLElement>(null);
		const popoverRef = useRef<HTMLDivElement>(null);
		const descendantNodes = useRef<Set<HTMLElement>>(new Set());

		const parentContext = useContext(PopoverNestingContext);

		useImperativeHandle(
			forwardedRef,
			() => triggerRef.current as HTMLElement,
		);

		function toggle() {
			setVisible((prev) => !prev);
		}

		const registerDescendant = useCallback(
			(el: HTMLElement) => {
				descendantNodes.current.add(el);
				const unregisterFromParent =
					parentContext?.registerDescendant(el);

				return () => {
					descendantNodes.current.delete(el);
					unregisterFromParent?.();
				};
			},
			[parentContext],
		);

		useEffect(() => {
			if (!visible || !popoverRef.current || !parentContext) return;
			return parentContext.registerDescendant(popoverRef.current);
		}, [visible, parentContext]);

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
			const handleClickOutside = (e: globalThis.MouseEvent) => {
				if (!triggerRef.current) return;
				if (!popoverRef.current) return;
				if (!visible) return;

				const target = e.target as Node;

				const isInsideTrigger = triggerRef.current.contains(target);
				const isInsideContent = popoverRef.current.contains(target);
				const isInsideDescendant = Array.from(
					descendantNodes.current,
				).some((node) => node.contains(target));

				if (
					!isInsideTrigger &&
					!isInsideContent &&
					!isInsideDescendant
				) {
					setVisible(false);
				}
			};

			document.addEventListener("mousedown", handleClickOutside);
			return () => {
				document.removeEventListener("mousedown", handleClickOutside);
			};
		}, [visible]);

		const close = useCallback(() => setVisible(false), []);

		const nestingContextValue = useMemo<PopoverNestingContextValue>(
			() => ({ registerDescendant, close }),
			[registerDescendant, close],
		);

		return (
			<>
				{React.cloneElement(trigger, {
					...rest,
					ref: triggerRef,
					onClick: mergeHandlers<MouseEvent>(
						trigger.props.onClick,
						rest.onClick,
						toggle,
					),
					onMouseEnter: mergeHandlers<MouseEvent>(
						trigger.props.onMouseEnter,
						rest.onMouseEnter,
					),
					onMouseLeave: mergeHandlers<MouseEvent>(
						trigger.props.onMouseLeave,
						rest.onMouseLeave,
					),
					onFocus: mergeHandlers<FocusEvent>(
						trigger.props.onFocus,
						rest.onFocus,
					),
					onBlur: mergeHandlers<FocusEvent>(
						trigger.props.onBlur,
						rest.onBlur,
					),
				})}

				{visible &&
					createPortal(
						<div
							ref={popoverRef}
							className="z-100 border border-border py-2 rounded-sm bg-main text-text absolute shadow-lg"
							style={{ left: position.left, top: position.top }}
						>
							<PopoverNestingContext.Provider
								value={nestingContextValue}
							>
								{children}
							</PopoverNestingContext.Provider>
						</div>,
						document.body,
					)}
			</>
		);
	},
);

export function usePopoverClose(): (() => void) | undefined {
	const context = useContext(PopoverNestingContext);
	return context?.close;
}

export default React.memo(Popover);
