import React from "react";
import type { Column, ColumnState, TableRow } from "../types";

interface CellProps<RowType, ColKey extends keyof RowType = keyof RowType> {
	row: TableRow<RowType>;
	column: Column<RowType>;
	columnStates: Map<ColKey, ColumnState>;
}

function Cell<RowType>({ ...props }: CellProps<RowType>) {
	return (
		<div
			className={`px-2 overflow-hidden text-ellipsis min-w-28`}
			style={{
				width: props.columnStates.get(props.column.field)?.width + "px",
			}}
		>
			{props.column.render
				? props.column.render(props.row[props.column.field])
				: String(props.row[props.column.field])}
		</div>
	);
}

export default React.memo(Cell) as unknown as typeof Cell;
