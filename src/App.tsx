import Table from "./table/Table";

type Article = {
	id: number;
	data: number;
	percent: string;
};

const rows: Article[] = Array.from({ length: 3456 }).map((_, index) => ({
	id: index,
	data: Number((100 * Math.random()).toFixed(2)),
	percent: (100 * Math.random()).toFixed(2),
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
						isSortable: true,
					},
					{
						field: "data",
						title: "Daten",
						isSortable: true,
						isPinned: true,
					},
					{
						field: "percent",
						title: "Fortschritt",
						isSortable: true,
						initialWidth: 300,
						render: (value) => (
							<div className="relative bg-slate-200 rounded-full h-2 w-full overflow-hidden">
								<div
									className="absolute left-0 top-0 h-full bg-blue-600"
									style={{ width: value + "%" }}
								></div>
							</div>
						),
					},
				]}
			></Table>
		</div>
	);
}

export default App;
