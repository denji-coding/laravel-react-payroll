'use client';

import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    ScheduleDailyGrid,
    DEFAULT_DAY_SCHEDULES,
    type DaySchedule,
} from './schedule-daily-grid';
import type { Schedule } from '@/pages/time-schedule/data-table/columns';

type EmployeeOption = { id: number; employee_id: string; name: string };

export type EditTimeScheduleFormData = {
    employee_id: number;
    days: DaySchedule[];
};

type EditTimeScheduleProps = {
    schedule: Schedule | null;
    employees: EmployeeOption[];
    onCancel?: () => void;
    onSubmit?: (data: EditTimeScheduleFormData) => void | Promise<void>;
};

function scheduleToDays(schedule: Schedule): DaySchedule[] {
    const dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
    const dutyDays = new Set(schedule.duty_days);
    const [morningStart, morningEnd] = schedule.morning.includes('-')
        ? schedule.morning.split('-').map((s) => s.trim())
        : ['08:00', '12:00'];
    const [afternoonStart, afternoonEnd] = schedule.afternoon.includes('-')
        ? schedule.afternoon.split('-').map((s) => s.trim())
        : ['13:00', '17:00'];

    return dayOrder.map((day) => ({
        day,
        duty: dutyDays.has(day),
        am_in: morningStart,
        am_out: morningEnd,
        pm_in: afternoonStart,
        pm_out: afternoonEnd,
    }));
}

export function EditTimeSchedule({
    schedule,
    employees,
    onCancel,
    onSubmit,
}: EditTimeScheduleProps) {
    const [employeeId, setEmployeeId] = useState<string>('');
    const [days, setDays] = useState<DaySchedule[]>(() => [...DEFAULT_DAY_SCHEDULES]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (schedule) {
            const emp = employees.find((e) => e.employee_id === schedule.employee_id);
            if (emp) setEmployeeId(String(emp.id));
            setDays(scheduleToDays(schedule));
        }
    }, [schedule, employees]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!onSubmit || isSubmitting || !employeeId) return;
        setIsSubmitting(true);
        try {
            await onSubmit({
                employee_id: Number(employeeId),
                days,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!schedule) return null;

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 rounded-xl bg-neutral-50/80 p-6 dark:bg-neutral-900/40"
        >
            <div className="space-y-2">
                <Label htmlFor="employee">Employee</Label>
                <div
                    id="employee"
                    className="flex h-9 w-full items-center rounded-md border-2 border-primary/40 bg-neutral-100 px-3 py-2 text-sm font-medium text-foreground dark:bg-neutral-800 dark:text-foreground"
                >
                    {schedule.name} ({schedule.employee_id})
                </div>
            </div>

            <ScheduleDailyGrid days={days} onChange={setDays} />

            <div className="flex justify-end gap-2">
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
                <Button
                    type="submit"
                    disabled={isSubmitting || !employeeId}
                    className="bg-[#1f5c35] text-white hover:bg-[#1f5c35]/90"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 size-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        'Save Schedule'
                    )}
                </Button>
            </div>
        </form>
    );
}
