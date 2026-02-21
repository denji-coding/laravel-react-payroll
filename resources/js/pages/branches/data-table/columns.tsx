'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ActionsDropdown } from '@/pages/employees/components/actions-dropdown';
import { BranchStatusDropdown } from '@/pages/branches/components/branch-status-dropdown';

export type Branch = {
    id: number;
    name: string;
    manager_id?: number | null;
    manager: string;
    employees_count: number;
    contact: string;
    status: 'active' | 'inactive';
};

type BranchColumnsOptions = {
    onEdit?: (branch: Branch) => void;
    onDelete?: (branch: Branch) => void;
    onStatusChange?: (branch: Branch, newStatus: 'active' | 'inactive') => void;
};

export function createBranchColumns(
    options?: BranchColumnsOptions
): ColumnDef<Branch>[] {
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
            header: sortableHeader('Name'),
        },
        {
            accessorKey: 'manager',
            header: sortableHeader('Manager'),
        },
        {
            accessorKey: 'employees_count',
            header: 'Employees',
            cell: ({ row }) => {
                const count = row.getValue('employees_count') as number;
                return (
                    <span className="flex items-center gap-1.5">
                        <Users className="size-4 text-muted-foreground" />
                        {count}
                    </span>
                );
            },
        },
        {
            accessorKey: 'contact',
            header: 'Contact',
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const branch = row.original;
                const status = (branch.status ?? 'active') as 'active' | 'inactive';
                return (
                    <BranchStatusDropdown
                        value={status}
                        onStatusChange={(newStatus) =>
                            onStatusChange?.(branch, newStatus)
                        }
                    />
                );
            },
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const branch = row.original;
                return (
                    <ActionsDropdown
                        onEdit={onEdit ? () => onEdit(branch) : undefined}
                        onDelete={onDelete ? () => onDelete(branch) : undefined}
                        showView={false}
                    />
                );
            },
        },
    ];
}
