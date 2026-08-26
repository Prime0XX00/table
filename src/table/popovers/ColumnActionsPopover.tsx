import {
	MinusIcon,
	MoveDownIcon,
	MoveUpIcon,
	PinIcon,
	PinOffIcon,
} from "lucide-react";
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
					className={`${props.sorting.column?.field != props.column.field ? "group-hover:opacity-100 opacity-0" : "opacity-100"}`}
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

				{props.sorting.column?.field == props.column.field ? (
					<>
						{props.sorting.direction == "asc" ? (
							<div
								onClick={() =>
									props.dispatch({
										type: "SORT_DESC",
										payload: {
											column: props.column,
										},
									})
								}
								className="h-8.5 flex gap-x-2 px-2 items-center justify-between hover:bg-main-hover cursor-pointer"
							>
								<MoveDownIcon size={18}></MoveDownIcon>
								<span>Absteigend sortieren</span>
							</div>
						) : (
							<div
								onClick={() =>
									props.dispatch({
										type: "SORT_ASC",
										payload: {
											column: props.column,
										},
									})
								}
								className="h-8.5 flex gap-x-2 px-2 items-center justify-between hover:bg-main-hover cursor-pointer"
							>
								<MoveUpIcon size={18}></MoveUpIcon>
								<span>Aufsteigend sortieren</span>
							</div>
						)}
						<div
							onClick={() =>
								props.dispatch({
									type: "SORT_REMOVE",
									payload: {
										column: props.column,
									},
								})
							}
							className="h-8.5 flex gap-x-2 px-2 items-center justify-between hover:bg-main-hover cursor-pointer"
						>
							<MinusIcon size={18}></MinusIcon>
							<span>Sortierung entfernen</span>
						</div>
					</>
				) : (
					<>
						<div
							onClick={() =>
								props.dispatch({
									type: "SORT_ASC",
									payload: {
										column: props.column,
									},
								})
							}
							className="h-8.5 flex gap-x-2 px-2 items-center justify-between hover:main-hover cursor-pointer"
						>
							<MoveUpIcon size={18}></MoveUpIcon>
							<span>Aufsteigend sortieren</span>
						</div>
						<div
							onClick={() =>
								props.dispatch({
									type: "SORT_DESC",
									payload: {
										column: props.column,
									},
								})
							}
							className="h-8.5 flex gap-x-2 px-2 items-center justify-between hover:main-hover cursor-pointer"
						>
							<MoveDownIcon size={18}></MoveDownIcon>
							<span>Absteigend sortieren</span>
						</div>
					</>
				)}
			</div>
		</Popover>
	);
}

export default ColumnActionsPopover;
