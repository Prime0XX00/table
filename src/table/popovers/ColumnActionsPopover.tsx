import { MoveDownIcon, MoveUpIcon, PinIcon, PinOffIcon } from "lucide-react";
import type { Column, ColumnState, SortState, TableAction } from "../../types";
import IconButton from "../IconButton";
import Popover from "../Popover";

interface ColumnActionsPopoverProps<RowType> {
	column: Column<RowType>;
	columnState: ColumnState | undefined;
	sorting: SortState<RowType>;
	dispatch: (action: TableAction<RowType>) => void;
}

function ColumnActionsPopover<RowType>({
	...props
}: ColumnActionsPopoverProps<RowType>) {
	return (
		<Popover
			key={`${String(props.column.field)}`}
			trigger={
				<IconButton
					icon="ellipsis-vertical"
					className="group-hover:opacity-100 opacity-0"
				></IconButton>
			}
		>
			<div className="flex flex-col min-w-20">
				<div
					onClick={() =>
						props.dispatch({
							type: "COL_TOGGLE_PIN",
							payload: {
								field: props.column.field,
							},
						})
					}
					className="h-8.5 flex gap-x-2 px-2 items-center justify-between hover:bg-slate-100 cursor-pointer"
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

				<div
					onClick={() =>
						props.dispatch({
							type: "SORT_TOGGLE",
							payload: {
								column: props.column,
							},
						})
					}
					className="h-8.5 flex gap-x-2 px-2 items-center justify-between hover:bg-slate-100 cursor-pointer"
				>
					{props.sorting.column.field == props.column.field &&
					props.sorting.direction == "asc" ? (
						<>
							<MoveDownIcon size={18}></MoveDownIcon>
							<span>Absteigend sortieren</span>
						</>
					) : (
						<>
							<MoveUpIcon size={18}></MoveUpIcon>
							<span>Aufsteigend sortieren</span>
						</>
					)}
				</div>
			</div>
		</Popover>
	);
}

export default ColumnActionsPopover;
