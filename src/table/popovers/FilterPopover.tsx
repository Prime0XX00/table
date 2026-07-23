import IconButton from "../IconButton";
import {
	FILTER_OPERATORS,
	type CreateColumnUnion,
	type FilterOperator,
	type TableAction,
	type TableState,
} from "../../types";
import Popover from "../Popover";
import Select from "../Select";
import Input from "../Input";

interface FilterPopoverProps<RowType> {
	columns: CreateColumnUnion<RowType>[];
	tableState: TableState<RowType>;
	dispatch: (action: TableAction<RowType>) => void;
}

function FilterPopover<RowType>({ ...props }: FilterPopoverProps<RowType>) {
	return (
		<Popover
			trigger={
				<div className="relative">
					<IconButton icon="funnel"></IconButton>
					{props.tableState.filters.filters.filter(
						(filter) => filter.value != "",
					).length > 0 && (
						<div className="bg-blue-600 rounded-full size-2 absolute right-0 top-0"></div>
					)}
				</div>
			}
		>
			<div className="flex flex-col gap-y-2">
				{props.tableState.filters.filters.map((filter, index) => (
					<div
						className="flex gap-x-2 items-center px-2"
						key={`filter-${index}`}
					>
						<IconButton
							icon="x"
							onClick={() =>
								props.dispatch({
									type: "FILTER_DELETE",
									payload: { index: index },
								})
							}
						></IconButton>
						<Select
							options={props.columns.map((col) => ({
								value: col.field as string | number,
								display: col.title,
							}))}
							value={String(filter.column.field)}
							onChange={(value) =>
								props.dispatch({
									type: "FILTER_CHANGE",
									payload: {
										filter: {
											...filter,
											column:
												props.columns.find(
													(col) =>
														col.field ==
														(value as keyof RowType),
												) ?? props.columns[0],
										},

										index: index,
									},
								})
							}
						></Select>
						<Select
							options={Object.values(
								FILTER_OPERATORS[
									props.tableState.filters.filters[index]
										.column.dataType
								],
							).map((operator) => ({
								value: operator,
								display: operator,
							}))}
							value={filter.operator}
							onChange={(value) =>
								props.dispatch({
									type: "FILTER_CHANGE",
									payload: {
										filter: {
											...filter,
											operator: value as FilterOperator,
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
									props.dispatch({
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
									props.dispatch({
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
							props.dispatch({
								type: "FILTER_ADD",
							})
						}
					></IconButton>
					{props.tableState.filters.filters.length > 1 && (
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
							value={props.tableState.filters.connection}
							onChange={() =>
								props.dispatch({
									type: "FILTER_CONNECTION_TOGGLE",
								})
							}
						></Select>
					)}

					<IconButton
						icon="trash"
						onClick={() =>
							props.dispatch({
								type: "FILTERS_RESET",
							})
						}
					></IconButton>
				</div>
			</div>
		</Popover>
	);
}

export default FilterPopover;
