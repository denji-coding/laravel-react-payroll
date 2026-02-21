'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ActionsDropdown } from '@/pages/employees/components/actions-dropdown';
import { StatusDropdown } from '@/pages/employees/components/status-dropdown';
import type { EmployeeStatus } from '@/pages/employees/components/status-dropdown';

export type Employee = {
    id: number;
    employee_id: string;
    name: string;
    position: string;
    branch: string;
    status: EmployeeStatus;
};

type EmployeeColumnsOptions = {
    statusFilter: 'all' | 'active' | 'inactive' | 'deleted';
    onEdit: (employee: Employee) => void;
    onView: (employee: Employee) => void;
    onDelete: (employee: Employee) => void;
    onRestore?: (employee: Employee) => void;
    onStatusChange: (employee: Employee, newStatus: EmployeeStatus) => void;
};

export function createEmployeeColumns(
    options: EmployeeColumnsOptions
): ColumnDef<Employee>[] {
    const {
        statusFilter,
        onEdit,
        onView,
        onDelete,
        onRestore,
        onStatusChange,
    } = options;

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
        },
        {
            accessorKey: 'name',
            header: sortableHeader('Name'),
        },
        {
            accessorKey: 'position',
            header: sortableHeader('Position'),
        },
        {
            accessorKey: 'branch',
            header: sortableHeader('Branch'),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const employee = row.original;
                if (
                    statusFilter === 'deleted' ||
                    (statusFilter === 'all' && employee.status === 'deleted')
                ) {
                    return (
                        <Badge
                            variant="secondary"
                            className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        >
                            {employee.status}
                        </Badge>
                    );
                }
                return (
                    <StatusDropdown
                        value={employee.status}
                        onStatusChange={(newStatus) =>
                            onStatusChange(employee, newStatus)
                        }
                        options={
                            statusFilter === 'active' ||
                            (statusFilter === 'all' &&
                                employee.status === 'active')
                                ? ['inactive']
                                : ['active']
                        }
                    />
                );
            },
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const employee = row.original;
                return (
                    <ActionsDropdown
                        onEdit={() => onEdit(employee)}
                        onView={() => onView(employee)}
                        onDelete={() => onDelete(employee)}
                        onRestore={
                            statusFilter === 'deleted' ||
                            (statusFilter === 'all' &&
                                employee.status === 'deleted')
                                ? () => onRestore?.(employee)
                                : undefined
                        }
                        showRestore={
                            statusFilter === 'deleted' ||
                            (statusFilter === 'all' &&
                                employee.status === 'deleted')
                        }
                    />
                );
            },
        },
    ];
}

/** @deprecated Use createEmployeeColumns(options) instead. Kept for backward compatibility. */
export const columns: ColumnDef<Employee>[] = [];
