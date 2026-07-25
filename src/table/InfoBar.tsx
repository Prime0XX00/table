import React from "react";

interface InfoBarProps {
	rowsAmount: number;
	rowsPerPage: number;
	selectedPage: number;
}

function InfoBar({ ...props }: InfoBarProps) {
	return (
		<p>
			{props.rowsAmount == 0 ? (
				<>
					<span>{0 + " / " + 0}</span>
				</>
			) : (
				<>
					<span>{props.rowsPerPage * props.selectedPage + 1}</span>
					<span>{" - "}</span>
					<span>
						{Math.min(
							props.rowsPerPage * (props.selectedPage + 1),
							props.rowsAmount,
						)}
					</span>
					<span>{" / "}</span>
					<span>{props.rowsAmount}</span>
				</>
			)}
		</p>
	);
}

export default React.memo(InfoBar);
