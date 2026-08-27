import React from "react";
import type { Column, TableRow } from "../types";

interface CellProps<RowType> {
	row: TableRow<RowType>;
	column: Column<RowType>;
}

function Cell<RowType>({ ...props }: CellProps<RowType>) {
	return (
		<div
			className={`px-2 overflow-hidden text-ellipsis min-w-min-cell-w w-full text-nowrap`}
		>
			{props.row[props.column.field] == undefined
				? ""
				: props.column.render
					? props.column.render(props.row[props.column.field])
					: String(props.row[props.column.field])}
		</div>
	);
}

export default React.memo(Cell) as unknown as typeof Cell;
