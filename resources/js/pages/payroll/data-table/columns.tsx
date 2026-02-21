'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Check, Eye, Play, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type PayrollPeriod = {
    id: number;
    period: string;
    pay_date: string;
    status: 'draft' | 'processing' | 'approved';
};

export type PayrollRecord = {
    id: number;
    employee_id: string;
    name: string;
    gross_pay: string;
    deductions: string;
    net_pay: string;
};

export type SalaryComponent = {
    id: number;
    name: string;
    type: 'earning' | 'deduction';
};

type PayrollPeriodColumnsOptions = {
    onView?: (period: PayrollPeriod) => void;
    onRun?: (period: PayrollPeriod) => void;
    onApprove?: (period: PayrollPeriod) => void;
    onDelete?: (period: PayrollPeriod) => void;
};

export function createPayrollPeriodColumns(
    options?: PayrollPeriodColumnsOptions
): ColumnDef<PayrollPeriod>[] {
    const { onView, onRun, onApprove, onDelete } = options ?? {};

    return [
        {
            accessorKey: 'period',
            header: 'Period',
            cell: ({ row }) => (
                <span className="text-foreground">{row.getValue('period')}</span>
            ),
        },
        {
            accessorKey: 'pay_date',
            header: 'Pay Date',
            cell: ({ row }) => (
                <span className="text-foreground">{row.getValue('pay_date')}</span>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.getValue('status') as string;
                return (
                    <Badge
                        variant="secondary"
                        className={cn(
                            'rounded-md capitalize',
                            status === 'draft' &&
                                'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200',
                            status === 'approved' &&
                                'bg-primary text-primary-foreground',
                            status === 'processing' &&
                                'bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary'
                        )}
                    >
                        {status}
                    </Badge>
                );
            },
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const period = row.original;
                return (
                    <div className="flex items-center gap-1">
                        {onView && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-8"
                                onClick={() => onView(period)}
                                aria-label="View"
                            >
                                <Eye className="size-4" />
                            </Button>
                        )}
                        {onRun && period.status === 'draft' && (
                            <Button
                                variant="default"
                                size="sm"
                                className="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
                                onClick={() => onRun(period)}
                            >
                                <Play className="size-4" />
                                Run
                            </Button>
                        )}
                        {onApprove && period.status === 'processing' && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 gap-1.5"
                                onClick={() => onApprove(period)}
                            >
                                <Check className="size-4" />
                                Approve
                            </Button>
                        )}
                        {onDelete &&
                            (period.status === 'draft' ||
                                period.status === 'processing') && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                    onClick={() => onDelete(period)}
                                    aria-label="Delete"
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            )}
                    </div>
                );
            },
        },
    ];
}

export function createPayrollRecordColumns(): ColumnDef<PayrollRecord>[] {
    return [
        {
            accessorKey: 'employee_id',
            header: 'Employee ID',
            cell: ({ row }) => (
                <span className="font-medium text-foreground">
                    {row.getValue('employee_id')}
                </span>
            ),
        },
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => (
                <span className="text-foreground">{row.getValue('name')}</span>
            ),
        },
        {
            accessorKey: 'gross_pay',
            header: 'Gross Pay',
            cell: ({ row }) => (
                <span className="text-foreground">{row.getValue('gross_pay')}</span>
            ),
        },
        {
            accessorKey: 'deductions',
            header: 'Deductions',
            cell: ({ row }) => (
                <span className="text-foreground">{row.getValue('deductions')}</span>
            ),
        },
        {
            accessorKey: 'net_pay',
            header: 'Net Pay',
            cell: ({ row }) => (
                <span className="font-medium text-foreground">
                    {row.getValue('net_pay')}
                </span>
            ),
        },
    ];
}

type SalaryComponentColumnsOptions = {
    onDelete?: (component: SalaryComponent) => void;
};

export function createEarningColumns(
    options?: SalaryComponentColumnsOptions
): ColumnDef<SalaryComponent>[] {
    const { onDelete } = options ?? {};

    return [
        {
            accessorKey: 'name',
            header: 'Component',
            cell: ({ row }) => (
                <span className="text-primary font-medium">
                    {row.getValue('name')}
                </span>
            ),
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) =>
                onDelete ? (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-destructive"
                        onClick={() => onDelete(row.original)}
                        aria-label="Delete"
                    >
                        <Trash2 className="size-4" />
                    </Button>
                ) : null,
        },
    ];
}

export function createDeductionColumns(
    options?: SalaryComponentColumnsOptions
): ColumnDef<SalaryComponent>[] {
    const { onDelete } = options ?? {};

    return [
        {
            accessorKey: 'name',
            header: 'Component',
            cell: ({ row }) => (
                <span className="font-medium text-destructive">
                    {row.getValue('name')}
                </span>
            ),
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) =>
                onDelete ? (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-destructive"
                        onClick={() => onDelete(row.original)}
                        aria-label="Delete"
                    >
                        <Trash2 className="size-4" />
                    </Button>
                ) : null,
        },
    ];
}
