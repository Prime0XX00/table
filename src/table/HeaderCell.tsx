import {
	type Column,
	type ColumnState,
	type SortState,
	type TableAction,
} from "../types";
import HeaderResizer from "./HeaderResizer";
import { useCallback, useEffect } from "react";
import IconButton from "./IconButton";
import ColumnActionsPopover from "./popovers/ColumnActionsPopover";
import React from "react";
import { minColWidth } from "../consts";
import Tooltip from "./Tooltip";

interface HeaderCellProps<RowType> {
	column: Column<RowType>;
	columnState: ColumnState | undefined;
	sorting: SortState<RowType>;
	dispatch: (action: TableAction<RowType>) => void;
	container: HTMLDivElement | null;
}

function HeaderCell<RowType>({ ...props }: HeaderCellProps<RowType>) {
	useEffect(() => {
		if (!props.container || !props.columnState) return;
		props.container.style.minWidth =
			Math.max(props.columnState.width, minColWidth) + "px";
		props.container.style.maxWidth =
			Math.max(props.columnState.width, minColWidth) + "px";
	}, [props.container]);

	const onResize = useCallback(
		(width: number) => {
			if (!props.container) return;
			props.container.style.minWidth =
				Math.max(width, minColWidth) + "px";
			props.container.style.maxWidth =
				Math.max(width, minColWidth) + "px";
		},
		[props.dispatch, props.container, props.column.field],
	);

	const onRelease = useCallback(
		(width: number) => {
			if (!props.container) return;
			props.container.style.minWidth =
				Math.max(width, minColWidth) + "px";
			props.container.style.maxWidth =
				Math.max(width, minColWidth) + "px";

			props.dispatch({
				type: "COL_SET_WIDTH",
				payload: {
					field: props.column.field,
					width: width,
				},
			});
		},
		[props.dispatch, props.container, props.column.field],
	);

	return (
		<div className={`group h-full pl-2 flex`}>
			<div
				className={`relative gap-x-2 h-full items-center w-full grid ${props.column.isSortable || props.column.hasOptions ? "grid-cols-[auto_1fr]" : "grid-cols-[1fr]"}`}
			>
				<span className="overflow-hidden text-ellipsis text-nowrap">
					{props.column.title}
				</span>

				{(props.column.isSortable || props.column.hasOptions) && (
					<div
						className={`flex justify-end items-center gap-x-1 mr-1 ${props.column.field !== props.sorting?.field ? "not-group-hover:w-0 not-group-hover:pointer-events-none" : ""} `}
					>
						{props.column.isSortable && (
							<Tooltip
								trigger={
									<IconButton
										icon={
											props.sorting?.field ==
												props.column.field &&
											props.sorting.direction == "desc"
												? "move-down"
												: "move-up"
										}
										className={`${props.sorting?.field != props.column.field ? "group-hover:opacity-100 opacity-0" : "opacity-100"}`}
										onClick={() =>
											props.dispatch({
												type: "SORT_TOGGLE",
												payload: {
													column: props.column,
												},
											})
										}
									></IconButton>
								}
							>
								Sortierung ändern
							</Tooltip>
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
				container={props.container}
				onResize={onResize}
				onRelease={onRelease}
			></HeaderResizer>
		</div>
	);
}

export default React.memo(HeaderCell) as unknown as typeof HeaderCell;
