'use client';

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface AttendanceTerminalDataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    emptyState?: {
        icon?: React.ReactNode;
        title?: string;
        description?: string;
    };
}

export function AttendanceTerminalDataTable<TData, TValue>({
    columns,
    data,
    emptyState = {
        icon: <Clock className="size-12 text-neutral-300" />,
        title: 'No attendance records for today',
        description: 'Records will appear here as employees clock in',
    },
}: AttendanceTerminalDataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        initialState: {
            pagination: { pageSize: 10 },
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const hasRows = table.getRowModel().rows?.length > 0;

    return (
        <div className="min-h-[24rem] overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950/50">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow
                            key={headerGroup.id}
                            className="border-neutral-200 bg-primary hover:bg-primary dark:border-neutral-800"
                        >
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    className="h-11 border-0 px-4 font-bold text-white"
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext()
                                          )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {hasRows ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && 'selected'}
                                className="border-neutral-200 dark:border-neutral-800"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="px-4 py-3">
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow className="hover:bg-transparent">
                            <TableCell
                                colSpan={columns.length}
                                className="h-74 min-h-[20rem] py-12 text-center"
                            >
                                <div className="flex flex-col items-center justify-center gap-3">
                                    {emptyState.icon}
                                    <p className="text-base font-medium text-neutral-700 dark:text-neutral-300">
                                        {emptyState.title}
                                    </p>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                        {emptyState.description}
                                    </p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {hasRows && (
                <div className="flex items-center justify-end gap-2 border-t border-neutral-200 px-4 py-3 dark:border-neutral-800">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        aria-label="Previous page"
                    >
                        <ChevronLeft className="size-4" />
                    </Button>
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        Page {table.getState().pagination.pageIndex + 1} of{' '}
                        {table.getPageCount() || 1}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        aria-label="Next page"
                    >
                        <ChevronRight className="size-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
