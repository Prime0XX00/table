import IconButton from "../IconButton";
import Popover from "../Popover";

interface ExportPopoverProps {}

const ExportPopover: React.FC<ExportPopoverProps> = ({ ...props }) => {
	return (
		<Popover trigger={<IconButton icon="download"></IconButton>}>
			<div className="flex flex-col min-w-20">
				<div className="h-8.5 flex gap-x-2 px-2 items-center justify-between hover:bg-slate-100 cursor-pointer">
					JSON
				</div>
			</div>
		</Popover>
	);
};

export default ExportPopover;
