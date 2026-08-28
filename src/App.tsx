import Basic from "./examples/Basic";
import Custom from "./examples/Custom";
import InitState from "./examples/InitState";

function App() {
	return (
		<div className="py-10 flex flex-col gap-y-10 min-h-screen">
			<Basic></Basic>
			<Custom></Custom>
			<InitState></InitState>
		</div>
	);
}

export default App;
