'use client';

import { Head, router } from '@inertiajs/react';
import { Calendar as CalendarIcon, CalendarCheck, Download } from 'lucide-react';
import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import AppLayout from '@/layouts/app-layout';
import { attendance } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { createAttendanceColumns, type AttendanceRecord } from './data-table/columns';
import { DataTable } from '@/pages/leaves/data-table/data-table';

const inputClassName =
    'rounded-md border border-neutral-200 bg-white ring-offset-2 outline-none focus-visible:border-text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring dark:border-neutral-800 dark:bg-neutral-950';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Attendance',
        href: attendance().url,
    },
];

type AttendanceRecordServer = {
    id: number;
    no: number;
    employee_id: string;
    name: string;
    position: string;
    photo_url?: string | null;
    morning_in?: string | null;
    morning_out?: string | null;
    afternoon_in?: string | null;
    afternoon_out?: string | null;
};

type AttendancePageProps = {
    attendances?: AttendanceRecordServer[];
    summary?: { present: number; late: number; absent: number; onLeave: number };
    date?: string;
};

export default function Attendance({ attendances: attendancesData, summary: summaryData, date: dateProp }: AttendancePageProps) {
    const summary = summaryData ?? { present: 0, late: 0, absent: 0, onLeave: 0 };
    const [date, setDate] = useState<Date>(() => (dateProp ? new Date(dateProp) : new Date()));
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const attendanceColumns = useMemo(() => createAttendanceColumns(), []);

    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (!selectedDate) return;
        setDate(selectedDate);
        setDatePickerOpen(false);
        router.get(attendance().url, { date: format(selectedDate, 'yyyy-MM-dd') }, { preserveState: false });
    };

    const handleExport = () => {
        router.get(attendance().url, { date: format(date, 'yyyy-MM-dd'), export: '1' }, { preserveState: false });
    };
    const data: AttendanceRecord[] = useMemo(
        () =>
            (attendancesData ?? []).map((a, index) => ({
                id: a.id,
                no: a.no ?? index + 1,
                employee_id: a.employee_id,
                name: a.name,
                position: a.position,
                photo_url: a.photo_url,
                morning_in: a.morning_in,
                morning_out: a.morning_out,
                afternoon_in: a.afternoon_in,
                afternoon_out: a.afternoon_out,
            })),
        [attendancesData]
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Attendance" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-3">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <Card className="rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-800">
                        <CardContent className="flex flex-col items-center justify-center p-4">
                            <p className="text-sm font-medium text-muted-foreground">Present</p>
                            <p className="text-2xl font-bold text-emerald-600">{summary.present}</p>
                        </CardContent>
                    </Card>
                    <Card className="rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-800">
                        <CardContent className="flex flex-col items-center justify-center p-4">
                            <p className="text-sm font-medium text-muted-foreground">Late</p>
                            <p className="text-2xl font-bold text-amber-500">{summary.late}</p>
                        </CardContent>
                    </Card>
                    <Card className="rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-800">
                        <CardContent className="flex flex-col items-center justify-center p-4">
                            <p className="text-sm font-medium text-muted-foreground">Absent</p>
                            <p className="text-2xl font-bold text-red-500">{summary.absent}</p>
                        </CardContent>
                    </Card>
                    <Card className="rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-800">
                        <CardContent className="flex flex-col items-center justify-center p-4">
                            <p className="text-sm font-medium text-muted-foreground">On Leave</p>
                            <p className="text-2xl font-bold text-blue-500">{summary.onLeave}</p>
                        </CardContent>
                    </Card>
                </div>
                <Card className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800">
                    <CardContent className="p-0">
                            <div className="flex flex-wrap items-center justify-between gap-4 -mt-6 border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-md border-2 border-primary p-2 text-primary dark:bg-primary/20">
                                        <CalendarCheck className="size-8" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold tracking-tight text-primary">Attendance</h2>
                                        <p className="text-sm text-muted-foreground">
                                            View and manage employee attendance records.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                inputClassName,
                                                'h-9 justify-start text-left font-normal cursor-pointer border-primary text-primary hover:bg-primary hover:text-primary-foreground data-[state=open]:bg-primary data-[state=open]:text-primary-foreground data-[state=open]:ring-2 data-[state=open]:ring-primary'
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 size-4" />
                                            {format(date, 'MMMM d, yyyy')}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            captionLayout="dropdown"
                                            selected={date}
                                            onSelect={handleDateSelect}
                                            initialFocus
                                            className="rounded-lg border"
                                        />
                                    </PopoverContent>
                                </Popover>
                                <Button variant="outline" size="sm" className="bg-primary text-white hover:bg-transparent hover:text-primary cursor-pointer" onClick={handleExport}>
                                    <Download className="mr-2 size-4" />
                                    Export
                                </Button>
                                </div>
                            </div>
                            <div className="p-4 pt-0">
                                <DataTable
                                    columns={attendanceColumns}
                                    data={data}
                                    filterColumn="name"
                                    filterPlaceholder="Filter by employee..."
                                />
                            </div>
                        
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
