interface TextBoxProps {
	children: React.ReactNode;
}

function TextBox({ ...props }: TextBoxProps): React.JSX.Element {
	return (
		<div className="bg-slate-100 rounded-md p-2 mx-10">
			{props.children}
		</div>
	);
}

export default TextBox;
