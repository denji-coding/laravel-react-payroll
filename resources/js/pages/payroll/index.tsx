'use client';

import { Head } from '@inertiajs/react';
import { DollarSign } from 'lucide-react';
import { useMemo, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { payroll } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { PayrollPeriodTab } from './components/payroll-period-tab';
import { PayrollRecordsTab } from './components/payroll-records-tab';
import { SalaryComponentsTab } from './components/salary-components-tab';
import type { PayrollPeriod, PayrollRecord, SalaryComponent } from './data-table/columns';
import { cn } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Payroll',
        href: payroll().url,
    },
];

type PayrollPageProps = {
    periods?: PayrollPeriod[];
    earnings?: SalaryComponent[];
    deductions?: SalaryComponent[];
};

const TABS = [
    { id: 'periods', label: 'Payroll Periods' },
    { id: 'records', label: 'Payroll Records' },
    { id: 'components', label: 'Salary Components' },
    { id: 'calculator', label: 'Salary Calculator' },
] as const;

const SAMPLE_PERIODS: PayrollPeriod[] = [
    {
        id: 1,
        period: 'Feb 2 - Feb 28, 2026',
        pay_date: 'Feb 27, 2026',
        status: 'draft',
    },
    {
        id: 2,
        period: 'Jan 1 - Jan 6, 2026',
        pay_date: 'Jan 6, 2026',
        status: 'approved',
    },
    {
        id: 3,
        period: 'Jan 1 - Jan 15, 2026',
        pay_date: 'Jan 6, 2026',
        status: 'approved',
    },
    {
        id: 4,
        period: 'Jan 1 - Jan 10, 2026',
        pay_date: 'Jan 10, 2026',
        status: 'processing',
    },
];

const SAMPLE_EARNINGS: SalaryComponent[] = [
    { id: 1, name: 'Meal Allowance', type: 'earning' },
    { id: 2, name: 'Rice Allowance', type: 'earning' },
    { id: 3, name: 'Transportation Allowance', type: 'earning' },
];

const SAMPLE_DEDUCTIONS: SalaryComponent[] = [
    { id: 1, name: 'Cash Advance', type: 'deduction' },
    { id: 2, name: 'Company Loan', type: 'deduction' },
    { id: 3, name: 'Pag-IBIG Contribution', type: 'deduction' },
    { id: 4, name: 'Pag-IBIG Loan', type: 'deduction' },
    { id: 5, name: 'PhilHealth Contribution', type: 'deduction' },
    { id: 6, name: 'SSS Contribution', type: 'deduction' },
    { id: 7, name: 'Withholding Tax', type: 'deduction' },
];

export default function Payroll({
    periods: periodsData,
    earnings: earningsData,
    deductions: deductionsData,
}: PayrollPageProps) {
    const [activeTab, setActiveTab] = useState<(typeof TABS)[number]['id']>('periods');
    const [selectedPeriodId, setSelectedPeriodId] = useState<number | null>(null);

    const periods =
        periodsData && periodsData.length > 0 ? periodsData : SAMPLE_PERIODS;
    const earnings =
        earningsData && earningsData.length > 0 ? earningsData : SAMPLE_EARNINGS;
    const deductions =
        deductionsData && deductionsData.length > 0
            ? deductionsData
            : SAMPLE_DEDUCTIONS;

    const payrollRecords: PayrollRecord[] = useMemo(() => {
        if (!selectedPeriodId) return [];
        return [
            {
                id: 1,
                employee_id: 'EMP-001',
                name: 'Sample Employee',
                gross_pay: '₱25,000.00',
                deductions: '₱3,500.00',
                net_pay: '₱21,500.00',
            },
        ];
    }, [selectedPeriodId]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payroll Management" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-center">
                    <div
                        className={cn(
                            'flex w-fit justify-center gap-1 rounded-lg bg-primary/10 p-1',
                            'dark:bg-primary/5'
                        )}
                    >
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    'rounded-md px-4 py-2 text-sm font-medium transition-colors',
                                    activeTab === tab.id
                                        ? 'bg-white text-primary shadow-sm dark:bg-neutral-800 dark:text-primary'
                                        : 'text-muted-foreground hover:bg-white/50 hover:text-foreground dark:hover:bg-neutral-800/50'
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <Card className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
                    <CardContent className="p-0">
                        {activeTab === 'periods' && (
                            <PayrollPeriodTab
                                periods={periods}
                                onView={(p) => {
                                    setSelectedPeriodId(p.id);
                                    setActiveTab('records');
                                }}
                                onRun={() => {}}
                                onApprove={() => {}}
                                onDelete={() => {}}
                                onAddPeriod={() => {}}
                            />
                        )}

                        {activeTab === 'records' && (
                            <PayrollRecordsTab
                                records={payrollRecords}
                                selectedPeriodId={selectedPeriodId}
                            />
                        )}

                        {activeTab === 'components' && (
                            <SalaryComponentsTab
                                earnings={earnings}
                                deductions={deductions}
                                onAddComponent={() => {}}
                                onDeleteEarning={() => {}}
                                onDeleteDeduction={() => {}}
                            />
                        )}

                        {activeTab === 'calculator' && (
                            <div className="flex min-h-[300px] flex-col items-center justify-center p-12">
                                <DollarSign className="mb-4 size-12 text-muted-foreground" />
                                <p className="text-muted-foreground">
                                    Salary Calculator coming soon
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
