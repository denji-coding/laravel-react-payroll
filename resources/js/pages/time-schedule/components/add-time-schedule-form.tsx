'use client';

import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    ScheduleDailyGrid,
    DEFAULT_DAY_SCHEDULES,
    type DaySchedule,
} from './schedule-daily-grid';

type EmployeeOption = { id: number; employee_id: string; name: string };

export type AddTimeScheduleFormData = {
    employee_id: number;
    days: DaySchedule[];
};

type AddTimeScheduleFormProps = {
    employees: EmployeeOption[];
    onCancel?: () => void;
    onSubmit?: (data: AddTimeScheduleFormData) => void | Promise<void>;
};

export function AddTimeScheduleForm({
    employees,
    onCancel,
    onSubmit,
}: AddTimeScheduleFormProps) {
    const [employeeId, setEmployeeId] = useState<string>('');
    const [days, setDays] = useState<DaySchedule[]>(() => [...DEFAULT_DAY_SCHEDULES]);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 rounded-xl bg-neutral-50/80 p-6 dark:bg-neutral-900/40"
        >
            <div className="space-y-2">
                <Label htmlFor="employee">Select Employee </Label> <span className="text-red-500">*</span>
                <Select
                    value={employeeId}
                    onValueChange={setEmployeeId}
                    disabled={employees.length === 0}
                >
                    <SelectTrigger
                        id="employee"
                        className="rounded-md border-2 border-primary/40 bg-white dark:border-primary/60 dark:bg-neutral-950"
                    >
                        <SelectValue placeholder="Choose an employee..." />
                    </SelectTrigger>
                    <SelectContent>
                        {employees.map((emp) => (
                            <SelectItem
                                key={emp.id}
                                value={String(emp.id)}
                                className="cursor-pointer"
                            >
                                {emp.name} ({emp.employee_id})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div
                className={cn(
                    'transition-opacity',
                    !employeeId && 'cursor-not-allowed opacity-50'
                )}
                onClick={!employeeId ? (e) => e.preventDefault() : undefined}
                onPointerDown={!employeeId ? (e) => e.preventDefault() : undefined}
            >
                <div
                    className={cn(!employeeId && 'pointer-events-none')}
                    aria-disabled={!employeeId}
                >
                    <ScheduleDailyGrid days={days} onChange={setDays} />
                </div>
            </div>

            <div
                className={cn(
                    'flex justify-end gap-2 transition-opacity',
                    !employeeId && 'cursor-not-allowed opacity-50'
                )}
            >
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
                            Adding...
                        </>
                    ) : (
                        'Add Schedule'
                    )}
                </Button>
            </div>
        </form>
    );
}
