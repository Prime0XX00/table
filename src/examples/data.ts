import type { Article } from "./types";

const status = [
	"Ausgeliefert",
	"Unterwegs",
	"Lager",
	"Entladepuffer",
	"Reparatur",
	"Unbekannt",
];

export const rows: Article[] = Array.from({ length: 10000 }).map(
	(_, index) => ({
		id: index,
		data: Number((100 * Math.random()).toFixed(2)),
		percent: Number((100 * Math.random()).toFixed(2)),
		status: status[Math.ceil(Math.random() * 6) - 1],
		active: index % 3 == 0,
		date: new Date(new Date().valueOf() - Math.random() * 1e12),
	}),
);
