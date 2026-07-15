export interface Column<RowType, ColKey extends keyof RowType = keyof RowType> {
	field: ColKey;
	title: string;
	render?: (cellValue: RowType[ColKey]) => React.ReactNode;
	initialWidth?: number;
	isSortable?: boolean;
	isResizable?: boolean;
	isVisible?: boolean;
}

export type TableRow<RowType> = RowType & {
	__rowId: number;
};

export interface SortState<RowType> {
	field: keyof RowType;
	direction: "asc" | "desc";
}

export interface TableState<RowType> {
	selectedPage: number;
	rowsPerPage: number;
	sorting: SortState<RowType>;
	columns: Map<keyof RowType, ColumnState>;
	searchQuery: string;
}

export interface ColumnState {
	width: number;
	visible: boolean;
}

export interface TableAction {
	type: string;
	payload: any;
}

export interface RowsPerPageOption {
	value: number;
}
