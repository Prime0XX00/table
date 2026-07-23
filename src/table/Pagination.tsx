import Button from "./Button";
import type { TableAction, TableState } from "../types";
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	ChevronsLeftIcon,
	ChevronsRightIcon,
} from "lucide-react";

interface PaginationProps<RowType> {
	pageAmount: number;
	tableState: TableState<RowType>;
	dispatch: (action: TableAction<RowType>) => void;
}

function Pagination<RowType>({ ...props }: PaginationProps<RowType>) {
	return (
		<div className="flex gap-x-2 items-center">
			<Button
				disabled={props.tableState.selectedPage <= 0}
				onClick={() =>
					props.dispatch({
						type: "PAGE_SET_FIRST",
					})
				}
			>
				<ChevronsLeftIcon></ChevronsLeftIcon>
			</Button>
			<Button
				disabled={props.tableState.selectedPage <= 0}
				onClick={() =>
					props.dispatch({
						type: "PAGE_SET_PREV",
					})
				}
			>
				<ChevronLeftIcon></ChevronLeftIcon>
			</Button>
			<p>
				{props.pageAmount == 0 ? (
					<span>{0 + " / " + 0}</span>
				) : (
					<span>
						{props.tableState.selectedPage + 1} / {props.pageAmount}
					</span>
				)}
			</p>
			<Button
				disabled={props.tableState.selectedPage >= props.pageAmount - 1}
				onClick={() =>
					props.dispatch({
						type: "PAGE_SET_NEXT",
						payload: { pageAmount: props.pageAmount },
					})
				}
			>
				<ChevronRightIcon></ChevronRightIcon>
			</Button>
			<Button
				disabled={props.tableState.selectedPage >= props.pageAmount - 1}
				onClick={() =>
					props.dispatch({
						type: "PAGE_SET_LAST",
						payload: { pageAmount: props.pageAmount },
					})
				}
			>
				<ChevronsRightIcon></ChevronsRightIcon>
			</Button>
		</div>
	);
}

export default Pagination;
