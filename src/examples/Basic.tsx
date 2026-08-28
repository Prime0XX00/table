import Table from "../table/Table";
import { rows } from "./data";
import { type Article } from "./types";

function Basic(): React.JSX.Element {
	return (
		<>
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
