import type { Column, TableRow, TableState } from "../types";

interface CellProps<RowType> {
	row: TableRow<RowType>;
	column: Column<RowType, keyof RowType>;
	tableState: TableState<RowType>;
}

function Cell<RowType>({ ...props }: CellProps<RowType>) {
	return (
		<div
			className="px-2 overflow-hidden text-ellipsis min-w-28"
			style={{
				width:
					props.tableState.columns.get(props.column.field)?.width +
					"px",
			}}
		>
			{props.column.render
				? props.column.render(props.row[props.column.field])
				: String(props.row[props.column.field])}
		</div>
	);
}

export default Cell;
