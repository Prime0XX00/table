import Checkbox from "../table/Checkbox";
import Table from "../table/Table";
import { rows } from "./data";
import type { Article } from "./types";

function InitState(): React.JSX.Element {
	return (
		<>
			<p className="px-10">
				Test
				<br></br>
			</p>
			<div className="min-w-100 w-fit px-10 max-w-screen">
				<Table<Article>
					title="Custom Grid"
					rows={rows}
					columns={[
						{
							field: "title",
							title: "Titel",
							dataType: "string",
							isPinned: true,
							initialWidth: 100,
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
							render: (value) => (
								<div className="bg-accent/10 rounded-full px-2 w-fit h-fit">
									{String(value)}
								</div>
							),
						},
						{
							field: "percent",
							title: "Fortschritt",
							dataType: "number",
							render: (value) => (
								<div className="relative bg-main-hover rounded-full h-2 w-full overflow-hidden">
									<div
										className="absolute left-0 top-0 h-full bg-accent"
										style={{ width: value + "%" }}
									></div>
								</div>
							),
							initialWidth: 360,
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
							isPinned: true,
							initialWidth: 100,
						},
						{
							field: "date",
							title: "Datum",
							dataType: "date",
							render: (rawDate) => {
								return rawDate.toLocaleString();
							},
							initialWidth: 200,
						},
						{
							field: "carrier",
							title: "Spedition",
							dataType: "string",
						},
					]}
					initialState={{
						sorting: {
							field: "title",
							direction: "desc",
						},
					}}
				></Table>
			</div>
		</>
	);
}

export default InitState;
