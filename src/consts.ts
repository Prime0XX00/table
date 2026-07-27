export const FILTER_OPERATORS = {
	number: {
		E: "=",
		NE: "!=",
		LT: "<",
		LTE: "<=",
		GT: ">",
		GTE: ">=",
	},
	boolean: {
		E: "Gleich",
	},
	string: {
		E: "Gleich",
		NE: "Ungleich",
		C: "Enthält",
		NC: "Enthält nicht",
	},
	date: {
		LT: "Vor",
		GT: "Nach",
	},
};

export const minColWidth = 120;
export const initialColWidth = 160;
