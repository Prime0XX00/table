import {
	ChevronLeftIcon,
	ChevronRightIcon,
	ChevronsLeftIcon,
	ChevronsRightIcon,
} from "lucide-react";
import { useEffect, useMemo, useReducer, useState } from "react";
import HeaderResizer from "./HeaderResizer";
import type {
	Column,
	ColumnState,
	RowsPerPageOption,
	TableAction,
	TableRow,
	TableState,
} from "../types";
import Header from "./Header";
import TableSearchField from "./TableSearchField";
import Checkbox from "./Checkbox";
import Button from "./Button";
import IconButton from "./IconButton";
import Select from "./Select";

interface TableProps<RowType extends Object> {
	title: string;
	rows: Array<RowType> | undefined;
	columns: Column<RowType, keyof RowType>[];
	rowsPerPageOptions?: RowsPerPageOption[];
}

const ACTIONS = {
	STATE_SET: "state_set",
	SORT_TOGGLE: "sort_toggle",
	PAGE_SET_FIRST: "page_set_first",
	PAGE_SET_PREV: "page_set_prev",
	PAGE_SET_NEXT: "page_set_next",
	PAGE_SET_LAST: "page_set_last",
	ROWS_PER_PAGE_SET: "rows_per_page_set",
	COL_SET_WIDTH: "col_set_width",
	SEARCH_QUERY_SET: "serch_query_set",
};

function reducer<RowType>(
	state: TableState<RowType>,
	action: TableAction,
): TableState<RowType> {
	switch (action.type) {
		case ACTIONS.STATE_SET:
			return action.payload.state;
		case ACTIONS.SORT_TOGGLE:
			return toggleSortReducer(action.payload.column, state);
		case ACTIONS.PAGE_SET_FIRST:
			return { ...state, selectedPage: 0 };
		case ACTIONS.PAGE_SET_PREV:
			return {
				...state,
				selectedPage: Math.max(state.selectedPage - 1, 0),
			};
		case ACTIONS.PAGE_SET_NEXT:
			return {
				...state,
				selectedPage: Math.min(
					state.selectedPage + 1,
					action.payload.pageAmount - 1,
				),
			};
		case ACTIONS.PAGE_SET_LAST:
			return { ...state, selectedPage: action.payload.pageAmount - 1 };
		case ACTIONS.ROWS_PER_PAGE_SET:
			return { ...state, rowsPerPage: action.payload.rowsPerPage };
		case ACTIONS.COL_SET_WIDTH:
			return {
				...state,
				columns: state.columns.set(action.payload.field, {
					...state.columns.get(action.payload.field),
					width: action.payload.width,
				}),
			};
		case ACTIONS.SEARCH_QUERY_SET:
			return {
				...state,
				searchQuery: action.payload.searchQuery,
			};
	}
	return state;
}

function toggleSortReducer<RowType>(
	column: Column<RowType, keyof RowType>,
	state: TableState<RowType>,
): TableState<RowType> {
	// Checken, ob die Spalte überhaupt sortiert werden kann.
	if (!column.isSortable) return state;

	// Wenn neues Feld ausgewählt wird
	// Da nur ein Richtungs-State für die gesamte Tabelle existiert, wird sobald die Spalte gewechselt wird
	// der State zurück auf ASC gesetzt
	if (state.sorting.field != column.field) {
		state.sorting.field = column.field;
		return {
			...state,
			sorting: {
				...state.sorting,
				field: column.field,
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
					field: column.field,
					direction: "desc",
				},
			};
		else
			return {
				...state,
				sorting: {
					...state.sorting,
					field: column.field,
					direction: "asc",
				},
			};
	}
}

function Table<RowType extends Object>({
	rowsPerPageOptions = [{ value: 10 }, { value: 20 }, { value: 50 }],
	...props
}: TableProps<RowType>) {
	// Demo
	function setWidth<RowType>(field: keyof RowType, width: number) {
		dispatch({
			type: ACTIONS.COL_SET_WIDTH,
			payload: {
				field: field,
				width: width,
			},
		});
	}

	// Demo
	function toggleSort(column: Column<RowType>) {
		dispatch({
			type: ACTIONS.SORT_TOGGLE,
			payload: { column: column },
		});
	}

	// Demo
	function changeSearchQuery(newSearchQuery: string) {
		dispatch({
			type: ACTIONS.SEARCH_QUERY_SET,
			payload: { searchQuery: newSearchQuery },
		});
	}

	const initalColumns = new Map<keyof RowType, ColumnState>();

	props.columns.forEach((column) => {
		initalColumns.set(column.field, {
			width: column.initialWidth ?? 160,
		});
	});

	const initialState: TableState<RowType> = {
		selectedPage: 0,
		rowsPerPage: rowsPerPageOptions[0].value,
		sorting: {
			field: props.columns[0].field,
			direction: "asc",
		},
		columns: initalColumns,
		searchQuery: "",
	};
	const [state, dispatch] = useReducer(reducer, initialState);

	const rows: TableRow<RowType>[] = useMemo(() => {
		return [...(props.rows ?? [])].map((row, index) => ({
			...row,
			__rowId: index,
		}));
	}, [props.rows]);

	// Filtern der Zeilen anhand der SearchQuery
	const filteredRows = useMemo(() => {
		const upperCaseSearchQuery = state.searchQuery.toUpperCase();
		const newRows = [...(rows ?? [])].filter((row) => {
			const keys = Object.keys(row) as [keyof RowType];
			return keys.some((key) => {
				const cellValue = row[key];
				return String(cellValue)
					.toUpperCase()
					.includes(upperCaseSearchQuery);
			});
		});
		return newRows;
	}, [rows, state.searchQuery]);

	// Berechnung der Seitenanzahl
	const pageAmount = useMemo(() => {
		if (filteredRows == undefined) return 0;
		else {
			return Math.ceil(filteredRows.length / state.rowsPerPage);
		}
	}, [filteredRows, state.rowsPerPage]);

	// Sortierung anhand der ausgewählten Spalte und Richtung
	const sortedRows = useMemo(() => {
		const newRows = [...(filteredRows ?? [])].sort((rowA, rowB) => {
			const valueA = Number(rowA[state.sorting.field]);
			const valueB = Number(rowB[state.sorting.field]);

			return state.sorting.direction == "asc"
				? valueA - valueB
				: valueB - valueA;
		});
		return newRows;
	}, [state.sorting.field, state.sorting.direction, filteredRows]);

	// Zuschneidung der angezeigten Reihen anhad der momentanen Seite
	const paginatedRows = useMemo(() => {
		const newRows = [...(sortedRows ?? [])]?.slice(
			state.selectedPage * state.rowsPerPage,
			(state.selectedPage + 1) * state.rowsPerPage,
		);
		return newRows;
	}, [sortedRows, state.selectedPage, state.rowsPerPage]);

	const [selectedRowIds, setSelectedRowIds] = useState<Set<number>>(
		new Set<number>(),
	);

	// Wenn die gefilterten Reihen sich ändern, dann wird die erste Seite ausgewählt
	// Das hat den Sinn, dass der User nach der Filterung auf einer Seite sein kann, die nicht mehr existiert
	// Das selbe gilt für die angezeigten Reihen pro Seite
	useEffect(() => {
		dispatch({
			type: ACTIONS.PAGE_SET_FIRST,
			payload: { pageAmount: pageAmount },
		});
	}, [filteredRows, state.rowsPerPage]);

	// Auswählen der Zeilen
	function toggleRow(row: TableRow<RowType>) {
		if (selectedRowIds.has(row.__rowId))
			setSelectedRowIds((prev) => {
				prev.delete(row.__rowId);
				return new Set<number>(prev);
			});
		else
			setSelectedRowIds((prev) => new Set<number>(prev.add(row.__rowId)));
	}

	// Es werden alle Reihen ausgewählt, nach denen momentan gefiltert wird
	function toggleAllRows() {
		if (selectedRowIds.size >= 0 && selectedRowIds.size < rows.length) {
			const newSet = new Set<number>();
			filteredRows.forEach((row) => newSet.add(row.__rowId));
			setSelectedRowIds(new Set<number>(newSet));
		} else {
			setSelectedRowIds(new Set<number>());
		}
	}

	const checked = useMemo(() => {
		if (selectedRowIds.size == 0) return false;
		else if (selectedRowIds.size == rows.length) return true;
		else return undefined;
	}, [selectedRowIds, rows]);

	return (
		<div className="min-w-200 max-w-200 text-slate-700">
			<div className="border border-slate-300 rounded-sm">
				{/* Grid Header */}
				<div className="flex items-center justify-between h-12 min-w-fit w-full border-b border-slate-300 px-2">
					<p className="font-semibold">{props.title}</p>

					{/* Grid Optionen */}
					<div className="flex gap-x-2 items-center h-full">
						<IconButton icon="funnel"></IconButton>
						<IconButton icon="columns-3-cog"></IconButton>
						<IconButton
							icon="refresh-ccw-dot"
							onClick={() =>
								dispatch({
									type: ACTIONS.STATE_SET,
									payload: { state: initialState },
								})
							}
						></IconButton>

						<div className="w-px h-1/2 bg-slate-200 rounded-sm"></div>

						<IconButton icon="download"></IconButton>

						<div className="w-px h-1/2 bg-slate-200 rounded-sm"></div>

						<TableSearchField
							searchQuery={state.searchQuery}
							onSearchQueryChange={changeSearchQuery}
						></TableSearchField>

						<div className="w-px h-1/2 bg-slate-200 rounded-sm"></div>
						<Select
							options={rowsPerPageOptions.map((option) => ({
								value: option.value,
								display: String(option.value),
							}))}
							value={state.rowsPerPage}
							onChange={(value) =>
								dispatch({
									type: ACTIONS.ROWS_PER_PAGE_SET,
									payload: { rowsPerPage: String(value) },
								})
							}
						></Select>
					</div>
				</div>

				{/*
					Eigentliche Tabelle mit horizontaler Scrollbar, falls Breite überschritten wird.
					Besteht aus Header, Körper und Footer.
				*/}
				<div className="max-w-full overflow-auto grid grid-cols-[1fr] divide-y divide-slate-300">
					{/* Header-Zeile mit Header pro Spalte */}
					<div className="flex items-center h-12 min-w-fit w-full">
						{/* 
							Checkbox-Header
							TODO: Muss noch automatisch generiert werden und Header Komponente nutze
						*/}
						<div className="group flex h-full pl-2 w-10">
							<div className="relative flex gap-x-2 h-full items-center w-full">
								<Checkbox
									checked={checked}
									onChange={() => toggleAllRows()}
								></Checkbox>
							</div>
							<HeaderResizer isResizable={false}></HeaderResizer>
						</div>

						{/* 
							Restlichen Header
						*/}
						{props.columns?.map((column, headerIndex) => (
							<Header
								key={`header-${headerIndex}`}
								tableState={state}
								column={column}
								setWidth={setWidth}
								toggleSort={toggleSort}
							></Header>
						))}
					</div>

					{/* Body-Zeilen */}
					<div className="min-w-fit w-full">
						{paginatedRows?.map((row, rowIndex) => (
							<div
								key={`row-${rowIndex}`}
								className={`${selectedRowIds.has(row.__rowId) ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-slate-100"} w-full h-8.5 border-b border-slate-300 last:border-0 flex items-center`}
							>
								{/* 
									Checkbox-Zelle
									TODO: Muss noch automatisch generiert werden und Zellen Komponente nutzen
								*/}
								<div
									key={`row-${rowIndex}-cell-select`}
									className="px-2 w-10"
								>
									<Checkbox
										checked={selectedRowIds.has(
											row.__rowId,
										)}
										onChange={() => toggleRow(row)}
									></Checkbox>
								</div>

								{/* Restliche Zellen */}
								{props.columns.map((column, cellIndex) => (
									<div
										key={`row-${rowIndex}-cell-${cellIndex}`}
										className="px-2 overflow-hidden text-ellipsis min-w-28"
										style={{
											width:
												state.columns.get(column.field)
													?.width + "px",
										}}
									>
										{column.render
											? column.render(row[column.field])
											: String(row[column.field])}
									</div>
								))}
							</div>
						))}
						{/* 
							Leere Zeilen, damit die Tabellenhöhe immer gleich bleibt.
							Generiert diese, bis die Anzahl an Reihen pro Seite eingehalten wird.
						*/}
						{paginatedRows.length < state.rowsPerPage &&
							Array.from({
								length:
									state.rowsPerPage - paginatedRows.length,
							}).map((_, rowIndex) => (
								<div
									key={`row-empty-${rowIndex}`}
									className={`h-8.5`}
								></div>
							))}
					</div>
					{/* Footer */}
					<div className="h-12 flex items-center justify-between px-2 min-w-fit w-full"></div>
				</div>
			</div>

			{/* Grid Footer */}
			<div className="flex justify-between gap-x-5 items-center">
				<div className="flex gap-x-2 mt-2 items-center">
					<p>
						{filteredRows.length == 0 ? (
							<>
								<span>{0 + " / " + 0}</span>
							</>
						) : (
							<>
								<span>
									{state.rowsPerPage * state.selectedPage + 1}
								</span>
								<span>{" - "}</span>
								<span>
									{Math.min(
										state.rowsPerPage *
											(state.selectedPage + 1),
										filteredRows.length,
									)}
								</span>
								<span>{" / "}</span>
								<span>{filteredRows.length}</span>
							</>
						)}
					</p>
				</div>

				{/* Pagination */}
				<div className="flex gap-x-2 mt-2 items-center">
					<Button
						disabled={state.selectedPage <= 0}
						onClick={() =>
							dispatch({
								type: ACTIONS.PAGE_SET_FIRST,
								payload: { pageAmount: pageAmount },
							})
						}
					>
						<ChevronsLeftIcon></ChevronsLeftIcon>
					</Button>
					<Button
						disabled={state.selectedPage <= 0}
						onClick={() =>
							dispatch({
								type: ACTIONS.PAGE_SET_PREV,
								payload: { pageAmount: pageAmount },
							})
						}
					>
						<ChevronLeftIcon></ChevronLeftIcon>
					</Button>
					<p>
						{pageAmount == 0 ? (
							<span>{0 + " / " + 0}</span>
						) : (
							<span>
								{state.selectedPage + 1} / {pageAmount}
							</span>
						)}
					</p>
					<Button
						disabled={state.selectedPage >= pageAmount - 1}
						onClick={() =>
							dispatch({
								type: ACTIONS.PAGE_SET_NEXT,
								payload: { pageAmount: pageAmount },
							})
						}
					>
						<ChevronRightIcon></ChevronRightIcon>
					</Button>
					<Button
						disabled={state.selectedPage >= pageAmount - 1}
						onClick={() =>
							dispatch({
								type: ACTIONS.PAGE_SET_LAST,
								payload: { pageAmount: pageAmount },
							})
						}
					>
						<ChevronsRightIcon></ChevronsRightIcon>
					</Button>
				</div>
			</div>
		</div>
	);
}

export default Table;
