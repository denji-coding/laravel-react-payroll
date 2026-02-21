import { Head, router } from '@inertiajs/react';
import { CalendarClock, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';
import { timeSchedule } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    deleteTimeSchedule,
    storeTimeSchedule,
    updateTimeSchedule,
} from '@/lib/api/time-schedules';
import { AddTimeScheduleForm } from '@/pages/time-schedule/components/add-time-schedule-form';
import { EditTimeSchedule } from '@/pages/time-schedule/components/edit-time-schedule';
import { createScheduleColumns, type Schedule } from './data-table/columns';
import { DataTable } from './data-table/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Time Schedule',
        href: timeSchedule().url,
    },
];

type EmployeeOption = { id: number; employee_id: string; name: string };

type TimeSchedulePageProps = {
    employees: EmployeeOption[];
    schedules?: Schedule[];
};

export default function TimeSchedulePage({
    employees: employeesData,
    schedules: schedulesData,
}: TimeSchedulePageProps) {
    const schedulesList = schedulesData ?? [];
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

    const scheduleColumns = useMemo(
        () =>
            createScheduleColumns({
                onEdit: (schedule) => {
                    setEditingSchedule(schedule);
                    setEditModalOpen(true);
                },
                onDelete: async (schedule) => {
                    try {
                        await deleteTimeSchedule(schedule.id);
                        toast.success('Schedule deleted', {
                            description: `Schedule for ${schedule.name} has been removed.`,
                        });
                        router.reload();
                    } catch (err: unknown) {
                        const axiosErr = err as {
                            response?: {
                                data?: {
                                    message?: string;
                                    errors?: Record<string, string[]>;
                                };
                            };
                        };
                        const data = axiosErr?.response?.data;
                        const message =
                            data?.message ||
                            (data?.errors &&
                            typeof data.errors === 'object'
                                ? Object.values(data.errors).flat().join(' ')
                                : 'Failed to delete schedule.');
                        toast.error('Error', { description: String(message) });
                    }
                },
            }),
        []
    );

    const data = useMemo(() => schedulesList, [schedulesList]);

    const employeesWithoutSchedules = useMemo(
        () =>
            employeesData.filter(
                (emp) =>
                    !schedulesList.some((s) => s.employee_id === emp.employee_id)
            ),
        [employeesData, schedulesList]
    );

    const editFormEmployees = useMemo(() => {
        if (!editingSchedule) return [];
        const currentFromAll = employeesData.find(
            (e) => e.employee_id === editingSchedule.employee_id
        );
        const currentEmployee = currentFromAll ?? {
            id: editingSchedule.id,
            employee_id: editingSchedule.employee_id,
            name: editingSchedule.name,
        };
        return [currentEmployee];
    }, [employeesData, editingSchedule]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Time Schedule" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800">
                    <CardContent className="p-0">
                        <div className="flex flex-wrap items-center justify-between gap-4 -mt-7 px-4 py-4 dark:border-neutral-800">
                            <div className="flex items-start gap-3">
                                <div className="rounded-lg border-2 border-primary bg-primary/5 p-2 text-primary dark:bg-primary/20">
                                    <CalendarClock className="size-6" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold tracking-tight text-foreground">
                                        Assigned Schedules
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Employees with configured work schedules
                                    </p>
                                </div>
                            </div>
                            <div className="w-full lg:w-auto">
                                <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
                                    <DialogTrigger asChild>
                                        <Button
                                            className="w-full bg-[#1f5c35] text-white hover:bg-[#1f5c35]/90 lg:w-auto"
                                            size="lg"
                                        >
                                            <Plus className="size-5" />
                                            Add Schedule
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent
                                        className="!max-w-4xl max-h-[90vh] overflow-y-auto [&>button]:text-white [&>button]:hover:text-white"
                                        aria-describedby={undefined}
                                    >
                                        <DialogHeader className="-m-6 mb-0 rounded-t-lg bg-primary px-6 py-4 text-primary-foreground">
                                            <DialogTitle className="text-primary-foreground">Add Time Schedule</DialogTitle>
                                        </DialogHeader>
                                        <AddTimeScheduleForm
                                            employees={employeesWithoutSchedules}
                                            onCancel={() => setAddModalOpen(false)}
                                            onSubmit={async (data) => {
                                                try {
                                                    await storeTimeSchedule(data);
                                                    toast.success('Schedule added', {
                                                        description:
                                                            'Employee schedule has been configured.',
                                                    });
                                                    setAddModalOpen(false);
                                                    router.reload();
                                                } catch (err: unknown) {
                                                    const axiosErr = err as {
                                                        response?: {
                                                            data?: {
                                                                message?: string;
                                                                errors?: Record<string, string[]>;
                                                            };
                                                        };
                                                    };
                                                    const resData = axiosErr?.response?.data;
                                                    const message =
                                                        resData?.message ||
                                                        (resData?.errors &&
                                                        typeof resData.errors ===
                                                            'object'
                                                            ? Object.values(
                                                                  resData.errors
                                                              )
                                                                  .flat()
                                                                  .join(' ')
                                                            : 'Failed to add schedule.');
                                                    toast.error('Error', {
                                                        description: String(message),
                                                    });
                                                    throw err;
                                                }
                                            }}
                                        />
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                        <div className="mx-4 mb-4 overflow-x-auto rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950/50">
                            <div className="min-w-0 p-4 pt-0">
                                <DataTable
                                    columns={scheduleColumns}
                                    data={data}
                                    filterColumn="name"
                                    filterPlaceholder="Filter schedules..."
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Dialog
                    open={editModalOpen}
                    onOpenChange={(open) => {
                        setEditModalOpen(open);
                        if (!open) setEditingSchedule(null);
                    }}
                >
                    <DialogContent
                        className="!max-w-4xl max-h-[90vh] overflow-y-auto [&>button]:text-white [&>button]:hover:text-white"
                        aria-describedby={undefined}
                    >
                        <DialogHeader className="-m-6 mb-0 rounded-t-lg bg-primary px-6 py-4 text-primary-foreground">
                            <DialogTitle className="text-primary-foreground">Edit Time Schedule</DialogTitle>
                        </DialogHeader>
                        <EditTimeSchedule
                            schedule={editingSchedule}
                            employees={editFormEmployees}
                            onCancel={() => {
                                setEditModalOpen(false);
                                setEditingSchedule(null);
                            }}
                            onSubmit={async (data) => {
                                if (!editingSchedule) return;
                                try {
                                    await updateTimeSchedule({
                                        id: editingSchedule.id,
                                        employee_id: data.employee_id,
                                        days: data.days,
                                    });
                                    toast.success('Schedule updated', {
                                        description:
                                            'Employee schedule has been saved.',
                                    });
                                    setEditModalOpen(false);
                                    setEditingSchedule(null);
                                    router.reload();
                                } catch (err: unknown) {
                                    const axiosErr = err as {
                                        response?: {
                                            data?: {
                                                message?: string;
                                                errors?: Record<string, string[]>;
                                            };
                                        };
                                    };
                                    const resData = axiosErr?.response?.data;
                                    const message =
                                        resData?.message ||
                                        (resData?.errors &&
                                        typeof resData.errors === 'object'
                                            ? Object.values(resData.errors)
                                                  .flat()
                                                  .join(' ')
                                            : 'Failed to update schedule.');
                                    toast.error('Error', {
                                        description: String(message),
                                    });
                                    throw err;
                                }
                            }}
                        />
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
