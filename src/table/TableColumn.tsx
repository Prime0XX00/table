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
			className={`flex flex-col h-fit`}
		>
			{/* Header-Zelle */}
			<div className="h-table-header border-b border-border">
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
						className={`${props.paginatedRows.length == props.rowsPerPage ? "last:border-0" : ""} h-table-row border-b border-border flex items-center`}
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
		</div>
	);
}

export default React.memo(TableColumn) as unknown as typeof TableColumn;
