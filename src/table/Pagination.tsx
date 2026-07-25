import React from "react";
import type { TableAction } from "../types";

import IconButton from "./IconButton";

interface PaginationProps<RowType> {
	pageAmount: number;
	selectedPage: number;

	dispatch: (action: TableAction<RowType>) => void;
}

function Pagination<RowType>({ ...props }: PaginationProps<RowType>) {
	return (
		<div className="flex gap-x-2 items-center">
			<IconButton
				icon="chevrons-left"
				disabled={props.selectedPage <= 0}
				onClick={() =>
					props.dispatch({
						type: "PAGE_SET_FIRST",
					})
				}
			></IconButton>
			<IconButton
				icon="chevron-left"
				disabled={props.selectedPage <= 0}
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
						{props.selectedPage + 1} / {props.pageAmount}
					</span>
				)}
			</p>
			<IconButton
				icon="chevron-right"
				disabled={props.selectedPage >= props.pageAmount - 1}
				onClick={() =>
					props.dispatch({
						type: "PAGE_SET_NEXT",
						payload: { pageAmount: props.pageAmount },
					})
				}
			></IconButton>
			<IconButton
				icon="chevrons-right"
				disabled={props.selectedPage >= props.pageAmount - 1}
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

export default React.memo(Pagination) as typeof Pagination;
