'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export type AttendanceRecord = {
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

export function createAttendanceColumns(): ColumnDef<AttendanceRecord>[] {
    return [
        {
            id: 'no',
            accessorKey: 'no',
            header: 'No.',
            cell: ({ row }) => (
                <span className="text-neutral-700 dark:text-neutral-300">
                    {row.getValue('no')}
                </span>
            ),
        },
        {
            id: 'photo',
            accessorKey: 'photo_url',
            header: 'Photo',
            cell: ({ row }) => {
                const record = row.original;
                const initials = record.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);
                return (
                    <Avatar className="size-9">
                        <AvatarImage src={record.photo_url ?? undefined} alt={record.name} />
                        <AvatarFallback className="bg-neutral-200 text-xs text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                );
            },
        },
        {
            accessorKey: 'employee_id',
            header: 'Employee ID',
            cell: ({ row }) => (
                <span className="font-medium text-neutral-900 dark:text-neutral-100">
                    {row.getValue('employee_id')}
                </span>
            ),
        },
        {
            accessorKey: 'name',
            header: 'Full Name',
            cell: ({ row }) => (
                <span className="text-neutral-700 dark:text-neutral-300">
                    {row.getValue('name')}
                </span>
            ),
        },
        {
            accessorKey: 'position',
            header: 'Position',
            cell: ({ row }) => (
                <span className="text-neutral-700 dark:text-neutral-300">
                    {row.getValue('position')}
                </span>
            ),
        },
        {
            accessorKey: 'morning_in',
            header: 'Morning In',
            cell: ({ row }) => (
                <span className="text-neutral-600 dark:text-neutral-400">
                    {row.getValue('morning_in') ?? '-'}
                </span>
            ),
        },
        {
            accessorKey: 'morning_out',
            header: 'Morning Out',
            cell: ({ row }) => (
                <span className="text-neutral-600 dark:text-neutral-400">
                    {row.getValue('morning_out') ?? '-'}
                </span>
            ),
        },
        {
            accessorKey: 'afternoon_in',
            header: 'Afternoon In',
            cell: ({ row }) => (
                <span className="text-neutral-600 dark:text-neutral-400">
                    {row.getValue('afternoon_in') ?? '-'}
                </span>
            ),
        },
        {
            accessorKey: 'afternoon_out',
            header: 'Afternoon Out',
            cell: ({ row }) => (
                <span className="text-neutral-600 dark:text-neutral-400">
                    {row.getValue('afternoon_out') ?? '-'}
                </span>
            ),
        },
    ];
}
