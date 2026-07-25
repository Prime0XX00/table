import type { TableAction, TableRow, TableState } from "../types";
import EmptyRow from "./EmptyRow";

interface EmptyColumnProps<RowType> {
	paginatedRows: TableRow<RowType>[];
	tableState: TableState<RowType>;
	dispatch: (action: TableAction<RowType>) => void;

	hoveredRowIndex: number | undefined;
	setHoveredRowIndex: (value: number | undefined) => void;
}

function EmptyTableColumn<RowType>({ ...props }: EmptyColumnProps<RowType>) {
	return (
		<div className={`flex flex-col w-full`}>
			{/* Header-Zelle */}
			<div className="h-12 border-b border-slate-300"></div>

			<div onMouseLeave={() => props.setHoveredRowIndex(undefined)}>
				{/* Body Zellen */}
				{props.paginatedRows.map((_, rowIndex) => (
					<div
						key={`row-${rowIndex}-cell`}
						className={`${props.hoveredRowIndex == rowIndex ? "bg-slate-100" : ""} h-8.5 border-b border-slate-300 last:border-0 flex items-center`}
						onMouseEnter={() => props.setHoveredRowIndex(rowIndex)}
					></div>
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
			<div className="h-12 flex items-center justify-between border-t border-slate-300"></div>
		</div>
	);
}

export default EmptyTableColumn;
