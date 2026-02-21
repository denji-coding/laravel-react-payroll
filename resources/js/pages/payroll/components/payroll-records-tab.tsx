'use client';

import { useMemo } from 'react';
import { DataTable } from '@/pages/leaves/data-table/data-table';
import {
    createPayrollRecordColumns,
    type PayrollRecord,
} from '../data-table/columns';

type PayrollRecordsTabProps = {
    records: PayrollRecord[];
    selectedPeriodId: number | null;
};

export function PayrollRecordsTab({
    records,
    selectedPeriodId,
}: PayrollRecordsTabProps) {
    const recordColumns = useMemo(() => createPayrollRecordColumns(), []);

    return (
        <div className="p-4 -mt-6">
            <h2 className="mb-1 text-lg font-semibold text-foreground">
                Payroll Records
            </h2>
            <p className="mb-4 text-sm text-muted-foreground">
                Select a period first
            </p>
            {selectedPeriodId ? (
                <div className="overflow-hidden -mt-4 dark:border-neutral-800">
                    <DataTable
                        columns={recordColumns}
                        data={records}
                        filterColumn="name"
                        filterPlaceholder="Filter employees..."
                        toolbarAlign="right"
                    />
                </div>
            ) : (
                <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed border-neutral-300 py-12 dark:border-neutral-700">
                    <p className="text-muted-foreground">
                        Select a payroll period
                    </p>
                </div>
            )}
        </div>
    );
}
