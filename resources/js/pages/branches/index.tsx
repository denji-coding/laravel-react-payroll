import { Head, router } from '@inertiajs/react';
import { Building2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useMemo, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { branches } from '@/routes';
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
import { AddBranchForm } from '@/pages/branches/components/add_branch-form';
import type { StoreBranchData } from '@/pages/branches/components/add_branch-form';
import {
    EditBranchForm,
    type EditBranchFormData,
} from '@/pages/branches/components/edit-branch-form';
import { deleteBranch, storeBranch, updateBranch } from '@/lib/api/branches';
import { createBranchColumns, type Branch } from './data-table/columns';
import { DataTable } from './data-table/data-table';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Branches', href: branches().url }];

type BranchPayload = {
    id: number;
    name: string;
    manager_id?: number | null;
    manager: string;
    employees_count: number;
    contact: string;
    status: string;
};

type EmployeeOption = { id: number; name: string };

type BranchesPageProps = {
    branches?: BranchPayload[];
    employees: EmployeeOption[];
};

function getAxiosErrorMessage(err: unknown): string {
    const axiosErr = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
    const responseData = axiosErr?.response?.data;
    if (responseData?.message) return String(responseData.message);
    if (responseData?.errors && typeof responseData.errors === 'object') {
        return Object.values(responseData.errors).flat().join(' ');
    }
    return 'Something went wrong.';
}

export default function BranchesPage({
    branches: branchesData,
    employees: employeesData,
}: BranchesPageProps) {
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingBranch, setEditingBranch] = useState<EditBranchFormData | null>(null);

    const branchColumns = useMemo(
        () =>
            createBranchColumns({
                onEdit: (branch) => {
                    setEditingBranch({
                        id: branch.id,
                        name: branch.name,
                        manager_id: branch.manager_id,
                        manager: branch.manager,
                        employees_count: branch.employees_count,
                        contact: branch.contact ?? '',
                        status: branch.status,
                    });
                    setEditModalOpen(true);
                },
                onDelete: async (branch) => {
                    try {
                        await deleteBranch(branch.id);
                        toast.success('Branch deleted', { description: `"${branch.name}" has been removed.` });
                        router.reload();
                    } catch (err: unknown) {
                        toast.error('Error', { description: getAxiosErrorMessage(err) });
                    }
                },
                onStatusChange: async (branch, newStatus) => {
                    try {
                        await updateBranch({
                            id: branch.id,
                            name: branch.name,
                            manager_id: branch.manager_id ?? undefined,
                            contact: branch.contact || undefined,
                            status: newStatus,
                        });
                        toast.success('Status updated', { description: `Branch status changed to ${newStatus}.` });
                        router.reload();
                    } catch (err) {
                        toast.error('Error', { description: getAxiosErrorMessage(err) });
                    }
                },
            }),
        []
    );

    const data: Branch[] = useMemo(
        () =>
            (branchesData ?? []).map((b) => ({
                id: b.id,
                name: b.name,
                manager_id: b.manager_id,
                manager: b.manager,
                employees_count: b.employees_count,
                contact: b.contact ?? '',
                status: (b.status ?? 'active') as 'active' | 'inactive',
            })),
        [branchesData]
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Branches" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800">
                    <CardContent className="p-0">
                        <div className="flex flex-wrap items-center justify-between gap-4 -mt-6 px-4 py-3 dark:border-neutral-800">
                            <div className="flex items-start gap-3">
                                <div className="rounded-lg border-2 border-primary bg-primary/5 p-2 text-primary dark:bg-primary/20">
                                    <Building2 className="size-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold tracking-tight text-primary">Branches</h2>
                                    <p className="text-sm text-muted-foreground">
                                        Manage branches and their details in your organization.
                                    </p>
                                </div>
                            </div>
                            <div className="flex w-full shrink-0 lg:w-auto">
                                <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="w-full bg-[#1f5c35] text-white hover:bg-[#1f5c35]/90 lg:w-auto" size="lg">
                                            <Plus className="size-5" />
                                            Add Branch
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="!max-w-md [&>button]:text-white [&>button]:hover:text-white" aria-describedby={undefined}>
                                        <DialogHeader className="-m-6 mb-0 rounded-t-lg bg-primary px-6 py-4 text-primary-foreground">
                                            <DialogTitle className="text-primary-foreground">Add New Branch</DialogTitle>
                                        </DialogHeader>
                                        <AddBranchForm
                                            employees={employeesData}
                                            onCancel={() => setAddModalOpen(false)}
                                            onSubmit={async (payload: StoreBranchData) => {
                                                try {
                                                    await storeBranch(payload);
                                                    toast.success('Branch added', {
                                                        description: 'New branch has been created successfully.',
                                                    });
                                                    setAddModalOpen(false);
                                                    router.reload();
                                                } catch (err) {
                                                    toast.error('Error', { description: getAxiosErrorMessage(err) });
                                                }
                                            }}
                                        />
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                        <div className="mx-4 mb-4 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950/50">
                            <div className="p-4 pt-0">
                                <DataTable
                                    columns={branchColumns}
                                    data={data}
                                    filterColumn="name"
                                    filterPlaceholder="Filter branches..."
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Dialog open={editModalOpen} onOpenChange={(open) => { setEditModalOpen(open); if (!open) setEditingBranch(null); }}>
                    <DialogContent className="!max-w-md [&>button]:text-white [&>button]:hover:text-white" aria-describedby={undefined}>
                        <DialogHeader className="-m-6 mb-0 rounded-t-lg bg-primary px-6 py-4 text-primary-foreground">
                            <DialogTitle className="text-primary-foreground">Edit Branch</DialogTitle>
                        </DialogHeader>
                        <EditBranchForm
                            branch={editingBranch}
                            employees={employeesData}
                            onCancel={() => { setEditModalOpen(false); setEditingBranch(null); }}
                            onSubmit={async (payload) => {
                                try {
                                    await updateBranch(payload);
                                    toast.success('Branch updated', { description: 'Branch has been updated successfully.' });
                                    setEditModalOpen(false);
                                    setEditingBranch(null);
                                    router.reload();
                                } catch (err) {
                                    toast.error('Error', { description: getAxiosErrorMessage(err) });
                                }
                            }}
                        />
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
