import IconButton from "../IconButton";
import {
	type Column,
	type Filter,
	type FilterOperator,
	type FilterState,
	type TableAction,
} from "../../types";
import Popover, { usePopoverClose } from "../Popover";
import Select from "../Select";
import Input from "../Input";
import React from "react";
import { FILTER_OPERATORS } from "../../consts";
import Tooltip from "../Tooltip";
import DatePicker from "../Datepicker";

interface FilterPopoverProps<RowType> {
	columns: Column<RowType>[];
	filters: FilterState<RowType>;
	dispatch: (action: TableAction<RowType>) => void;
}

function PopoverContent<RowType>({ ...props }: FilterPopoverProps<RowType>) {
	const closePopover = usePopoverClose();

	const handleReset = () => {
		props.dispatch({
			type: "FILTERS_RESET",
		});
		closePopover?.();
	};

	const handleAdd = () => {
		props.dispatch({
			type: "FILTER_ADD",
		});
	};

	const handleDelete = (index: number) => {
		props.dispatch({
			type: "FILTER_DELETE",
			payload: { index: index },
		});
	};

	const handleColChange = (
		filter: Filter<RowType>,
		fieldValue: string | number,
		filterIndex: number,
	) => {
		props.dispatch({
			type: "FILTER_CHANGE",
			payload: {
				filter: {
					...filter,
					column:
						props.columns.find(
							(col) => col.field == (fieldValue as keyof RowType),
						) ?? props.columns[0],
				},

				index: filterIndex,
			},
		});
	};

	const handleOperatorChange = (
		filter: Filter<RowType>,
		operatorValue: string | number,
		filterIndex: number,
	) => {
		props.dispatch({
			type: "FILTER_CHANGE",
			payload: {
				filter: {
					...filter,
					operator: operatorValue as FilterOperator,
				},
				index: filterIndex,
			},
		});
	};

	const handleValueChange = (
		filter: Filter<RowType>,
		value: string | number | boolean | Date,
		filterIndex: number,
	) => {
		props.dispatch({
			type: "FILTER_CHANGE",
			payload: {
				filter: {
					...filter,
					value: value,
				},
				index: filterIndex,
			},
		});
	};

	const handleConnectionChange = () => {
		props.dispatch({
			type: "FILTER_CONNECTION_TOGGLE",
		});
	};

	return (
		<div className="flex flex-col gap-y-2">
			{props.filters.filters.map((filter, index) => (
				<div
					className="flex gap-x-2 items-center px-2"
					key={`filter-${index}`}
				>
					<Tooltip
						trigger={
							<IconButton
								icon="x"
								onClick={() => handleDelete(index)}
							></IconButton>
						}
					>
						Löschen
					</Tooltip>

					<Select
						options={props.columns.map((col) => ({
							value: col.field as string | number,
							display: col.title,
						}))}
						value={String(filter.column.field)}
						onChange={(value) =>
							handleColChange(filter, value, index)
						}
					></Select>
					<Select
						options={Object.values(
							FILTER_OPERATORS[
								props.filters.filters[index].column.dataType
							],
						).map((operator) => ({
							value: operator,
							display: operator,
						}))}
						value={filter.operator}
						onChange={(value) =>
							handleOperatorChange(filter, value, index)
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
							value={String(filter.value)}
							onChange={(value) =>
								handleValueChange(filter, value, index)
							}
						></Select>
					) : filter.column.dataType == "date" ? (
						<DatePicker
							value={
								filter.value instanceof Date
									? filter.value
									: null
							}
							onChange={(value) =>
								handleValueChange(filter, value, index)
							}
						></DatePicker>
					) : (
						<Input
							value={String(filter.value)}
							onValueChange={(value) =>
								handleValueChange(filter, value, index)
							}
						></Input>
					)}
				</div>
			))}

			<div className="border-t border-border w-full"></div>

			<div className="px-2 flex items-center gap-x-2 justify-between">
				<Tooltip
					trigger={
						<IconButton
							icon="plus"
							onClick={handleAdd}
						></IconButton>
					}
				>
					Hinzufügen
				</Tooltip>
				{props.filters.filters.length > 1 && (
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
						value={props.filters.connection}
						onChange={handleConnectionChange}
					></Select>
				)}

				<Tooltip
					trigger={
						<IconButton
							icon="trash"
							onClick={handleReset}
						></IconButton>
					}
				>
					Zurücksetzen
				</Tooltip>
			</div>
		</div>
	);
}

function FilterPopover<RowType>({ ...props }: FilterPopoverProps<RowType>) {
	return (
		<Tooltip
			trigger={
				<Popover
					trigger={
						<div className="relative">
							<IconButton icon="funnel"></IconButton>
							{props.filters.filters.filter(
								(filter) => filter.value != "",
							).length > 0 && (
								<div className="bg-accent rounded-full size-2 absolute right-0 top-0"></div>
							)}
						</div>
					}
				>
					<PopoverContent {...props}></PopoverContent>
				</Popover>
			}
		>
			Filter
		</Tooltip>
	);
}

export default React.memo(FilterPopover) as typeof FilterPopover;
