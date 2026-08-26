import React from "react";
import type { TableAction } from "../types";

import IconButton from "./IconButton";
import Tooltip from "./Tooltip";

interface PaginationProps<RowType> {
	pageAmount: number;
	selectedPage: number;

	dispatch: (action: TableAction<RowType>) => void;
}

function Pagination<RowType>({ ...props }: PaginationProps<RowType>) {
	return (
		<div className="flex gap-x-2 items-center">
			<Tooltip
				trigger={
					<IconButton
						icon="chevrons-left"
						disabled={props.selectedPage <= 0}
						onClick={() =>
							props.dispatch({
								type: "PAGE_SET_FIRST",
							})
						}
					></IconButton>
				}
			>
				Zur ersten Seite
			</Tooltip>
			<Tooltip
				trigger={
					<IconButton
						icon="chevron-left"
						disabled={props.selectedPage <= 0}
						onClick={() =>
							props.dispatch({
								type: "PAGE_SET_PREV",
							})
						}
					></IconButton>
				}
			>
				Zur vorherigen Seite
			</Tooltip>
			<p>
				{props.pageAmount == 0 ? (
					<span>{0 + " / " + 0}</span>
				) : (
					<span>
						{props.selectedPage + 1} / {props.pageAmount}
					</span>
				)}
			</p>
			<Tooltip
				trigger={
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
				}
			>
				Zur nächsten Seite
			</Tooltip>
			<Tooltip
				trigger={
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
				}
			>
				Zur letzten Seite
			</Tooltip>
		</div>
	);
}

export default React.memo(Pagination) as typeof Pagination;
