import Basic from "./examples/Basic";
import Renderer from "./examples/Renderer";

function App() {
	return (
		<div className="py-10 flex flex-col gap-y-10 min-h-screen">
			<Basic></Basic>
			<Renderer></Renderer>
		</div>
	);
}

export default App;
