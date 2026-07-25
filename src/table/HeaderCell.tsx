import type { Column, TableAction, TableState } from "../types";
import HeaderResizer from "./HeaderResizer";
import { useCallback, useState } from "react";
import IconButton from "./IconButton";
import ColumnActionsPopover from "./popovers/ColumnActionsPopover";

interface HeaderCellProps<RowType> {
	column: Column<RowType>;
	tableState: TableState<RowType>;
	dispatch: (action: TableAction<RowType>) => void;
}

function HeaderCell<RowType>({ ...props }: HeaderCellProps<RowType>) {
	const [headerElement, setHeaderElement] = useState<HTMLDivElement | null>(
		null,
	);

	const onWidthChange = useCallback(
		(width: number) => {
			props.dispatch({
				type: "COL_SET_WIDTH",
				payload: {
					field: props.column.field,
					width: width,
				},
			});
		},
		[props.dispatch],
	);

	return (
		<div
			ref={setHeaderElement}
			className={`group h-full pl-2 flex min-w-28`}
			style={{
				width:
					props.tableState.columns.get(props.column.field)?.width +
					"px",
			}}
		>
			<div
				className={`relative gap-x-2 h-full items-center w-full grid ${props.column.isSortable || props.column.hasOptions ? "grid-cols-[auto_1fr]" : "grid-cols-[1fr]"}`}
			>
				<span className="overflow-hidden text-ellipsis">
					{props.column.title}
				</span>

				{(props.column.isSortable || props.column.hasOptions) && (
					<div
						className={`flex ${props.column.isSortable ? "justify-between" : "justify-end"} items-center gap-x-1 mr-1 ${props.column.field !== props.tableState.sorting.column.field ? "not-group-hover:w-0 not-group-hover:pointer-events-none" : ""} `}
					>
						{props.column.isSortable && (
							<IconButton
								icon={
									props.tableState.sorting.column.field ==
										props.column.field &&
									props.tableState.sorting.direction == "desc"
										? "move-down"
										: "move-up"
								}
								className={`${props.tableState.sorting.column.field != props.column.field ? "group-hover:opacity-100 opacity-0" : "opacity-100"}`}
								onClick={() =>
									props.dispatch({
										type: "SORT_TOGGLE",
										payload: { column: props.column },
									})
								}
							></IconButton>
						)}

						{props.column.hasOptions && (
							<ColumnActionsPopover
								tableState={props.tableState}
								dispatch={props.dispatch}
								column={props.column}
							></ColumnActionsPopover>
						)}
					</div>
				)}
			</div>

			<HeaderResizer
				isResizable={props.column.isResizable}
				container={headerElement}
				callback={(width) => onWidthChange(width)}
			></HeaderResizer>
		</div>
	);
}

export default HeaderCell;
