import Table from "../table/Table";
import { rows } from "./data";
import { type Article } from "./types";

function Basic(): React.JSX.Element {
	return (
		<Table<Article>
			title="Basic Grid"
			rows={rows}
			columns={[
				{
					field: "title",
					title: "Titel",
					dataType: "string",
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
	);
}

export default Basic;
