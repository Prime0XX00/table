import React, { useMemo, useState } from "react";
import Popover, { usePopoverClose } from "./Popover";
import Input from "./Input";
import IconButton from "./IconButton";
import Select from "./Select";

const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

const MONTHS = [
	"Januar",
	"Februar",
	"März",
	"April",
	"Mai",
	"Juni",
	"Juli",
	"August",
	"September",
	"Oktober",
	"November",
	"Dezember",
];

function isSameDay(a: Date, b: Date): boolean {
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
}

function formatDateDefault(date: Date): string {
	const dd = String(date.getDate()).padStart(2, "0");
	const mm = String(date.getMonth() + 1).padStart(2, "0");
	return `${dd}.${mm}.${date.getFullYear()}`;
}

function getCalendarDays(year: number, month: number): Date[] {
	const firstOfMonth = new Date(year, month, 1);

	const firstWeekday = (firstOfMonth.getDay() + 6) % 7;
	const start = new Date(year, month, 1 - firstWeekday);

	return Array.from({ length: 42 }, (_, i) => {
		const day = new Date(start);
		day.setDate(start.getDate() + i);
		return day;
	});
}

interface DatePickerCalendarProps {
	viewYear: number;
	viewMonth: number;
	years: number[];
	selected: Date | null;
	onPrevMonth: () => void;
	onNextMonth: () => void;
	onSelectMonth: (month: number) => void;
	onSelectYear: (year: number) => void;
	onSelectDay: (date: Date) => void;
}

const DatePickerCalendar: React.FC<DatePickerCalendarProps> = ({
	viewYear,
	viewMonth,
	years,
	selected,
	onPrevMonth,
	onNextMonth,
	onSelectMonth,
	onSelectYear,
	onSelectDay,
}) => {
	const closePopover = usePopoverClose();

	const days = useMemo(
		() => getCalendarDays(viewYear, viewMonth),
		[viewYear, viewMonth],
	);

	function handleSelectDay(day: Date) {
		onSelectDay(day);
		closePopover?.();
	}

	return (
		<div className="min-w-72 px-3">
			<div className="flex items-center justify-between gap-x-2 mb-2">
				<IconButton
					onClick={onPrevMonth}
					icon={"chevron-left"}
				/>

				<div className="flex items-center gap-x-2">
					<Select
						value={viewMonth}
						onChange={(val) => onSelectMonth(Number(val))}
						options={MONTHS.map((month, index) => ({
							value: index,
							display: month,
						}))}
					></Select>

					<Select
						value={viewYear}
						onChange={(val) => onSelectYear(Number(val))}
						options={years.map((year) => ({
							value: year,
							display: String(year),
						}))}
					></Select>
				</div>

				<IconButton
					onClick={onNextMonth}
					icon={"chevron-right"}
				/>
			</div>

			<div className="grid grid-cols-7 gap-0.5 mb-1">
				{WEEKDAYS.map((wd) => (
					<div
						key={wd}
						className="text-xs text-text/50 text-center py-1"
					>
						{wd}
					</div>
				))}
			</div>

			<div className="grid grid-cols-7 gap-0.5 pb-1">
				{days.map((day) => {
					const isCurrentMonth = day.getMonth() === viewMonth;
					const isSelected = selected
						? isSameDay(day, selected)
						: false;

					return (
						<button
							key={day.toISOString()}
							type="button"
							onClick={() => handleSelectDay(day)}
							className={[
								"w-8.5 h-8.5 text-sm rounded-full flex items-center justify-center cursor-pointer",
								isCurrentMonth ? "text-text" : "text-text/30",
								isSelected
									? "bg-accent text-main!"
									: "hover:bg-border/40",
							].join(" ")}
						>
							{day.getDate()}
						</button>
					);
				})}
			</div>
		</div>
	);
};

export interface DatePickerProps {
	value?: Date | null;
	onChange: (date: Date) => void;
	placeholder?: string;
	minYear?: number;
	maxYear?: number;
	formatDate?: (date: Date) => string;
	disabled?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
	value = null,
	onChange,
	placeholder = "Datum wählen",
	minYear = new Date().getFullYear() - 20,
	maxYear = new Date().getFullYear() + 10,
	formatDate = formatDateDefault,
	disabled = false,
}) => {
	const today = useMemo(() => new Date(), []);

	const [viewYear, setViewYear] = useState(
		value?.getFullYear() ?? today.getFullYear(),
	);
	const [viewMonth, setViewMonth] = useState(
		value?.getMonth() ?? today.getMonth(),
	);

	const years = useMemo(() => {
		const list: number[] = [];
		for (let y = maxYear; y >= minYear; y--) list.push(y);
		return list;
	}, [minYear, maxYear]);

	function goToPrevMonth() {
		if (viewMonth === 0) {
			setViewMonth(11);
			setViewYear((y) => y - 1);
		} else {
			setViewMonth((m) => m - 1);
		}
	}

	function goToNextMonth() {
		if (viewMonth === 11) {
			setViewMonth(0);
			setViewYear((y) => y + 1);
		} else {
			setViewMonth((m) => m + 1);
		}
	}

	return (
		<Popover
			trigger={
				<Input
					readOnly
					value={value ? formatDate(value) : ""}
					placeholder={placeholder}
					disabled={disabled}
				></Input>
			}
		>
			<DatePickerCalendar
				viewYear={viewYear}
				viewMonth={viewMonth}
				years={years}
				selected={value}
				onPrevMonth={goToPrevMonth}
				onNextMonth={goToNextMonth}
				onSelectMonth={setViewMonth}
				onSelectYear={setViewYear}
				onSelectDay={onChange}
			/>
		</Popover>
	);
};

export default DatePicker;
