import Table from "./table/Table";
import Checkbox from "./table/Checkbox";
import { type Article } from "./examples/types";
import Basic from "./examples/Basic";
import { rows } from "./examples/data";

function App() {
	return (
		<div className="py-10 flex flex-col gap-y-10 min-h-screen">
			<Basic></Basic>
			<div className="min-w-100 w-fit px-10 max-w-screen">
				<Table<Article>
					title="Artikeldaten"
					rows={rows}
					rowsPerPageOptions={[
						{
							value: 5,
							display: "5",
						},
					]}
					columns={[
						{
							field: "id",
							title: "ID",
							dataType: "number",
							isPinned: true,
						},
						{
							field: "data",
							title: "Daten",
							dataType: "number",
						},
						{
							field: "status",
							title: "Status",
							dataType: "string",
						},
						{
							field: "percent",
							title: "Fortschritt",
							dataType: "number",
							initialWidth: 250,
							render: (value) => (
								<div className="relative bg-main-hover rounded-full h-2 w-full overflow-hidden">
									<div
										className="absolute left-0 top-0 h-full bg-accent"
										style={{ width: value + "%" }}
									></div>
								</div>
							),
						},
						{
							field: "active",
							title: "Aktiv",
							dataType: "boolean",
							render: (value) => (
								<Checkbox
									checked={Boolean(value)}
									readonly
								></Checkbox>
							),
						},
						{
							field: "date",
							title: "Datum",
							dataType: "date",
							render: (rawDate) => {
								return rawDate.toLocaleString();
							},
						},
					]}
				></Table>
			</div>
		</div>
	);
}

export default App;
