'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ActionsDropdown } from '@/pages/employees/components/actions-dropdown';
import { cn } from '@/lib/utils';

export type Schedule = {
    id: number;
    employee_id: string;
    name: string;
    duty_days: string[];
    morning: string;
    afternoon: string;
};

type ScheduleColumnsOptions = {
    onEdit?: (schedule: Schedule) => void;
    onDelete?: (schedule: Schedule) => void;
};

export function createScheduleColumns(
    options?: ScheduleColumnsOptions
): ColumnDef<Schedule>[] {
    const { onEdit, onDelete } = options ?? {};

    const sortableHeader = (label: string) =>
        function SortableHeader({
            column,
        }: {
            column: { getIsSorted: () => string | false; toggleSorting: (asc: boolean) => void };
        }) {
            return (
                <Button
                    variant="ghost"
                    className="-ml-4 h-8 hover:bg-transparent"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    {label}
                    <ArrowUpDown className="ml-2 size-4" />
                </Button>
            );
        };

    return [
        {
            accessorKey: 'employee_id',
            header: sortableHeader('Employee ID'),
            cell: ({ row }) => (
                <span className="font-medium text-foreground">
                    {row.getValue('employee_id')}
                </span>
            ),
        },
        {
            accessorKey: 'name',
            header: sortableHeader('Name'),
            cell: ({ row }) => (
                <span className="text-foreground">{row.getValue('name')}</span>
            ),
        },
        {
            accessorKey: 'duty_days',
            header: 'Duty Days',
            cell: ({ row }) => {
                const days = row.original.duty_days;
                return (
                    <div className="flex flex-wrap gap-1">
                        {days.map((day) => (
                            <Badge
                                key={day}
                                variant="secondary"
                                className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-normal text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                            >
                                {day}
                            </Badge>
                        ))}
                    </div>
                );
            },
        },
        {
            accessorKey: 'morning',
            header: 'Morning',
            cell: ({ row }) => {
                const morning = row.original.morning;
                return (
                    <Badge
                        variant="outline"
                        className={cn(
                            'gap-1 rounded-md border-primary/40 bg-primary/5 px-2 py-0.5 text-xs font-normal text-primary',
                            'dark:border-primary/60 dark:bg-primary/10 dark:text-primary'
                        )}
                    >
                        <Clock className="size-3 shrink-0" />
                        {morning}
                    </Badge>
                );
            },
        },
        {
            accessorKey: 'afternoon',
            header: 'Afternoon',
            cell: ({ row }) => {
                const afternoon = row.original.afternoon;
                return (
                    <Badge
                        variant="outline"
                        className={cn(
                            'gap-1 rounded-md border-primary/40 bg-primary/5 px-2 py-0.5 text-xs font-normal text-primary',
                            'dark:border-primary/60 dark:bg-primary/10 dark:text-primary'
                        )}
                    >
                        <Clock className="size-3 shrink-0" />
                        {afternoon}
                    </Badge>
                );
            },
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const schedule = row.original;
                return (
                    <ActionsDropdown
                        onEdit={onEdit ? () => onEdit(schedule) : undefined}
                        onDelete={onDelete ? () => onDelete(schedule) : undefined}
                        showView={false}
                    />
                );
            },
        },
    ];
}
