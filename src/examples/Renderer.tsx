import Checkbox from "../table/Checkbox";
import Table from "../table/Table";
import { rows } from "./data";
import type { Article } from "./types";

function Renderer(): React.JSX.Element {
	return (
		<>
			<p className="px-10">
				Visuelle Darstellung der Werte. <br></br>
				Einzelne Spalten können eine Render-Funktion nutzen, um eigene
				React-Komponenten oder Nodes zu rendern, statt der eigentlichen
				Daten. <br></br>
			</p>
			<div className="min-w-100 w-fit px-10 max-w-screen">
				<Table<Article>
					title="Artikeldaten"
					rows={rows}
					columns={[
						{
							field: "id",
							title: "ID",
							dataType: "number",
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
		</>
	);
}

export default Renderer;
