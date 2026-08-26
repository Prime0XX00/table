import { FileBracesIcon } from "lucide-react";
import IconButton from "../IconButton";
import Popover from "../Popover";
import React from "react";
import Tooltip from "../Tooltip";

interface ExportPopoverProps {
	exportData: () => void;
}

const ExportPopover: React.FC<ExportPopoverProps> = ({
	exportData,
}: ExportPopoverProps) => {
	return (
		<Tooltip
			trigger={
				<Popover trigger={<IconButton icon="download"></IconButton>}>
					<div className="flex flex-col min-w-20">
						<div
							className="h-8.5 flex gap-x-2 px-2 items-center justify-between hover:bg-main-hover cursor-pointer"
							onClick={() => exportData()}
						>
							<FileBracesIcon size={18}></FileBracesIcon>
							<span>JSON</span>
						</div>
					</div>
				</Popover>
			}
		>
			Export
		</Tooltip>
	);
};

export default React.memo(ExportPopover);
