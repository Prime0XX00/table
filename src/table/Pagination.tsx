import type { TableAction, TableState } from "../types";

import IconButton from "./IconButton";

interface PaginationProps<RowType> {
	pageAmount: number;
	tableState: TableState<RowType>;
	dispatch: (action: TableAction<RowType>) => void;
}

function Pagination<RowType>({ ...props }: PaginationProps<RowType>) {
	return (
		<div className="flex gap-x-2 items-center">
			<IconButton
				icon="chevrons-left"
				disabled={props.tableState.selectedPage <= 0}
				onClick={() =>
					props.dispatch({
						type: "PAGE_SET_FIRST",
					})
				}
			></IconButton>
			<IconButton
				icon="chevron-left"
				disabled={props.tableState.selectedPage <= 0}
				onClick={() =>
					props.dispatch({
						type: "PAGE_SET_PREV",
					})
				}
			></IconButton>
			<p>
				{props.pageAmount == 0 ? (
					<span>{0 + " / " + 0}</span>
				) : (
					<span>
						{props.tableState.selectedPage + 1} / {props.pageAmount}
					</span>
				)}
			</p>
			<IconButton
				icon="chevron-right"
				disabled={props.tableState.selectedPage >= props.pageAmount - 1}
				onClick={() =>
					props.dispatch({
						type: "PAGE_SET_NEXT",
						payload: { pageAmount: props.pageAmount },
					})
				}
			></IconButton>
			<IconButton
				icon="chevrons-right"
				disabled={props.tableState.selectedPage >= props.pageAmount - 1}
				onClick={() =>
					props.dispatch({
						type: "PAGE_SET_LAST",
						payload: { pageAmount: props.pageAmount },
					})
				}
			></IconButton>
		</div>
	);
}

export default Pagination;
