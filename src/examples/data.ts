import type { Article } from "./types";

const status = [
	"Ausgeliefert",
	"Unterwegs",
	"Lager",
	"Entladepuffer",
	"Reparatur",
	"Unbekannt",
];

const carrier = ["Hermes", "DHL"];

export const rows: Article[] = Array.from({ length: 10000 }).map(
	(_, index) => ({
		id: index,
		title: "Produkt " + (index + 1),
		data: Number((100 * Math.random()).toFixed(2)),
		percent: Number((100 * Math.random()).toFixed(2)),
		status: status[Math.ceil(Math.random() * status.length) - 1],
		active: index % 3 == 0,
		date: new Date(new Date().valueOf() - Math.random() * 1e12),
		carrier: carrier[Math.ceil(Math.random() * carrier.length) - 1],
	}),
);
