import {
	ChevronLeftIcon,
	ChevronRightIcon,
	ChevronsLeftIcon,
	ChevronsRightIcon,
} from "lucide-react";
import { useEffect, useMemo, useReducer, useState } from "react";
import HeaderResizer from "./HeaderResizer";
import {
	FILTER_OPERATORS,
	type ColumnState,
	type CreateColumnUnion,
	type Filter,
	type FilterOperator,
	type RowsPerPageOption,
	type TableAction,
	type TableRow,
	type TableState,
} from "../types";
import Header from "./Header";
import TableSearchField from "./TableSearchField";
import Checkbox from "./Checkbox";
import Button from "./Button";
import IconButton from "./IconButton";
import Select from "./Select";
import Popover from "./Popover";
import Input from "./Input";

interface TableProps<RowType extends Object> {
	title: string;
	rows: Array<RowType> | undefined;
	columns: CreateColumnUnion<RowType>[];
	rowsPerPageOptions?: RowsPerPageOption[];
}

function Table<RowType extends Object>({
	rowsPerPageOptions = [{ value: 10 }, { value: 20 }, { value: 50 }],
	...props
}: TableProps<RowType>) {
	// Startwerte für Cols
	const initalColumns = new Map<keyof RowType, ColumnState>();

	props.columns.forEach((column) => {
		initalColumns.set(column.field, {
			width: column.initialWidth ?? 160,
			visible: column.isVisible ?? true,
			pinned: false,
		});
	});

	// Startwerte für die Tabelle
	const initialState: TableState<RowType> = {
		selectedPage: 0,
		rowsPerPage: rowsPerPageOptions[0].value,
		sorting: {
			column: props.columns[0],
			direction: "asc",
		},
		columns: initalColumns,
		searchQuery: "",
		filters: {
			filters: [
				{
					column: props.columns[0],
					operator: Object.values(
						FILTER_OPERATORS[props.columns[0].dataType],
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
			case "STATE_SET":
				return action.payload.state;

			// Sortierfunktionalität
			// Entweder wird die momentane Suche getoggelt oder eine neue Spalte zur Suche ausgewählt
			case "SORT_TOGGLE": {
				const column = action.payload.column;

				// Checken, ob die Spalte überhaupt sortiert werden kann.
				if (!column.isSortable) return state;

				// Wenn neues Feld ausgewählt wird
				// Da nur ein Richtungs-State für die gesamte Tabelle existiert, wird sobald die Spalte gewechselt wird
				// der State zurück auf ASC gesetzt
				if (state.sorting.column.field != column.field) {
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
									column: props.columns[0],
									operator: Object.values(
										FILTER_OPERATORS[
											props.columns[0].dataType
										],
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
								column: props.columns[0],
								operator: Object.values(
									FILTER_OPERATORS[props.columns[0].dataType],
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
								column: props.columns[0],
								operator: Object.values(
									FILTER_OPERATORS[props.columns[0].dataType],
								)[0] as FilterOperator,
								value: "",
							},
						],
					},
				};
		}
	}

	// Demo
	function changeSearchQuery(newSearchQuery: string) {
		dispatch({
			type: "SEARCH_QUERY_SET",
			payload: { searchQuery: newSearchQuery },
		});
	}

	const visibleCols = useMemo(
		() =>
			[...props.columns].filter(
				(col) => state.columns.get(col.field)?.visible,
			),
		[props.columns, state.columns],
	);

	const pinnedCols = useMemo(
		() =>
			[...props.columns].filter(
				(col) => state.columns.get(col.field)?.pinned,
			),

		[props.columns, state.columns],
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
		if (!state.columns.get(state.sorting.column.field)?.visible)
			return [...filteredRows];

		switch (state.sorting.column.dataType) {
			case "number": {
				const newRows = [...(filteredRows ?? [])].sort((rowA, rowB) => {
					const valueA = Number(rowA[state.sorting.column.field]);
					const valueB = Number(rowB[state.sorting.column.field]);

					return state.sorting.direction == "asc"
						? valueA - valueB
						: valueB - valueA;
				});
				return newRows;
			}
			case "string": {
				const newRows = [...(filteredRows ?? [])].sort((rowA, rowB) => {
					const valueA = String(rowA[state.sorting.column.field]);
					const valueB = String(rowB[state.sorting.column.field]);

					return state.sorting.direction == "asc"
						? valueA.localeCompare(valueB)
						: valueB.localeCompare(valueA);
				});
				return newRows;
			}
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

	const [selectedRowIds, setSelectedRowIds] = useState<Set<number>>(
		new Set<number>(),
	);

	// Wenn die gefilterten Reihen sich ändern, dann wird die erste Seite ausgewählt
	// Das hat den Sinn, dass der User nach der Filterung auf einer Seite sein kann, die nicht mehr existiert
	// Das selbe gilt für die angezeigten Reihen pro Seite
	useEffect(() => {
		dispatch({
			type: "PAGE_SET_FIRST",
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
	}

	const checked = useMemo(() => {
		if (selectedRowIds.size == 0) return false;
		else if (selectedRowIds.size == filteredRows.length) return true;
		else return undefined;
	}, [selectedRowIds, rows, state.searchQuery, state.filters]);

	return (
		<div className="min-w-200 max-w-200 text-slate-700">
			<div className="border border-slate-300 rounded-sm bg-white overflow-hidden">
				{/* Grid Header */}
				<div className="flex items-center justify-between h-12 min-w-fit w-full border-b border-slate-300 px-2">
					<p className="font-semibold">{props.title}</p>

					{/* Grid Optionen */}
					<div className="flex gap-x-2 items-center h-full">
						<Popover
							trigger={
								<div className="relative">
									<IconButton icon="funnel"></IconButton>
									{state.filters.filters.filter(
										(filter) => filter.value != "",
									).length > 0 && (
										<div className="bg-blue-600 rounded-full size-2 absolute right-0 top-0"></div>
									)}
								</div>
							}
						>
							<div className="flex flex-col gap-y-2">
								{state.filters.filters.map((filter, index) => (
									<div
										className="flex gap-x-2 items-center px-2"
										key={`filter-${index}`}
									>
										<IconButton
											icon="x"
											onClick={() =>
												dispatch({
													type: "FILTER_DELETE",
													payload: { index: index },
												})
											}
										></IconButton>
										<Select
											options={props.columns.map(
												(col) => ({
													value: col.field as
														| string
														| number,
													display: col.title,
												}),
											)}
											value={String(filter.column.field)}
											onChange={(value) =>
												dispatch({
													type: "FILTER_CHANGE",
													payload: {
														filter: {
															...filter,
															column:
																props.columns.find(
																	(col) =>
																		col.field ==
																		(value as keyof RowType),
																) ??
																props
																	.columns[0],
														},

														index: index,
													},
												})
											}
										></Select>
										<Select
											options={Object.values(
												FILTER_OPERATORS[
													state.filters.filters[index]
														.column.dataType
												],
											).map((operator) => ({
												value: operator,
												display: operator,
											}))}
											value={filter.operator}
											onChange={(value) =>
												dispatch({
													type: "FILTER_CHANGE",
													payload: {
														filter: {
															...filter,
															operator:
																value as FilterOperator,
														},
														index: index,
													},
												})
											}
										></Select>
										{filter.column.dataType == "boolean" ? (
											<Select
												options={[
													{
														value: "",
														display: "-----",
													},
													{
														value: "1",
														display: "WAHR",
													},
													{
														value: "0",
														display: "FALSCH",
													},
												]}
												value={filter.value}
												onChange={(value) =>
													dispatch({
														type: "FILTER_CHANGE",
														payload: {
															filter: {
																...filter,
																value: value,
															},
															index: index,
														},
													})
												}
											></Select>
										) : (
											<Input
												value={filter.value}
												onValueChange={(value) =>
													dispatch({
														type: "FILTER_CHANGE",
														payload: {
															filter: {
																...filter,
																value: value,
															},
															index: index,
														},
													})
												}
											></Input>
										)}
									</div>
								))}

								<div className="border-t border-slate-300 w-full"></div>

								<div className="px-2 flex items-center gap-x-2 justify-between">
									<IconButton
										icon="plus"
										onClick={() =>
											dispatch({
												type: "FILTER_ADD",
											})
										}
									></IconButton>
									{state.filters.filters.length > 1 && (
										<Select
											options={[
												{
													value: "and",
													display: "UND",
												},
												{
													value: "or",
													display: "ODER",
												},
											]}
											value={state.filters.connection}
											onChange={() =>
												dispatch({
													type: "FILTER_CONNECTION_TOGGLE",
												})
											}
										></Select>
									)}

									<IconButton
										icon="trash"
										onClick={() =>
											dispatch({
												type: "FILTERS_RESET",
											})
										}
									></IconButton>
								</div>
							</div>
						</Popover>

						<Popover
							trigger={
								<IconButton icon="columns-3-cog"></IconButton>
							}
						>
							<div className="flex flex-col">
								{props.columns.map((column, index) => (
									<div
										key={`col-toggle-${index}`}
										className={`${
											state.columns.get(column.field)
												?.visible
												? "bg-blue-50 hover:bg-blue-100"
												: "hover:bg-slate-100"
										} h-8.5 flex gap-x-2 px-2 items-center`}
									>
										<Checkbox
											checked={
												state.columns.get(column.field)
													?.visible
											}
											onChange={() =>
												dispatch({
													type: "COL_TOGGLE_VISIBILITY",
													payload: {
														field: column.field,
													},
												})
											}
										></Checkbox>
										<span>{column.title}</span>
									</div>
								))}
							</div>
						</Popover>

						<IconButton
							icon="refresh-ccw-dot"
							onClick={() =>
								dispatch({
									type: "STATE_SET",
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
									type: "ROWS_PER_PAGE_SET",
									payload: { rowsPerPage: value as number },
								})
							}
						></Select>
					</div>
				</div>

				{/*
					Eigentliche Tabelle mit horizontaler Scrollbar, falls Breite überschritten wird.
					Besteht aus Header, Körper und Footer.
				*/}
				<div className="relative max-w-full overflow-auto flex">
					{/* Pinned */}
					<div className="sticky left-0 top-0 h-full bg-white grid grid-cols-[1fr] divide-y divide-slate-300 z-1 border-r border-slate-300">
						<div className="flex items-center h-12 w-fit">
							{/* 
								Checkbox-Header
								TODO: Muss noch automatisch generiert werden und Header Komponente nutze
							*/}
							<div className={`group flex h-full pl-2 w-10`}>
								<div className="flex gap-x-2 h-full items-center w-full">
									<Checkbox
										checked={checked}
										onChange={() => toggleAllRows()}
									></Checkbox>
								</div>

								<HeaderResizer
									isResizable={false}
								></HeaderResizer>
							</div>

							{pinnedCols.map((column, headerIndex) => (
								<Header
									key={`header-pinned-${headerIndex}`}
									tableState={state}
									column={column}
									dispatch={dispatch}
								></Header>
							))}
						</div>
						<div>
							{paginatedRows?.map((row, rowIndex) => (
								<div
									key={`row-pinned-${rowIndex}`}
									className={`${selectedRowIds.has(row.__rowId) ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-slate-100"} w-full h-8.5 border-b border-slate-300 last:border-0 flex items-center`}
								>
									{/* 
										Checkbox-Zelle
										TODO: Muss noch automatisch generiert werden und Zellen Komponente nutzen
									*/}
									<div
										key={`row-${rowIndex}-cell-select`}
										className={`px-2 w-10`}
									>
										<Checkbox
											checked={selectedRowIds.has(
												row.__rowId,
											)}
											onChange={() => toggleRow(row)}
										></Checkbox>
									</div>
									{/* Restliche Zellen */}
									{pinnedCols.map((column, cellIndex) => (
										<div
											key={`row-${rowIndex}-cell-${cellIndex}`}
											className="px-2 overflow-hidden text-ellipsis min-w-28"
											style={{
												width:
													state.columns.get(
														column.field,
													)?.width + "px",
											}}
										>
											{column.render
												? column.render(
														row[column.field],
													)
												: String(row[column.field])}
										</div>
									))}
								</div>
							))}
							{paginatedRows.length < state.rowsPerPage &&
								Array.from({
									length:
										state.rowsPerPage -
										paginatedRows.length,
								}).map((_, rowIndex) => (
									<div
										key={`row-empty-${rowIndex}`}
										className={`h-8.5`}
									></div>
								))}
						</div>
						<div className="h-12 flex items-center justify-between px-2 min-w-fit w-full"></div>
					</div>

					<div className="grid grid-cols-[1fr] divide-y divide-slate-300 w-full">
						{/* Header-Zeile mit Header pro Spalte */}
						<div className="flex items-center h-12 min-w-fit w-full">
							{/* 
								Restlichen Header, die nicht gepinnt sind
							*/}
							{visibleCols
								.filter(
									(visibleCol) =>
										!state.columns.get(visibleCol.field)
											?.pinned,
								)
								.map((column, headerIndex) => (
									<Header
										key={`header-${headerIndex}`}
										tableState={state}
										column={column}
										dispatch={dispatch}
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
									{/* Restliche Zellen */}
									{visibleCols
										.filter(
											(visibleCol) =>
												!state.columns.get(
													visibleCol.field,
												)?.pinned,
										)
										.map((column, cellIndex) => (
											<div
												key={`row-${rowIndex}-cell-${cellIndex}`}
												className="px-2 overflow-hidden text-ellipsis min-w-28"
												style={{
													width:
														state.columns.get(
															column.field,
														)?.width + "px",
												}}
											>
												{column.render
													? column.render(
															row[column.field],
														)
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
										state.rowsPerPage -
										paginatedRows.length,
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
								type: "PAGE_SET_FIRST",
							})
						}
					>
						<ChevronsLeftIcon></ChevronsLeftIcon>
					</Button>
					<Button
						disabled={state.selectedPage <= 0}
						onClick={() =>
							dispatch({
								type: "PAGE_SET_PREV",
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
								type: "PAGE_SET_NEXT",
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
								type: "PAGE_SET_LAST",
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
