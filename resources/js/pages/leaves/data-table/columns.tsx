'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ActionsDropdown } from '@/pages/employees/components/actions-dropdown';

export type Leave = {
    id: number;
    employee_id: number;
    employee_name: string;
    leave_type: string;
    start_date: string;
    end_date: string;
    status: 'pending' | 'approved' | 'rejected';
    reason: string | null;
};

type LeaveColumnsOptions = {
    onEdit?: (leave: Leave) => void;
    onDelete?: (leave: Leave) => void;
};

export function createLeaveColumns(
    options?: LeaveColumnsOptions
): ColumnDef<Leave>[] {
    const { onEdit, onDelete } = options ?? {};

    const sortableHeader = (label: string) =>
        function SortableHeader({
            column,
        }: {
            column: {
                getIsSorted: () => string | false;
                toggleSorting: (asc: boolean) => void;
            };
        }) {
            return (
                <Button
                    variant="ghost"
                    className="-ml-4 h-8 hover:bg-transparent"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    {label}
                    <ArrowUpDown className="ml-2 size-4" />
                </Button>
            );
        };

    const statusVariant = (
        status: string
    ): 'default' | 'secondary' | 'destructive' | 'outline' => {
        switch (status) {
            case 'approved':
                return 'default';
            case 'rejected':
                return 'destructive';
            default:
                return 'secondary';
        }
    };

    return [
        {
            accessorKey: 'employee_name',
            header: sortableHeader('Employee'),
        },
        {
            accessorKey: 'leave_type',
            header: sortableHeader('Leave Type'),
        },
        {
            accessorKey: 'start_date',
            header: sortableHeader('Start Date'),
            cell: ({ row }) => {
                const date = row.getValue('start_date') as string;
                return new Date(date).toLocaleDateString();
            },
        },
        {
            accessorKey: 'end_date',
            header: sortableHeader('End Date'),
            cell: ({ row }) => {
                const date = row.getValue('end_date') as string;
                return new Date(date).toLocaleDateString();
            },
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.getValue('status') as string;
                return (
                    <Badge variant={statusVariant(status)}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Badge>
                );
            },
        },
        {
            accessorKey: 'reason',
            header: 'Reason',
            cell: ({ row }) => (
                <span className="max-w-[200px] truncate text-neutral-700 dark:text-neutral-300">
                    {(row.getValue('reason') as string) || '-'}
                </span>
            ),
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const leave = row.original;
                return (
                    <ActionsDropdown
                        onEdit={onEdit ? () => onEdit(leave) : undefined}
                        onDelete={onDelete ? () => onDelete(leave) : undefined}
                        showView={false}
                    />
                );
            },
        },
    ];
}
