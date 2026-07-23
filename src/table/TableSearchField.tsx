import { SearchIcon, XCircleIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import IconButton from "./IconButton";
import type { TableAction, TableState } from "../types";

interface TableSearchFieldProps<RowType> {
	tableState: TableState<RowType>;
	dispatch: (action: TableAction<RowType>) => void;
}

function TableSearchField<RowType>({
	...props
}: TableSearchFieldProps<RowType>) {
	const [expanded, setExpanded] = useState<boolean>(false);

	const searchFieldRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (e: any) => {
			if (!searchFieldRef.current) return;
			if (!expanded) return;
			if (props.tableState.searchQuery) return;

			const isOutside = !searchFieldRef.current.contains(e.target);

			if (isOutside) {
				setExpanded(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [searchFieldRef, expanded, props.tableState.searchQuery]);

	return (
		<div className="relative flex items-center">
			<IconButton
				className={`${expanded ? " opacity-0 pointer-events-none" : "opacity-100"} transition-all absolute `}
				icon="search"
				onClick={() => setExpanded((prev) => !prev)}
			></IconButton>

			<div
				ref={searchFieldRef}
				className={`${expanded ? "max-w-50 w-full opacity-100 px-2" : "max-w-0 w-full opacity-0 px-0 pointer-events-none"} min-w-7.5 transition-all rounded-sm border border-slate-300 h-8.5 flex gap-x-2 items-center`}
			>
				<SearchIcon
					size={18}
					className="min-w-4.5"
				></SearchIcon>
				<input
					name="searchQuery"
					placeholder="Suchen..."
					className="focus:outline-none w-full"
					value={props.tableState.searchQuery}
					onChange={(e) =>
						props.dispatch({
							type: "SEARCH_QUERY_SET",
							payload: { searchQuery: e.target.value },
						})
					}
				></input>
				{props.tableState.searchQuery && (
					<div
						className="p-1 rounded-full hover:bg-slate-100 cursor-pointer"
						onClick={() =>
							props.dispatch({
								type: "SEARCH_QUERY_SET",
								payload: { searchQuery: "" },
							})
						}
					>
						<XCircleIcon
							size={18}
							className="min-w-4.5"
						></XCircleIcon>
					</div>
				)}
			</div>
		</div>
	);
}

export default TableSearchField;
