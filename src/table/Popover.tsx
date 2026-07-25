import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
	type ReactElement,
} from "react";
import { createPortal } from "react-dom";

interface PopoverNestingContextValue {
	registerDescendant: (el: HTMLElement) => () => void;
}

const PopoverNestingContext = createContext<PopoverNestingContextValue | null>(
	null,
);

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
	const descendantNodes = useRef<Set<HTMLElement>>(new Set());

	// Vom übergeordneten Popover (falls vorhanden) bereitgestellter Context
	const parentContext = useContext(PopoverNestingContext);

	function toggle() {
		setVisible((prev) => !prev);
	}

	// Registriert ein Nachfahren-DOM-Element bei diesem Popover UND
	// reicht die Registrierung an alle weiteren Vorfahren weiter
	const registerDescendant = useCallback(
		(el: HTMLElement) => {
			descendantNodes.current.add(el);
			const unregisterFromParent = parentContext?.registerDescendant(el);

			return () => {
				descendantNodes.current.delete(el);
				unregisterFromParent?.();
			};
		},
		[parentContext],
	);

	// Sobald dieses Popover sichtbar ist, meldet es seinen eigenen
	// (portalten) Content-Knoten beim Elternteil an
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
		const handleClickOutside = (e: MouseEvent) => {
			if (!triggerRef.current) return;
			if (!popoverRef.current) return;
			if (!visible) return;

			const target = e.target as Node;

			const isInsideTrigger = triggerRef.current.contains(target);
			const isInsideContent = popoverRef.current.contains(target);
			const isInsideDescendant = Array.from(descendantNodes.current).some(
				(node) => node.contains(target),
			);

			if (!isInsideTrigger && !isInsideContent && !isInsideDescendant) {
				setVisible(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [visible, props.trigger, props.children]);

	const nestingContextValue = useMemo<PopoverNestingContextValue>(
		() => ({ registerDescendant }),
		[registerDescendant],
	);

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
						className="z-100 border border-slate-300 py-2 rounded-sm bg-white text-slate-700 absolute shadow-lg"
						style={{ left: position.left, top: position.top }}
					>
						<PopoverNestingContext.Provider
							value={nestingContextValue}
						>
							{props.children}
						</PopoverNestingContext.Provider>
					</div>,
					document.body,
				)}
		</>
	);
};

export default Popover;
