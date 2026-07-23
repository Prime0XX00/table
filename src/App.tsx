import { CheckIcon, XIcon } from "lucide-react";
import Table from "./table/Table";

type Article = {
	id: number;
	data: number;
	percent: number;
	status: string;
	active: boolean;
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
							<div
								className={`${value ? "bg-green-600/15 text-green-600" : "bg-red-600/15 text-red-600"} p-1 rounded-lg w-fit`}
							>
								{value ? (
									<CheckIcon size={18}></CheckIcon>
								) : (
									<XIcon size={18}></XIcon>
								)}
							</div>
						),
					},
				]}
			></Table>
		</div>
	);
}

export default App;
