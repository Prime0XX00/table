interface ExampleBoxProps {
	description: React.ReactNode;
	children: React.ReactNode;
}

function ExampleBox({ ...props }: ExampleBoxProps): React.JSX.Element {
	return (
		<div className="min-w-100 w-fit max-w-screen flex flex-col gap-y-2 px-10">
			<div className="bg-slate-100 rounded-md p-2">
				{props.description}
			</div>
			{props.children}
		</div>
	);
}

export default ExampleBox;
