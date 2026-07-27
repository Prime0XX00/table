import Table from "./table/Table";
import Checkbox from "./table/Checkbox";

type Article = {
	id: number;
	data: number;
	percent: number;
	status: string;
	active: boolean;
	date: Date;
};

const status = [
	"Ausgeliefert",
	"Unterwegs",
	"Lager",
	"Entladepuffer",
	"Reparatur",
	"Unbekannt",
];

const rows: Article[] = Array.from({ length: 3456 }).map((_, index) => ({
	id: index,
	data: Number((100 * Math.random()).toFixed(2)),
	percent: Number((100 * Math.random()).toFixed(2)),
	status: status[Math.ceil(Math.random() * 6) - 1],
	active: index % 3 == 0,
	date: new Date(new Date().valueOf() - Math.random() * 1e12),
}));

function App() {
	return (
		<div className="p-10 flex flex-col gap-y-10 h-screen">
			<Table<Article>
				title="Artikeldaten"
				rows={rows}
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
							<div className="relative bg-slate-200 rounded-full h-2 w-full overflow-hidden">
								<div
									className="absolute left-0 top-0 h-full bg-blue-600"
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
	);
}

export default App;
