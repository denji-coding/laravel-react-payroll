'use client';

import { Plus } from 'lucide-react';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/pages/leaves/data-table/data-table';
import {
    createPayrollPeriodColumns,
    type PayrollPeriod,
} from '../data-table/columns';

type PayrollPeriodTabProps = {
    periods: PayrollPeriod[];
    onView?: (period: PayrollPeriod) => void;
    onRun?: (period: PayrollPeriod) => void;
    onApprove?: (period: PayrollPeriod) => void;
    onDelete?: (period: PayrollPeriod) => void;
    onAddPeriod?: () => void;
};

export function PayrollPeriodTab({
    periods,
    onView,
    onRun,
    onApprove,
    onDelete,
    onAddPeriod,
}: PayrollPeriodTabProps) {
    const periodColumns = useMemo(
        () =>
            createPayrollPeriodColumns({
                onView,
                onRun,
                onApprove,
                onDelete,
            }),
        [onView, onRun, onApprove, onDelete]
    );

    return (
        <div className="p-4">
            <div className="mb-4 flex flex-wrap items-center -mt-6 justify-between gap-4">
                <h2 className="text-lg font-semibold text-foreground">
                    Payroll Periods
                </h2>
                <Button
                    className="bg-[#1f5c35] text-white hover:bg-[#1f5c35]/90"
                    size="lg"
                    onClick={onAddPeriod}
                >
                    <Plus className="size-5" />
                    New Payroll Period
                </Button>
            </div>
            <div className="overflow-hidden p-1 -mt-6 dark:border-neutral-800">
                <DataTable
                    columns={periodColumns}
                    data={periods}
                    filterColumn="period"
                    filterPlaceholder="Filter periods..."
                />
            </div>
        </div>
    );
}
