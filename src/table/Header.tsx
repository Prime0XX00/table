import type { Column, TableAction, TableState } from "../types";
import HeaderResizer from "./HeaderResizer";
import { useState } from "react";
import IconButton from "./IconButton";

interface HeaderProps<RowType> {
	tableState: TableState<RowType>;
	column: Column<RowType, keyof RowType>;
	dispatch: (action: TableAction<RowType>) => void;
}

function Header<RowType>({ ...props }: HeaderProps<RowType>) {
	const [headerElement, setHeaderElement] = useState<HTMLDivElement | null>(
		null,
	);

	return (
		<div
			ref={setHeaderElement}
			className="group h-full pl-2 flex min-w-28"
			style={{
				width:
					props.tableState.columns.get(props.column.field)?.width +
					"px",
			}}
		>
			<div className="relative gap-x-2 h-full items-center w-full grid grid-cols-[auto_1fr]">
				<span className="overflow-hidden text-ellipsis">
					{props.column.title}
				</span>

				<div
					className={`flex items-center justify-between gap-x-1 mr-1 ${props.tableState.sorting.column.field != props.column.field ? "not-group-hover:w-0 not-group-hover:pointer-events-none" : ""}`}
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

					<IconButton
						onClick={() =>
							props.dispatch({
								type: "COL_TOGGLE_PIN",
								payload: { field: props.column.field },
							})
						}
						icon="ellipsis-vertical"
						className="group-hover:opacity-100 opacity-0"
					></IconButton>
				</div>
			</div>
			<HeaderResizer
				isResizable={props.column.isResizable}
				container={headerElement}
				callback={(width) =>
					props.dispatch({
						type: "COL_SET_WIDTH",
						payload: {
							field: props.column.field,
							width: width,
						},
					})
				}
			></HeaderResizer>
		</div>
	);
}

export default Header;
