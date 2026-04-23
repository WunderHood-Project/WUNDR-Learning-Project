"use client";

import { useMemo, useState } from "react";
import {
    addDays, addMonths, endOfMonth, endOfWeek, format, isSameMonth, isToday,
    startOfMonth, startOfWeek, startOfDay,
} from "date-fns";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";

export type ProgramForCalendar = {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    sessionSchedule?: string | null;
};

type Props = { programs: ProgramForCalendar[]; onPick: (programId: string) => void };

type DayCell = { date: Date; inMonth: boolean };

const MONTH = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
];

export default function ProgramCalendar({ programs, onPick }: Props) {
    const [cursor, setCursor] = useState(new Date());
    const monthStart = startOfMonth(cursor);
    const monthEnd   = endOfMonth(cursor);
    const gridStart  = startOfWeek(monthStart, { weekStartsOn: 0 });
    const gridEnd    = endOfWeek(monthEnd,   { weekStartsOn: 0 });

    const days: DayCell[] = useMemo(() => {
        const out: DayCell[] = [];
        for (let d = gridStart; d <= gridEnd; d = addDays(d, 1)) {
            out.push({ date: d, inMonth: isSameMonth(d, monthStart) });
        }
        return out;
    }, [gridStart, gridEnd, monthStart]);

    // Build a map: "yyyy-MM-dd" → programs active on that day.
    // Weekly sessions appear every 7 days from startDate;
    // monthly sessions appear on the same day-of-month each month;
    // everything else fills every day of the range.
    const programsByDay = useMemo(() => {
        const map = new Map<string, { id: string; title: string }[]>();
        for (const p of programs ?? []) {
            if (!p?.id || !p?.name || !p?.startDate || !p?.endDate) continue;
            const start = startOfDay(new Date(p.startDate));
            const end   = startOfDay(new Date(p.endDate));
            if (isNaN(start.getTime()) || isNaN(end.getTime())) continue;

            const schedule = (p.sessionSchedule ?? "").toLowerCase();
            const isWeekly  = schedule.includes("weekly");
            const isMonthly = schedule.includes("monthly");

            const addEntry = (d: Date) => {
                const key = format(d, "yyyy-MM-dd");
                const arr = map.get(key) ?? [];
                arr.push({ id: String(p.id), title: p.name });
                map.set(key, arr);
            };

            if (isWeekly) {
                for (let d = start; d <= end; d = addDays(d, 7)) addEntry(d);
            } else if (isMonthly) {
                for (let d = start; d <= end; d = addMonths(d, 1)) addEntry(d);
            } else {
                for (let d = start; d <= end; d = addDays(d, 1)) addEntry(d);
            }
        }
        return map;
    }, [programs]);

    const goPrev  = () => setCursor(addDays(startOfMonth(cursor), -1));
    const goNext  = () => setCursor(addDays(endOfMonth(cursor), 1));
    const goToday = () => setCursor(new Date());

    const weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

    return (
        <section className="w-full">
            <div className="bg-white rounded-2xl shadow-lg border border-wondergreen/10 overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-wondersun via-wonderorange to-wondergreen" />

                {/* Header */}
                <div className="bg-gradient-to-r from-wonderbg/50 to-white border-b border-wondergreen/10 px-3 sm:px-6 py-3 md:py-4">
                    {/* md+ (tablet/desktop): Back | Month/Year + Today | Next */}
                    <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] md:items-center">
                        <div className="justify-self-start">
                            <button
                                onClick={goPrev}
                                className="inline-flex items-center gap-2 rounded-xl border border-wondergreen/20 px-4 py-2 text-wondergreen hover:bg-wonderbg hover:border-wondergreen/40 text-sm font-semibold"
                            >
                                <ChevronLeft className="h-[18px] w-[18px]" />
                                <span>Back</span>
                            </button>
                        </div>

                        <div className="justify-self-center text-center">
                            <h2 className="text-3xl font-extrabold text-wondergreen">
                                {MONTH[cursor.getMonth()]} {cursor.getFullYear()}
                            </h2>
                            <button
                                onClick={goToday}
                                className="mt-1 text-wonderleaf font-semibold text-sm hover:underline"
                            >
                                Today
                            </button>
                        </div>

                        <div className="justify-self-end">
                            <button
                                onClick={goNext}
                                className="inline-flex items-center gap-2 rounded-xl border border-wondergreen/20 px-4 py-2 text-wondergreen hover:bg-wonderbg hover:border-wondergreen/40 text-sm font-semibold"
                            >
                                <span>Next</span>
                                <ChevronRight className="h-[18px] w-[18px]" />
                            </button>
                        </div>
                    </div>

                    {/* Mobile (< md): Month/Year + ◀ Today ▶ */}
                    <div className="md:hidden">
                        <h2 className="text-center font-extrabold text-wondergreen text-lg sm:text-2xl mb-2.5">
                            {MONTH[cursor.getMonth()]} {cursor.getFullYear()}
                        </h2>

                        <div className="flex items-center justify-center gap-1.5 xs:gap-2">
                            <button
                                onClick={goPrev}
                                aria-label="Previous month"
                                className="inline-flex items-center justify-center rounded-full border-2 border-wondergreen/20 w-8 h-8 xs:w-9 xs:h-9 text-wondergreen hover:bg-wonderbg hover:border-wondergreen/40 transition-colors"
                            >
                                <ChevronLeft className="h-4 w-4 xs:h-5 xs:w-5" />
                            </button>

                            <button
                                onClick={goToday}
                                className="px-2.5 xs:px-3 py-1.5 rounded-lg border-2 border-wonderleaf bg-wonderleaf text-white font-semibold hover:bg-wonderleaf/90 transition-colors text-[11px] xs:text-xs sm:text-sm"
                            >
                                Today
                            </button>

                            <button
                                onClick={goNext}
                                aria-label="Next month"
                                className="inline-flex items-center justify-center rounded-full border-2 border-wondergreen/20 w-8 h-8 xs:w-9 xs:h-9 text-wondergreen hover:bg-wonderbg hover:border-wondergreen/40 transition-colors"
                            >
                                <ChevronRight className="h-4 w-4 xs:h-5 xs:w-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Weekday header */}
                <div className="grid grid-cols-7 text-center text-xs sm:text-sm font-semibold text-wondergreen/80 bg-wonderbg/40">
                    {weekday.map((w) => (
                        <div key={w} className="px-1 py-2 uppercase tracking-wide">{w}</div>
                    ))}
                </div>

                {/* Grid */}
                <div className="rounded-b-2xl overflow-hidden">
                    <div className="grid grid-cols-7 gap-px bg-wondergreen/10 p-px">
                        {days.map(({ date, inMonth }) => {
                            const key   = format(date, "yyyy-MM-dd");
                            const list  = programsByDay.get(key) ?? [];
                            const shown = list.slice(0, 2);
                            const more  = list.length - shown.length;

                            const handleDayClick = () => {
                                if (list.length === 1) onPick(list[0].id);
                            };

                            return (
                                <div
                                    key={key}
                                    onClick={handleDayClick}
                                    className={[
                                        "relative",
                                        "bg-white p-1 xs:p-1.5 sm:p-2.5 md:p-3",
                                        "flex flex-col border border-wondergreen/10",
                                        "min-h-[72px] xs:min-h-[40px] sm:min-h-[60px] md:min-h-[110px]",
                                        inMonth ? "" : "opacity-50 bg-wonderbg/20",
                                        list.length ? "bg-wondersun/5 cursor-pointer hover:bg-wondersun/10" : "",
                                    ].join(" ")}
                                >
                                    {/* Day number */}
                                    <div className="flex justify-end mb-1">
                                        <span
                                            className={[
                                                "inline-flex items-center justify-center rounded-full font-bold",
                                                isToday(date) ? "bg-wondergreen text-white" : "text-wondergreen",
                                                "h-5 w-5 text-[10px] xs:h-5 xs:w-5 xs:text-[11px] sm:h-6 sm:w-6 sm:text-sm md:h-7 md:w-7",
                                            ].join(" ")}
                                        >
                                            {format(date, "d")}
                                        </span>
                                    </div>

                                    {/* Program chips */}
                                    <div className="flex-1 space-y-1 xs:space-y-1.5 overflow-hidden flex flex-wrap content-start gap-0.5 xs:gap-1">
                                        {shown.map((prog) => (
                                            <button
                                                key={prog.id}
                                                onClick={(e) => { e.stopPropagation(); onPick(prog.id); }}
                                                title={prog.title}
                                                className="group inline-flex max-w-full"
                                            >
                                                <div
                                                    className="
                                                        bg-wonderorange/80 group-hover:bg-wonderorange text-white rounded
                                                        px-1 py-0.5 xs:px-1 xs:py-1 sm:px-2 sm:py-1.5 md:px-2.5 md:py-1.5
                                                        shadow-sm hover:shadow transition-all
                                                        flex items-center gap-1 md:gap-1.5 max-w-full
                                                    "
                                                >
                                                    {/* Mobile/Tablet: icon only */}
                                                    <BookOpen className="md:hidden opacity-90 shrink-0" size={12} />

                                                    {/* Desktop: program name */}
                                                    <span className="hidden md:inline truncate max-w-[12rem]">
                                                        {prog.title}
                                                    </span>
                                                </div>
                                            </button>
                                        ))}

                                        {more > 0 && (
                                            <div className="text-[8px] xs:text-[9px] sm:text-xs text-wondergreen font-semibold flex items-center">
                                                +{more}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
