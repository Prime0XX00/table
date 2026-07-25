import {
	FileBracesIcon,
	FileSpreadsheetIcon,
	FileTextIcon,
} from "lucide-react";
import IconButton from "../IconButton";
import Popover from "../Popover";
import React from "react";

interface ExportPopoverProps {}

const ExportPopover: React.FC<ExportPopoverProps> = ({ ...props }) => {
	return (
		<Popover trigger={<IconButton icon="download"></IconButton>}>
			<div className="flex flex-col min-w-20">
				<div className="h-8.5 flex gap-x-2 px-2 items-center justify-between hover:bg-slate-100 cursor-pointer">
					<FileTextIcon size={18}></FileTextIcon>
					<span>CSV</span>
				</div>
				<div className="h-8.5 flex gap-x-2 px-2 items-center justify-between hover:bg-slate-100 cursor-pointer">
					<FileBracesIcon size={18}></FileBracesIcon>
					<span>JSON</span>
				</div>
				<div className="h-8.5 flex gap-x-2 px-2 items-center justify-between hover:bg-slate-100 cursor-pointer">
					<FileSpreadsheetIcon size={18}></FileSpreadsheetIcon>
					<span>Excel</span>
				</div>
			</div>
		</Popover>
	);
};

export default React.memo(ExportPopover);
