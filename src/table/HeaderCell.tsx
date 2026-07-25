import type { Column, ColumnState, SortState, TableAction } from "../types";
import HeaderResizer from "./HeaderResizer";
import { useCallback, useEffect, useState } from "react";
import IconButton from "./IconButton";
import ColumnActionsPopover from "./popovers/ColumnActionsPopover";
import React from "react";

interface HeaderCellProps<RowType> {
	column: Column<RowType>;
	columnState: ColumnState | undefined;
	sorting: SortState<RowType>;
	dispatch: (action: TableAction<RowType>) => void;
}

function HeaderCell<RowType>({ ...props }: HeaderCellProps<RowType>) {
	const [headerElement, setHeaderElement] = useState<HTMLDivElement | null>(
		null,
	);

	useEffect(() => {
		if (!headerElement || !props.columnState) return;
		headerElement.style.width = props.columnState.width + "px";
	}, [props.columnState, props.column.field, headerElement]);

	const onResize = useCallback(
		(width: number) => {
			if (!headerElement) return;
			headerElement.style.width = width + "px";
		},
		[props.dispatch, headerElement, props.column.field],
	);

	const onRelease = useCallback(
		(width: number) => {
			if (!headerElement) return;
			headerElement.style.width = width + "px";

			props.dispatch({
				type: "COL_SET_WIDTH",
				payload: {
					field: props.column.field,
					width: width,
				},
			});
		},
		[props.dispatch, headerElement, props.column.field],
	);

	return (
		<div
			ref={setHeaderElement}
			className={`group h-full pl-2 flex min-w-28`}
		>
			<div
				className={`relative gap-x-2 h-full items-center w-full grid ${props.column.isSortable || props.column.hasOptions ? "grid-cols-[auto_1fr]" : "grid-cols-[1fr]"}`}
			>
				<span className="overflow-hidden text-ellipsis">
					{props.column.title}
				</span>

				{(props.column.isSortable || props.column.hasOptions) && (
					<div
						className={`flex ${props.column.isSortable ? "justify-between" : "justify-end"} items-center gap-x-1 mr-1 ${props.column.field !== props.sorting.column.field ? "not-group-hover:w-0 not-group-hover:pointer-events-none" : ""} `}
					>
						{props.column.isSortable && (
							<IconButton
								icon={
									props.sorting.column.field ==
										props.column.field &&
									props.sorting.direction == "desc"
										? "move-down"
										: "move-up"
								}
								className={`${props.sorting.column.field != props.column.field ? "group-hover:opacity-100 opacity-0" : "opacity-100"}`}
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
								sorting={props.sorting}
								columnState={props.columnState}
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
				onResize={onResize}
				onRelease={onRelease}
			></HeaderResizer>
		</div>
	);
}

export default React.memo(HeaderCell) as unknown as typeof HeaderCell;
