type TypeMap<T> = T extends number
	? "number"
	: T extends boolean
		? "boolean"
		: T extends Date
			? "date"
			: "string";

export type CreateColumnUnion<RowType> = {
	[P in keyof RowType]: Column<RowType, P> & {
		dataType: TypeMap<RowType[P]>;
	};
}[keyof RowType];

export interface Column<RowType, ColKey extends keyof RowType = keyof RowType> {
	field: ColKey;
	dataType: "string" | "number" | "boolean" | "date";
	title: string;
	render?: (cellValue: RowType[ColKey]) => React.ReactNode;
	initialWidth?: number;
	isSortable?: boolean;
	isResizable?: boolean;
	isVisible?: boolean;
	isPinned?: boolean;
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
	filters: FilterState<RowType>;
}

export interface FilterState<RowType> {
	filters: Filter<RowType>[];
	connection: "or" | "and";
}

export interface Filter<RowType> {
	column: Column<RowType>;
	operator: FilterOperator;
	value: string | number;
}

export type FilterOperator =
	| "="
	| "!="
	| "<"
	| ">"
	| "<="
	| ">="
	| "Gleich"
	| "Ungleich"
	| "Enthält"
	| "Enthält nicht";

export const FILTER_OPERATORS = {
	number: {
		E: "=",
		NE: "!=",
		LT: "<",
		LTE: "<=",
		GT: ">",
		GTE: ">=",
	},
	boolean: {
		E: "Gleich",
	},
	string: {
		E: "Gleich",
		NE: "Ungleich",
		C: "Enthält",
		NC: "Enthält nicht",
	},
	date: {},
};

export interface ColumnState {
	width: number;
	visible: boolean;
	pinned: boolean;
}

export type TableAction<RowType> =
	| { type: "STATE_SET"; payload: { state: TableState<RowType> } }
	| { type: "SORT_TOGGLE"; payload: { column: Column<RowType> } }
	| { type: "PAGE_SET_FIRST" }
	| { type: "PAGE_SET_PREV" }
	| { type: "PAGE_SET_NEXT"; payload: { pageAmount: number } }
	| { type: "PAGE_SET_LAST"; payload: { pageAmount: number } }
	| { type: "ROWS_PER_PAGE_SET"; payload: { rowsPerPage: number } }
	| {
			type: "COL_SET_WIDTH";
			payload: { field: keyof RowType; width: number };
	  }
	| { type: "COL_TOGGLE_VISIBILITY"; payload: { field: keyof RowType } }
	| { type: "SEARCH_QUERY_SET"; payload: { searchQuery: string } }
	| {
			type: "FILTER_CHANGE";
			payload: { filter: Filter<RowType>; index: number };
	  }
	| { type: "FILTER_CONNECTION_TOGGLE" }
	| { type: "FILTER_DELETE"; payload: { index: number } }
	| { type: "FILTER_ADD" }
	| { type: "FILTERS_RESET" };

export interface RowsPerPageOption {
	value: number;
}
