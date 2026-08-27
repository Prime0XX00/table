import {
	MinusIcon,
	MoveDownIcon,
	MoveUpIcon,
	PinIcon,
	PinOffIcon,
} from "lucide-react";
import type { Column, ColumnState, SortState, TableAction } from "../../types";
import IconButton from "../IconButton";
import Popover, { usePopoverClose } from "../Popover";
import Tooltip from "../Tooltip";

interface ColumnActionsPopoverProps<RowType> {
	column: Column<RowType>;
	columnState: ColumnState | undefined;
	sorting: SortState<RowType>;
	dispatch: (action: TableAction<RowType>) => void;
}

function PopoverContent<RowType>({
	...props
}: ColumnActionsPopoverProps<RowType>) {
	const closePopover = usePopoverClose();

	const handleTogglePin = () => {
		props.dispatch({
			type: "COL_TOGGLE_PIN",
			payload: {
				field: props.column.field,
			},
		});
		closePopover?.();
	};

	const handleSortDesc = () => {
		props.dispatch({
			type: "SORT_DESC",
			payload: {
				column: props.column,
			},
		});
	};

	const handleSortAsc = () => {
		props.dispatch({
			type: "SORT_ASC",
			payload: {
				column: props.column,
			},
		});
	};

	const handleSortRemove = () => {
		props.dispatch({
			type: "SORT_REMOVE",
			payload: {
				column: props.column,
			},
		});
	};

	return (
		<div className="flex flex-col min-w-20">
			<div
				onClick={handleTogglePin}
				className="h-8.5 flex gap-x-2 px-2 items-center justify-between hover:bg-main-hover cursor-pointer"
			>
				{props.columnState?.pinned ? (
					<>
						<PinOffIcon size={18}></PinOffIcon>
						<span>Spalte lösen</span>
					</>
				) : (
					<>
						<PinIcon size={18}></PinIcon>
						<span>Spalte fixieren</span>
					</>
				)}
			</div>

			<div className="border-t border-border w-full my-2"></div>

			{((props.sorting.column?.field == props.column.field &&
				props.sorting.direction == "desc") ||
				props.sorting.column?.field != props.column.field) && (
				<div
					onClick={handleSortAsc}
					className="h-8.5 flex gap-x-2 px-2 items-center justify-between hover:bg-main-hover cursor-pointer"
				>
					<MoveUpIcon size={18}></MoveUpIcon>
					<span>Aufsteigend sortieren</span>
				</div>
			)}

			{((props.sorting.column?.field == props.column.field &&
				props.sorting.direction == "asc") ||
				props.sorting.column?.field != props.column.field) && (
				<div
					onClick={handleSortDesc}
					className="h-8.5 flex gap-x-2 px-2 items-center justify-between hover:bg-main-hover cursor-pointer"
				>
					<MoveDownIcon size={18}></MoveDownIcon>
					<span>Absteigend sortieren</span>
				</div>
			)}

			{props.sorting.column?.field == props.column.field && (
				<div
					onClick={handleSortRemove}
					className="h-8.5 flex gap-x-2 px-2 items-center justify-between hover:bg-main-hover cursor-pointer"
				>
					<MinusIcon size={18}></MinusIcon>
					<span>Sortierung entfernen</span>
				</div>
			)}
		</div>
	);
}

function ColumnActionsPopover<RowType>({
	...props
}: ColumnActionsPopoverProps<RowType>) {
	return (
		<Tooltip
			trigger={
				<Popover
					key={`${String(props.column.field)}`}
					trigger={
						<IconButton
							icon="ellipsis-vertical"
							className={`${props.sorting.column?.field != props.column.field ? "group-hover:opacity-100 opacity-0" : "opacity-100"}`}
						></IconButton>
					}
				>
					<PopoverContent {...props}></PopoverContent>
				</Popover>
			}
		>
			Optionen
		</Tooltip>
	);
}

export default ColumnActionsPopover;
