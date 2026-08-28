import TextBox from "./TextBox";

interface ExampleBoxProps {
	description: React.ReactNode;
	children: React.ReactNode;
}

function ExampleBox({ ...props }: ExampleBoxProps): React.JSX.Element {
	return (
		<div className="flex flex-col gap-y-2">
			<TextBox>{props.description}</TextBox>
			<div className="min-w-100 w-fit max-w-screen px-10">
				{props.children}
			</div>
		</div>
	);
}

export default ExampleBox;
