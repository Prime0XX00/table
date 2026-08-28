import Basic from "./examples/Basic";
import Custom from "./examples/Custom";

function App() {
	return (
		<div className="py-10 flex flex-col gap-y-10 min-h-screen">
			<Basic></Basic>
			<Custom></Custom>
		</div>
	);
}

export default App;
