import React from "react";
import EmptyRow from "./EmptyRow";

interface EmptyColumnProps {
	paginatedRowsAmount: number;
	rowsPerPage: number;
}

function EmptyTableColumn({ ...props }: EmptyColumnProps) {
	return (
		<div className={`flex flex-col w-full`}>
			{/* Header-Zelle */}
			<div className="h-12 border-b border-border"></div>

			<div>
				{/* Body Zellen */}
				{Array.from({ length: props.paginatedRowsAmount }).map(
					(_, rowIndex) => (
						<div
							key={`row-${rowIndex}-cell`}
							className={`h-8.5 border-b border-border last:border-0 flex items-center`}
						></div>
					),
				)}
			</div>
			{/* 
                Leere Zeilen, damit die Tabellenhöhe immer gleich bleibt.
                Generiert diese, bis die Anzahl an Reihen pro Seite eingehalten wird.
            */}
			{props.paginatedRowsAmount < props.rowsPerPage &&
				Array.from({
					length: props.rowsPerPage - props.paginatedRowsAmount,
				}).map((_, rowIndex) => (
					<EmptyRow key={`row-empty-${rowIndex}`}></EmptyRow>
				))}

			{/* Footer Zelle */}
			<div className="h-12 flex items-center justify-between border-t border-border"></div>
		</div>
	);
}

export default React.memo(EmptyTableColumn);
