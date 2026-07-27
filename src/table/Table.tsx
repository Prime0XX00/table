import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import {
	FILTER_OPERATORS,
	type ColumnState,
	type Filter,
	type FilterOperator,
	type TableAction,
	type TableRow,
	type TableState,
	type Column,
} from "../types";
import TableSearchField from "./TableSearchField";
import IconButton from "./IconButton";
import Select, { type SelectOption } from "./Select";
import Pagination from "./Pagination";
import InfoBar from "./InfoBar";
import FilterPopover from "./popovers/FilterPopover";
import ColumnsSettingsPopover from "./popovers/ColumnsSettingsPopover";
import DividerX from "./DividerX";
import TableColumn from "./TableColumn";
import ExportPopover from "./popovers/ExportPopover";
import EmptyTableColumn from "./EmptyTableColumn";

interface TableProps<RowType extends Object> {
	title: string;
	rows: Array<RowType> | undefined;
	columns: Column<RowType>[];
	rowsPerPageOptions?: SelectOption[];
}

function Table<RowType extends Object>({ ...props }: TableProps<RowType>) {
	const rowsPerPageOptions = useMemo(
		() =>
			props.rowsPerPageOptions ?? [
				{ value: 10, display: "10" },
				{ value: 20, display: "20" },
				{ value: 50, display: "50" },
			],
		[props.rowsPerPageOptions],
	);
	const columns = useMemo(() => {
		return [
			...props.columns.map((column) => {
				const col: Column<RowType> = {
					hasOptions: column.hasOptions ?? true,
					isVisible: column.isVisible ?? true,
					isPinned: column.isPinned ?? false,
					isSortable: column.isSortable ?? true,
					initialWidth: column.initialWidth ?? 160,
					...column,
				};
				return col;
			}),
		];
	}, [props.columns]);

	// Startwerte für Cols
	const initalColumnStates = new Map<keyof RowType, ColumnState>();

	columns.forEach((column) => {
		initalColumnStates.set(column.field, {
			width: column.initialWidth ?? 160,
			visible: column.isVisible ?? true,
			pinned: column.isPinned ?? false,
		});
	});

	// Startwerte für die Tabelle
	const initialState: TableState<RowType> = {
		selectedPage: 0,
		rowsPerPage: Number(rowsPerPageOptions[0].value),
		sorting: {
			column: undefined,
			direction: undefined,
		},
		columns: initalColumnStates,
		searchQuery: "",
		filters: {
			filters: [
				{
					column: columns[0],
					operator: Object.values(
						FILTER_OPERATORS[columns[0].dataType],
					)[0] as FilterOperator,
					value: "",
				},
			],
			connection: "and",
		},
	};
	const [state, dispatch] = useReducer(tableReducer, initialState);

	function tableReducer(
		state: TableState<RowType>,
		action: TableAction<RowType>,
	): TableState<RowType> {
		switch (action.type) {
			// Funktion zum Setzen des gesamten Tabellenstatus.
			// Verwenden, um den Initialen State und optional noch Presets zu laden.
			case "STATE_RESET":
				return initialState;

			// Sortierfunktionalität
			// Entweder wird die momentane Suche getoggelt oder eine neue Spalte zur Suche ausgewählt
			case "SORT_TOGGLE": {
				const column = action.payload.column;

				// Checken, ob die Spalte überhaupt sortiert werden kann.
				if (!column.isSortable) return state;

				// Wenn neues Feld ausgewählt wird
				// Da nur ein Richtungs-State für die gesamte Tabelle existiert, wird sobald die Spalte gewechselt wird
				// der State zurück auf ASC gesetzt
				if (state.sorting.column?.field != column.field) {
					return {
						...state,
						sorting: {
							...state.sorting,
							column: column,
							direction: "asc",
						},
					};
				}
				// Wenn altes Feld erneut ausgewählt wird
				// Einfaches Umschalten der Richtung
				else {
					if (state.sorting.direction == "asc")
						return {
							...state,
							sorting: {
								...state.sorting,
								column: column,
								direction: "desc",
							},
						};
					else
						return {
							...state,
							sorting: {
								...state.sorting,
								column: column,
								direction: "asc",
							},
						};
				}
			}

			case "SORT_ASC": {
				const column = action.payload.column;

				// Checken, ob die Spalte überhaupt sortiert werden kann.
				if (!column.isSortable) return state;

				return {
					...state,
					sorting: {
						...state.sorting,
						column: column,
						direction: "asc",
					},
				};
			}

			case "SORT_DESC": {
				const column = action.payload.column;

				// Checken, ob die Spalte überhaupt sortiert werden kann.
				if (!column.isSortable) return state;

				return {
					...state,
					sorting: {
						...state.sorting,
						column: column,
						direction: "desc",
					},
				};
			}

			case "SORT_REMOVE": {
				const column = action.payload.column;

				// Checken, ob die Spalte überhaupt sortiert werden kann.
				if (!column.isSortable) return state;

				return {
					...state,
					sorting: {
						...state.sorting,
						column: undefined,
						direction: undefined,
					},
				};
			}

			// Erste Seite auswählen
			case "PAGE_SET_FIRST":
				return { ...state, selectedPage: 0 };

			// Vorherige Seite auswählen
			case "PAGE_SET_PREV":
				return {
					...state,
					selectedPage: Math.max(state.selectedPage - 1, 0),
				};

			// Nächste Seite auswählen
			case "PAGE_SET_NEXT":
				return {
					...state,
					selectedPage: Math.min(
						state.selectedPage + 1,
						action.payload.pageAmount - 1,
					),
				};

			// Letzte Seite auswählen
			case "PAGE_SET_LAST":
				return {
					...state,
					selectedPage: action.payload.pageAmount - 1,
				};

			// Reihen pro Tabellenseite steuern
			case "ROWS_PER_PAGE_SET":
				return { ...state, rowsPerPage: action.payload.rowsPerPage };

			// Breite einer Spalte regulieren
			case "COL_SET_WIDTH": {
				const colState = state.columns.get(action.payload.field);
				if (!colState) return state;

				return {
					...state,
					columns: new Map(
						state.columns.set(action.payload.field, {
							...colState,
							width: action.payload.width,
						}),
					),
				};
			}

			// Toggeln der Sichtbarkeit einer Spalte
			case "COL_TOGGLE_VISIBILITY": {
				const colState = state.columns.get(action.payload.field);
				if (!colState) return state;

				return {
					...state,
					columns: new Map(
						state.columns.set(action.payload.field, {
							...colState,
							visible: !colState.visible,
						}),
					),
				};
			}

			case "COL_TOGGLE_PIN": {
				const colState = state.columns.get(action.payload.field);
				if (!colState) return state;

				return {
					...state,
					columns: new Map(
						state.columns.set(action.payload.field, {
							...colState,
							pinned: !colState.pinned,
						}),
					),
				};
			}

			// Suchkeywort verwalten
			case "SEARCH_QUERY_SET":
				return {
					...state,
					searchQuery: action.payload.searchQuery,
				};

			// Die Änderung an einem Filter händeln
			// Hier kann die betroffene Spalte, der Filteroperand und der Wert angepasst werden
			case "FILTER_CHANGE":
				// Guckt ob der übergebene Operator zum Datentyp passt
				// Falls nicht, wird der erste mögliche Operator des Typs geholt
				const newOperator = Object.values(
					FILTER_OPERATORS[action.payload.filter.column.dataType],
				).includes(action.payload.filter.operator)
					? action.payload.filter.operator
					: (Object.values(
							FILTER_OPERATORS[
								action.payload.filter.column.dataType
							],
						)[0] as FilterOperator);

				const newFilter: Filter<RowType> = {
					column: action.payload.filter.column,
					operator: newOperator,
					value: action.payload.filter.value,
				};

				const updatedFilters = state.filters.filters.map(
					(filter, index) => {
						if (action.payload.index == index) {
							return newFilter;
						} else return filter;
					},
				);

				return {
					...state,
					filters: {
						...state.filters,
						filters: updatedFilters,
					},
				};

			// Toggle zwischen UND und ODER zur Verkettung von Filtern
			case "FILTER_CONNECTION_TOGGLE":
				return {
					...state,
					filters: {
						...state.filters,
						connection:
							state.filters.connection == "and" ? "or" : "and",
					},
				};

			// Löschen eines anhand des Array-Indezes gewählten Filters
			case "FILTER_DELETE":
				if (state.filters.filters.length == 1)
					return {
						...state,
						filters: {
							...state.filters,
							filters: [
								{
									column: columns[0],
									operator: Object.values(
										FILTER_OPERATORS[columns[0].dataType],
									)[0] as FilterOperator,
									value: "",
								},
							],
						},
					};

				const newFilters = [...state.filters.filters].filter(
					(_, index) => {
						return index != action.payload.index;
					},
				);

				return {
					...state,
					filters: {
						...state.filters,
						filters: newFilters,
					},
				};

			// Hinzufügen eines neuen Filters
			case "FILTER_ADD":
				return {
					...state,
					filters: {
						...state.filters,
						filters: [
							...state.filters.filters,
							{
								column: columns[0],
								operator: Object.values(
									FILTER_OPERATORS[columns[0].dataType],
								)[0] as FilterOperator,
								value: "",
							},
						],
					},
				};

			// Alle Filter löschen und den ersten zurücksetzen
			case "FILTERS_RESET":
				return {
					...state,
					filters: {
						...state.filters,
						filters: [
							{
								column: columns[0],
								operator: Object.values(
									FILTER_OPERATORS[columns[0].dataType],
								)[0] as FilterOperator,
								value: "",
							},
						],
					},
				};
		}
	}

	const visibleCols = useMemo(
		() =>
			[...columns].filter(
				(col) =>
					state.columns.get(col.field)?.visible &&
					!state.columns.get(col.field)?.pinned,
			),
		[columns, state.columns],
	);

	const pinnedCols = useMemo(
		() =>
			[...columns].filter(
				(col) =>
					state.columns.get(col.field)?.pinned &&
					state.columns.get(col.field)?.visible,
			),

		[columns, state.columns],
	);

	const rows: TableRow<RowType>[] = useMemo(() => {
		return [...(props.rows ?? [])].map((row, index) => ({
			...row,
			__rowId: index,
		}));
	}, [props.rows]);

	// Filtern der Zeilen anhand der SearchQuery
	const filteredRows = useMemo(() => {
		// Suchen
		const upperCaseSearchQuery = state.searchQuery.toUpperCase();
		const newRows = [...(rows ?? [])].filter((row) => {
			const keys = Object.keys(row) as [keyof RowType];

			return keys.some((key) => {
				if (!state.columns.get(key)?.visible) return false;

				const cellValue = row[key];
				return String(cellValue)
					.toUpperCase()
					.includes(upperCaseSearchQuery);
			});
		});

		// Filterung
		const filters = state.filters.filters.filter((filter) => {
			return filter.value !== "";
		});
		if (filters.length == 0) return newRows;

		const filteredNewRows = newRows.filter((row) => {
			switch (state.filters.connection) {
				case "and":
					return filters.every((filter) => {
						return dynamicFilter(row, filter);
					});
				case "or":
					return filters.some((filter) => {
						return dynamicFilter(row, filter);
					});
			}
		});

		return filteredNewRows;
	}, [rows, state.searchQuery, state.columns, state.filters]);

	function dynamicFilter(
		row: TableRow<RowType>,
		filter: Filter<RowType>,
	): boolean {
		if (filter.column.field === "SELECT") return true;

		const cellValue = row[filter.column.field];

		switch (filter.column.dataType) {
			case "string":
				const stringCellValue = String(cellValue).toUpperCase();
				const stringFilterValue = String(filter.value).toUpperCase();
				switch (filter.operator) {
					case FILTER_OPERATORS[filter.column.dataType].E:
						return stringCellValue == stringFilterValue;
					case FILTER_OPERATORS[filter.column.dataType].NE:
						return stringCellValue != stringFilterValue;
					case FILTER_OPERATORS[filter.column.dataType].C:
						return stringCellValue.includes(stringFilterValue);
					case FILTER_OPERATORS[filter.column.dataType].NC:
						return !stringCellValue.includes(stringFilterValue);
					default:
						return true;
				}
			case "number":
				switch (filter.operator) {
					case FILTER_OPERATORS[filter.column.dataType].E:
						return cellValue == filter.value;
					case FILTER_OPERATORS[filter.column.dataType].LT:
						return cellValue < filter.value;
					case FILTER_OPERATORS[filter.column.dataType].LTE:
						return cellValue <= filter.value;
					case FILTER_OPERATORS[filter.column.dataType].GT:
						return cellValue > filter.value;
					case FILTER_OPERATORS[filter.column.dataType].GTE:
						return cellValue >= filter.value;
					case FILTER_OPERATORS[filter.column.dataType].NE:
						return cellValue != filter.value;
					default:
						return true;
				}
			case "boolean":
				switch (filter.operator) {
					case FILTER_OPERATORS[filter.column.dataType].E:
						return filter.value === ""
							? true
							: cellValue == filter.value;
					default:
						return true;
				}
			case "date":
				return true;
		}
	}

	// Berechnung der Seitenanzahl
	const pageAmount = useMemo(() => {
		if (filteredRows == undefined) return 0;
		else {
			return Math.ceil(filteredRows.length / state.rowsPerPage);
		}
	}, [filteredRows, state.rowsPerPage]);

	// Sortierung anhand der ausgewählten Spalte und Richtung
	const sortedRows = useMemo(() => {
		if (
			state.sorting.column == undefined ||
			state.sorting.direction == undefined
		)
			return [...filteredRows];

		if (state.sorting.column.field === "SELECT") return [...filteredRows];

		if (!state.columns.get(state.sorting.column.field)?.visible)
			return [...filteredRows];

		const col = state.sorting.column as Column<RowType, keyof RowType>;

		switch (state.sorting.column.dataType) {
			case "number": {
				const newRows = [...(filteredRows ?? [])].sort((rowA, rowB) => {
					const valueA = Number(rowA[col.field]);
					const valueB = Number(rowB[col.field]);

					return state.sorting.direction == "asc"
						? valueA - valueB
						: valueB - valueA;
				});
				return newRows;
			}
			case "string": {
				const newRows = [...(filteredRows ?? [])].sort((rowA, rowB) => {
					const valueA = String(rowA[col.field]);
					const valueB = String(rowB[col.field]);

					return state.sorting.direction == "asc"
						? valueA.localeCompare(valueB)
						: valueB.localeCompare(valueA);
				});
				return newRows;
			}
			case "boolean":
				const newRows = [...(filteredRows ?? [])].sort((rowA, rowB) => {
					const valueA = Number(rowA[col.field]);
					const valueB = Number(rowB[col.field]);

					return state.sorting.direction == "asc"
						? valueA - valueB
						: valueB - valueA;
				});
				return newRows;

			default:
				return [...filteredRows];
		}
	}, [state.sorting.column, state.sorting.direction, filteredRows]);

	// Zuschneidung der angezeigten Reihen anhad der momentanen Seite
	const paginatedRows = useMemo(() => {
		const newRows = [...(sortedRows ?? [])]?.slice(
			state.selectedPage * state.rowsPerPage,
			(state.selectedPage + 1) * state.rowsPerPage,
		);
		return newRows;
	}, [sortedRows, state.selectedPage, state.rowsPerPage]);

	// Wenn die gefilterten Reihen sich ändern, dann wird die erste Seite ausgewählt
	// Das hat den Sinn, dass der User nach der Filterung auf einer Seite sein kann, die nicht mehr existiert
	// Das selbe gilt für die angezeigten Reihen pro Seite
	useEffect(() => {
		dispatch({
			type: "PAGE_SET_FIRST",
		});
	}, [filteredRows, state.rowsPerPage]);

	// Auswählen der Zeilen
	/* function toggleRow(row: TableRow<RowType>) {
		if (selectedRowIds.has(row.__rowId))
			setSelectedRowIds((prev) => {
				prev.delete(row.__rowId);
				return new Set<number>(prev);
			});
		else
			setSelectedRowIds((prev) => new Set<number>(prev.add(row.__rowId)));
	} */

	// Es werden alle Reihen ausgewählt, nach denen momentan gefiltert wird
	/* function toggleAllRows() {
		if (
			selectedRowIds.size >= 0 &&
			selectedRowIds.size < filteredRows.length
		) {
			const newSet = new Set<number>();
			filteredRows.forEach((row) => newSet.add(row.__rowId));
			setSelectedRowIds(new Set<number>(newSet));
		} else {
			setSelectedRowIds(new Set<number>());
		}
	} */

	/* const checked = useMemo(() => {
		if (selectedRowIds.size == 0) return false;
		else if (selectedRowIds.size == filteredRows.length) return true;
		else return undefined;
	}, [selectedRowIds, rows, state.searchQuery, state.filters]); */

	const [tableBodyIsScrolled, setTableBodyIsScrolled] = useState(false);

	const onTableBodyScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
		setTableBodyIsScrolled(e.currentTarget.scrollLeft != 0);
	};

	const resetState = useCallback(
		() =>
			dispatch({
				type: "STATE_RESET",
			}),
		[dispatch],
	);

	const changeRowsPerPage = useCallback(
		(value: string | number) =>
			dispatch({
				type: "ROWS_PER_PAGE_SET",
				payload: { rowsPerPage: value as number },
			}),
		[dispatch],
	);

	return (
		<div className="min-w-200 max-w-200 text-slate-700">
			<div className="border border-slate-300 rounded-sm bg-white overflow-hidden">
				{/* Grid Header */}
				<div className="flex items-center justify-between h-12 min-w-fit w-full border-b border-slate-300 px-2">
					<p className="font-semibold">{props.title}</p>

					{/* Grid Optionen */}
					<div className="flex gap-x-2 items-center h-full">
						<FilterPopover
							filters={state.filters}
							dispatch={dispatch}
							columns={columns}
						></FilterPopover>

						<ColumnsSettingsPopover
							columnStates={state.columns}
							dispatch={dispatch}
							columns={columns}
						></ColumnsSettingsPopover>

						<IconButton
							icon="refresh-ccw-dot"
							onClick={resetState}
						></IconButton>

						<DividerX></DividerX>

						<ExportPopover></ExportPopover>

						<DividerX></DividerX>

						<TableSearchField
							searchQuery={state.searchQuery}
							dispatch={dispatch}
						></TableSearchField>

						<DividerX></DividerX>

						<Select
							options={rowsPerPageOptions}
							value={state.rowsPerPage}
							onChange={changeRowsPerPage}
						></Select>
					</div>
				</div>

				{/*
					Eigentliche Tabelle mit horizontaler Scrollbar, falls Breite überschritten wird.
					Besteht aus Header, Körper und Footer.
				*/}
				<div
					className="relative max-w-full overflow-auto flex"
					onScroll={(e) => onTableBodyScroll(e)}
				>
					{/* Gepinnte Spalten */}
					{pinnedCols.length > 0 && (
						<div
							className={`sticky left-0 top-0 z-1 flex bg-white border-r border-slate-300 w-fit transition-shadow duration-300 ${tableBodyIsScrolled ? "shadow-[0_0px_15px_rgba(0,0,0,0.15)]" : ""}`}
						>
							{pinnedCols.map((column, index) => (
								<TableColumn<RowType>
									key={`column-${index}-pinned`}
									column={column}
									paginatedRows={paginatedRows}
									rowsPerPage={state.rowsPerPage}
									sorting={state.sorting}
									columnState={state.columns.get(
										column.field,
									)}
									dispatch={dispatch}
								></TableColumn>
							))}
						</div>
					)}

					{/* Normale Spalten */}
					<div className="flex w-full">
						{visibleCols.map((column, index) => (
							<TableColumn<RowType>
								key={`column-${index}-visible`}
								column={column}
								paginatedRows={paginatedRows}
								rowsPerPage={state.rowsPerPage}
								sorting={state.sorting}
								columnState={state.columns.get(column.field)}
								dispatch={dispatch}
							></TableColumn>
						))}

						<EmptyTableColumn
							paginatedRowsAmount={paginatedRows.length}
							rowsPerPage={state.rowsPerPage}
						></EmptyTableColumn>
					</div>
				</div>

				{/* Grid Footer */}
				<div className="flex items-center justify-between gap-x5 h-12 min-w-fit w-full border-t border-slate-300 px-2">
					<InfoBar
						rowsAmount={filteredRows.length}
						selectedPage={state.selectedPage}
						rowsPerPage={state.rowsPerPage}
					></InfoBar>

					<Pagination
						dispatch={dispatch}
						pageAmount={pageAmount}
						selectedPage={state.selectedPage}
					></Pagination>
				</div>
			</div>
		</div>
	);
}

export default Table;
