import type { Column, TableAction, TableRow, TableState } from "../types";
import Cell from "./Cell";
import EmptyRow from "./EmptyRow";
import HeaderCell from "./HeaderCell";

interface ColumnProps<RowType> {
	column: Column<RowType>;
	paginatedRows: TableRow<RowType>[];
	tableState: TableState<RowType>;
	dispatch: (action: TableAction<RowType>) => void;

	hoveredRowIndex: number | undefined;
	setHoveredRowIndex: (value: number | undefined) => void;
}

function TableColumn<RowType>({ ...props }: ColumnProps<RowType>) {
	return (
		<div className="flex flex-col w-fit">
			{/* Header-Zelle */}
			<div className="h-12 border-b border-slate-300">
				<HeaderCell
					tableState={props.tableState}
					column={props.column}
					dispatch={props.dispatch}
				></HeaderCell>
			</div>

			<div onMouseLeave={() => props.setHoveredRowIndex(undefined)}>
				{/* Body Zellen */}
				{props.paginatedRows.map((row, rowIndex) => (
					<div
						key={`row-${rowIndex}-cell`}
						className={`${props.hoveredRowIndex == rowIndex ? "bg-slate-100" : ""} h-8.5 border-b border-slate-300 last:border-0 flex items-center`}
						onMouseEnter={() => props.setHoveredRowIndex(rowIndex)}
					>
						<Cell
							column={props.column}
							row={row}
							tableState={props.tableState}
						></Cell>
					</div>
				))}
			</div>
			{/* 
                Leere Zeilen, damit die Tabellenhöhe immer gleich bleibt.
                Generiert diese, bis die Anzahl an Reihen pro Seite eingehalten wird.
            */}
			{props.paginatedRows.length < props.tableState.rowsPerPage &&
				Array.from({
					length:
						props.tableState.rowsPerPage -
						props.paginatedRows.length,
				}).map((_, rowIndex) => (
					<EmptyRow key={`row-empty-${rowIndex}`}></EmptyRow>
				))}

			{/* Footer Zelle */}
			<div
				className="h-12 flex items-center justify-between px-2 border-t border-slate-300 min-w-28"
				style={{
					width:
						props.tableState.columns.get(props.column.field)
							?.width + "px",
				}}
			></div>
		</div>
	);
}

export default TableColumn;
