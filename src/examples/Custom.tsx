import Checkbox from "../table/Checkbox";
import Table from "../table/Table";
import { rows } from "./data";
import type { Article } from "./types";

function Custom(): React.JSX.Element {
	return (
		<>
			<p className="px-10">
				In diesem Beispiel wurden der Aktivitätsstatus, der Lagerstatus,
				der Fortschritt und das Datum mit einer Render-Funktion
				versehen, um den Inhalt individuell zu gestalten und eine Node
				statt der eigentlichen Daten anzuzeigen.
				<br></br>
				Die Breiten einiger Spalten wurden zudem veändert.
				<br></br>
				Außerdem wurde das Produkt und der Aktivitätsstatus links
				angepinnt. Wenn die Tabelle breit genug ist und der Inhalt
				scrollbar wird, sind diese Spalten immer links sichtbar.
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
				></Table>
			</div>
		</>
	);
}

export default Custom;
