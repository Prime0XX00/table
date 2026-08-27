import { FileBracesIcon } from "lucide-react";
import IconButton from "../IconButton";
import Popover, { usePopoverClose } from "../Popover";
import React from "react";
import Tooltip from "../Tooltip";

interface ExportPopoverProps {
	exportData: () => void;
}

function PopoverContent({ ...props }: ExportPopoverProps) {
	const closePopover = usePopoverClose();

	const handleExportJSON = () => {
		props.exportData();
		closePopover?.();
	};

	return (
		<div className="flex flex-col min-w-20">
			<div
				className="h-popover-row flex gap-x-2 px-2 items-center justify-between hover:bg-main-hover cursor-pointer"
				onClick={handleExportJSON}
			>
				<FileBracesIcon size={18}></FileBracesIcon>
				<span>JSON</span>
			</div>
		</div>
	);
}

function ExportPopover({ ...props }: ExportPopoverProps) {
	return (
		<Tooltip
			trigger={
				<Popover trigger={<IconButton icon="download"></IconButton>}>
					<PopoverContent {...props}></PopoverContent>
				</Popover>
			}
		>
			Export
		</Tooltip>
	);
}

export default React.memo(ExportPopover);
