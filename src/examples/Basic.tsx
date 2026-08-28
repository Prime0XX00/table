import Table from "../table/Table";
import { rows } from "./data";
import { type Article } from "./types";

function Basic(): React.JSX.Element {
	return (
		<>
			<p className="px-10">
				Standard-Einstellungen des Grids. <br></br>
				Die Daten werden einfach nur angezeigt, wie sie der Komponente
				übergeben wurden. <br></br>
			</p>
			<div className="min-w-100 w-fit px-10 max-w-screen">
				<Table<Article>
					title="Basic Grid"
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
						},
						{
							field: "active",
							title: "Aktiv",
							dataType: "boolean",
						},
						{
							field: "date",
							title: "Datum",
							dataType: "date",
						},
					]}
				></Table>
			</div>
		</>
	);
}

export default Basic;
