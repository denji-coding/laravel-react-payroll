'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ActionsDropdown } from '@/pages/employees/components/actions-dropdown';
import { StatusDropdown } from '@/pages/employees/components/status-dropdown';
import type { EmployeeStatus } from '@/pages/employees/components/status-dropdown';

export type Position = {
    id: number;
    name: string;
    description: string;
    status: 'active' | 'inactive';
};

type PositionColumnsOptions = {
    onEdit?: (position: Position) => void;
    onDelete?: (position: Position) => void;
    onStatusChange?: (position: Position, status: 'active' | 'inactive') => void;
};

export function createPositionColumns(
    options?: PositionColumnsOptions
): ColumnDef<Position>[] {
    const { onEdit, onDelete, onStatusChange } = options ?? {};

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
            accessorKey: 'name',
            header: sortableHeader('Position Name'),
        },
        {
            accessorKey: 'description',
            header: 'Description',
            cell: ({ row }) => (
                <span className="text-neutral-700 dark:text-neutral-300">
                    {row.getValue('description') || '-'}
                </span>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const position = row.original;
                return (
                    <StatusDropdown
                        value={position.status as EmployeeStatus}
                        onStatusChange={(newStatus) =>
                            onStatusChange?.(position, newStatus as 'active' | 'inactive')
                        }
                        options={
                            position.status === 'active' ? ['inactive'] : ['active']
                        }
                    />
                );
            },
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const position = row.original;
                return (
                    <ActionsDropdown
                        onEdit={onEdit ? () => onEdit(position) : undefined}
                        onDelete={onDelete ? () => onDelete(position) : undefined}
                        showView={false}
                    />
                );
            },
        },
    ];
}
