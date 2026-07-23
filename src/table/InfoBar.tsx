import type { TableRow, TableState } from "../types";

interface InfoBarProps<RowType> {
	filteredRows: TableRow<RowType>[];
	tableState: TableState<RowType>;
}

function InfoBar<RowType>({ ...props }: InfoBarProps<RowType>) {
	return (
		<p>
			{props.filteredRows.length == 0 ? (
				<>
					<span>{0 + " / " + 0}</span>
				</>
			) : (
				<>
					<span>
						{props.tableState.rowsPerPage *
							props.tableState.selectedPage +
							1}
					</span>
					<span>{" - "}</span>
					<span>
						{Math.min(
							props.tableState.rowsPerPage *
								(props.tableState.selectedPage + 1),
							props.filteredRows.length,
						)}
					</span>
					<span>{" / "}</span>
					<span>{props.filteredRows.length}</span>
				</>
			)}
		</p>
	);
}

export default InfoBar;
