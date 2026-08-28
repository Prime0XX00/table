import { SearchIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import IconButton from "./IconButton";
import type { TableAction } from "../types";
import React from "react";
import Tooltip from "./Tooltip";

interface TableSearchFieldProps<RowType> {
	searchQuery: string;
	dispatch: (action: TableAction<RowType>) => void;
}

function TableSearchField<RowType>({
	...props
}: TableSearchFieldProps<RowType>) {
	const [expanded, setExpanded] = useState<boolean>(props.searchQuery != "");

	const searchFieldRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (e: any) => {
			if (!searchFieldRef.current) return;
			if (!expanded) return;
			if (props.searchQuery) return;

			const isOutside = !searchFieldRef.current.contains(e.target);

			if (isOutside) {
				setExpanded(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [searchFieldRef, expanded, props.searchQuery]);

	return (
		<div className="relative flex items-center">
			<Tooltip
				trigger={
					<IconButton
						className={`${expanded ? " opacity-0 pointer-events-none" : "opacity-100"} transition-all absolute `}
						icon="search"
						onClick={() => setExpanded((prev) => !prev)}
					></IconButton>
				}
			>
				Suchen
			</Tooltip>

			<div
				ref={searchFieldRef}
				className={`${expanded ? "max-w-50 w-full opacity-100 px-2" : "max-w-0 w-full opacity-0 px-0 pointer-events-none"} min-w-7.5 transition-all rounded-sm border border-border bg-main h-element flex gap-x-2 items-center`}
			>
				<SearchIcon
					size={18}
					className="min-w-4.5"
				></SearchIcon>

				<input
					name="searchQuery"
					placeholder="Suchen..."
					className="focus:outline-none w-full"
					value={props.searchQuery}
					onChange={(e) =>
						props.dispatch({
							type: "SEARCH_QUERY_SET",
							payload: { searchQuery: e.target.value },
						})
					}
				></input>
				{props.searchQuery && (
					<IconButton
						icon="x-circle"
						onClick={() =>
							props.dispatch({
								type: "SEARCH_QUERY_SET",
								payload: { searchQuery: "" },
							})
						}
					></IconButton>
				)}
			</div>
		</div>
	);
}

export default React.memo(TableSearchField) as typeof TableSearchField;
