import Popover from "../Popover";
import IconButton from "../IconButton";
import Checkbox from "../Checkbox";
import type { Column, TableAction, TableState } from "../../types";

interface ColumnsSettingsPopoverProps<RowType> {
	columns: Column<RowType>[];
	tableState: TableState<RowType>;
	dispatch: (action: TableAction<RowType>) => void;
}

function ColumnsSettingsPopover<RowType>({
	...props
}: ColumnsSettingsPopoverProps<RowType>) {
	return (
		<Popover trigger={<IconButton icon="columns-3-cog"></IconButton>}>
			<div className="flex flex-col">
				{props.columns.map((column, index) => (
					<div
						key={`col-toggle-${index}`}
						className={`${
							props.tableState.columns.get(column.field)?.visible
								? "bg-blue-50 hover:bg-blue-100"
								: "hover:bg-slate-100"
						} h-8.5 flex gap-x-2 px-2 items-center`}
					>
						<Checkbox
							checked={
								props.tableState.columns.get(column.field)
									?.visible
							}
							onChange={() =>
								props.dispatch({
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
	);
}

export default ColumnsSettingsPopover;
