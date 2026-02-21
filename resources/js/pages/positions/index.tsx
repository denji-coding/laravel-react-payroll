import { Head, router } from '@inertiajs/react';
import { Briefcase, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useMemo, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { positions } from '@/routes';
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
import { AddPositionForm } from '@/pages/positions/components/add-positions';
import type { StorePositionData } from '@/pages/positions/components/add-positions';
import {
    EditPositionForm,
    type EditPositionFormData,
} from '@/pages/positions/components/edit-position';
import { deletePosition, storePosition, updatePosition } from '@/lib/api/positions';
import { createPositionColumns, type Position } from './data-table/columns';
import { DataTable } from './data-table/data-table';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Positions', href: positions().url }];

type PositionsPageProps = {
    positions?: { id: number; name: string; description: string; status: string }[];
};

export default function Positions({ positions: positionsData }: PositionsPageProps) {
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingPosition, setEditingPosition] = useState<EditPositionFormData | null>(null);

    const positionColumns = useMemo(
        () =>
            createPositionColumns({
                onEdit: (pos) => {
                    setEditingPosition({ id: pos.id, name: pos.name, description: pos.description || null, status: pos.status });
                    setEditModalOpen(true);
                },
                onDelete: async (pos) => {
                    try {
                        await deletePosition(pos.id);
                        toast.success('Position deleted', { description: `"${pos.name}" has been removed.` });
                        router.reload();
                    } catch (err: unknown) {
                        const axiosErr = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
                        const responseData = axiosErr?.response?.data;
                        const message =
                            responseData?.message ||
                            (responseData?.errors && typeof responseData.errors === 'object'
                                ? Object.values(responseData.errors).flat().join(' ')
                                : 'Failed to delete position.');
                        toast.error('Error', { description: String(message) });
                    }
                },
                onStatusChange: async (pos, newStatus) => {
                    try {
                        await updatePosition({ id: pos.id, name: pos.name, description: pos.description || null, status: newStatus });
                        toast.success('Status updated', { description: `Position status changed to ${newStatus}.` });
                        router.reload();
                    } catch (err: unknown) {
                        const axiosErr = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
                        const responseData = axiosErr?.response?.data;
                        let message = 'Failed to update status.';
                        if (responseData?.message) message = String(responseData.message);
                        else if (responseData?.errors && typeof responseData.errors === 'object') {
                            message = Object.values(responseData.errors).flat().join(' ');
                        }
                        toast.error('Error', { description: message });
                    }
                },
            }),
        []
    );

    const data: Position[] = useMemo(
        () =>
            (positionsData ?? []).map((p) => ({
                id: p.id,
                name: p.name,
                description: p.description ?? '',
                status: (p.status ?? 'active') as 'active' | 'inactive',
            })),
        [positionsData]
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Positions" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-3">
                <Card className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800">
                    <div>
                        <Dialog open={editModalOpen} onOpenChange={(open) => { setEditModalOpen(open); if (!open) setEditingPosition(null); }}>
                            <DialogContent className="!max-w-md [&>button]:text-white [&>button]:hover:text-white" aria-describedby={undefined}>
                                <DialogHeader className="-m-6 mb-0 rounded-t-lg bg-primary px-6 py-4 text-primary-foreground">
                                    <DialogTitle className="text-primary-foreground">Edit Position</DialogTitle>
                                </DialogHeader>
                                <EditPositionForm
                                    position={editingPosition}
                                    onCancel={() => { setEditModalOpen(false); setEditingPosition(null); }}
                                    onSubmit={async (data) => {
                                        try {
                                            await updatePosition(data);
                                            toast.success('Position updated', { description: 'Position has been updated successfully.' });
                                            setEditModalOpen(false);
                                            setEditingPosition(null);
                                            router.reload();
                                        } catch (err: unknown) {
                                            const axiosErr = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
                                            const responseData = axiosErr?.response?.data;
                                            let message = 'Failed to update position.';
                                            if (responseData?.message) message = String(responseData.message);
                                            else if (responseData?.errors && typeof responseData.errors === 'object') {
                                                message = Object.values(responseData.errors).flat().join(' ');
                                            }
                                            toast.error('Error', { description: message });
                                        }
                                    }}
                                />
                            </DialogContent>
                        </Dialog>
                    </div>
                    <CardContent className="p-0">
                        <div className="flex flex-wrap items-center justify-between gap-4 -mt-12 px-4 py-3 dark:border-neutral-800">
                            <div className="flex items-start gap-3">
                                <div className="rounded-md border-2 border-primary p-2 text-primary dark:bg-primary/20">
                                    <Briefcase className="size-8" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold tracking-tight text-primary">Positions</h2>
                                    <p className="text-sm text-muted-foreground">
                                        Manage job positions and roles in your organization.
                                    </p>
                                </div>
                            </div>
                            <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
                                <DialogTrigger asChild>
                                    <Button className="w-full bg-[#1f5c35] text-white hover:bg-[#1f5c35]/90 sm:w-auto" size="lg">
                                        <Plus className="size-5" />
                                        Add Position
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="!max-w-md [&>button]:text-white [&>button]:hover:text-white" aria-describedby={undefined}>
                                    <DialogHeader className="-m-6 mb-0 rounded-t-lg bg-primary px-6 py-4 text-primary-foreground">
                                        <DialogTitle className="text-primary-foreground">Add New Position</DialogTitle>
                                    </DialogHeader>
                                    <AddPositionForm
                                        onCancel={() => setAddModalOpen(false)}
                                        onSubmit={async (data: StorePositionData) => {
                                            try {
                                                await storePosition(data);
                                                toast.success('Position added', {
                                                    description: 'New position has been created successfully.',
                                                });
                                                setAddModalOpen(false);
                                                router.reload();
                                            } catch (err: unknown) {
                                                const axiosErr = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
                                                const responseData = axiosErr?.response?.data;
                                                let message = 'Failed to add position.';
                                                if (responseData?.message) message = String(responseData.message);
                                                else if (responseData?.errors && typeof responseData.errors === 'object') {
                                                    message = Object.values(responseData.errors).flat().join(' ');
                                                }
                                                toast.error('Error', { description: message });
                                            }
                                        }}
                                    />
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className="mx-4 mb-4 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950/50">
                            <div className="p-4 pt-0">
                                <DataTable
                                    columns={positionColumns}
                                    data={data}
                                    filterColumn="name"
                                    filterPlaceholder="Filter positions..."
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
