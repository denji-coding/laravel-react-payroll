import { Head } from '@inertiajs/react';
import { CalendarDays, Plus } from 'lucide-react';
import { useMemo } from 'react';
import AppLayout from '@/layouts/app-layout';
import { leaves } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { createLeaveColumns, type Leave } from './data-table/columns';
import { DataTable } from './data-table/data-table';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Leaves', href: leaves().url }];

type LeaveRecord = {
    id: number;
    employee_id: number;
    employee_name: string;
    leave_type: string;
    start_date: string;
    end_date: string;
    status: 'pending' | 'approved' | 'rejected';
    reason: string | null;
};

type LeavesPageProps = { leaves?: LeaveRecord[] };

export default function Leaves({ leaves: leavesData }: LeavesPageProps) {
    const leaveColumns = useMemo(() => createLeaveColumns(), []);
    const data: Leave[] = useMemo(
        () =>
            (leavesData ?? []).map((l) => ({
                id: l.id,
                employee_id: l.employee_id,
                employee_name: l.employee_name,
                leave_type: l.leave_type,
                start_date: l.start_date,
                end_date: l.end_date,
                status: l.status,
                reason: l.reason,
            })),
        [leavesData]
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Leaves" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-3">
                <Card className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800">
                    <CardContent className="p-0">
                        <div className="flex flex-wrap items-center justify-between -mt-6 gap-4 px-4 py-3 dark:border-neutral-800">
                            <div className="flex items-start gap-3">
                                <div className="rounded-md border-2 border-primary p-2 text-primary dark:bg-primary/20">
                                    <CalendarDays className="size-8" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold tracking-tight text-primary">Leaves</h2>
                                    <p className="text-sm text-muted-foreground">Manage employee leave requests and records.</p>
                                </div>
                            </div>
                            <Button className="w-full bg-[#1f5c35] text-white hover:bg-[#1f5c35]/90 sm:w-auto" size="lg">
                                <Plus className="size-5" />
                                Add Leave
                            </Button>
                        </div>
                        <div className="mx-4 mb-4 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950/50">
                            <div className="p-4 pt-0">
                                <DataTable
                                    columns={leaveColumns}
                                    data={data}
                                    filterColumn="employee_name"
                                    filterPlaceholder="Filter by employee..."
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
