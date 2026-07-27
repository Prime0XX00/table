import React, { useState } from "react";
import type {
	Column,
	ColumnState,
	SortState,
	TableAction,
	TableRow,
} from "../types";
import Cell from "./Cell";
import EmptyRow from "./EmptyRow";
import HeaderCell from "./HeaderCell";

interface ColumnProps<RowType> {
	column: Column<RowType>;
	paginatedRows: TableRow<RowType>[];

	rowsPerPage: number;
	sorting: SortState<RowType>;
	columnState: ColumnState | undefined;

	dispatch: (action: TableAction<RowType>) => void;
}

function TableColumn<RowType>({ ...props }: ColumnProps<RowType>) {
	const [headerElement, setHeaderElement] = useState<HTMLDivElement | null>(
		null,
	);

	return (
		<div
			ref={setHeaderElement}
			className={`flex flex-col`}
		>
			{/* Header-Zelle */}
			<div className="h-12 border-b border-slate-300">
				<HeaderCell
					key={String(props.column.field)}
					container={headerElement}
					columnState={props.columnState}
					sorting={props.sorting}
					column={props.column}
					dispatch={props.dispatch}
				></HeaderCell>
			</div>

			<div>
				{/* Body Zellen */}
				{props.paginatedRows.map((row, rowIndex) => (
					<div
						key={`row-${rowIndex}-cell`}
						className={`h-8.5 border-b border-slate-300 last:border-0 flex items-center`}
					>
						<Cell
							column={props.column}
							row={row}
						></Cell>
					</div>
				))}
			</div>
			{/* 
                Leere Zeilen, damit die Tabellenhöhe immer gleich bleibt.
                Generiert diese, bis die Anzahl an Reihen pro Seite eingehalten wird.
            */}
			{props.paginatedRows.length < props.rowsPerPage &&
				Array.from({
					length: props.rowsPerPage - props.paginatedRows.length,
				}).map((_, rowIndex) => (
					<EmptyRow key={`row-empty-${rowIndex}`}></EmptyRow>
				))}

			{/* Footer Zelle */}
			<div className="h-12 flex items-center justify-between px-2 border-t border-slate-300 min-w-28 w-full"></div>
		</div>
	);
}

export default React.memo(TableColumn) as unknown as typeof TableColumn;
