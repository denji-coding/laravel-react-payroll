import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

const inputClassName =
    'rounded-md border border-neutral-200 bg-white ring-offset-2 outline-none focus-visible:border-text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring dark:border-neutral-800 dark:bg-neutral-950';

export type EditBranchFormData = {
    id: number;
    name: string;
    manager_id?: number | null;
    manager: string;
    employees_count: number;
    contact: string;
    status: 'active' | 'inactive';
};

export type UpdateBranchData = {
    id: number;
    name: string;
    manager_id?: number | null;
    contact?: string | null;
    status?: 'active' | 'inactive';
};

type EmployeeOption = { id: number; name: string };

type EditBranchFormProps = {
    branch?: EditBranchFormData | null;
    employees: EmployeeOption[];
    onCancel?: () => void;
    onSubmit?: (data: UpdateBranchData) => void | Promise<void>;
};

export function EditBranchForm({
    branch,
    employees,
    onCancel,
    onSubmit,
}: EditBranchFormProps) {
    const [name, setName] = useState('');
    const [managerId, setManagerId] = useState<string>('');
    const [contact, setContact] = useState('');
    const [status, setStatus] = useState<'active' | 'inactive'>('active');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (branch) {
            setName(branch.name);
            setContact(branch.contact ?? '');
            setStatus((branch.status ?? 'active') as 'active' | 'inactive');
            setManagerId(
                branch.manager_id != null ? String(branch.manager_id) : ''
            );
        }
    }, [branch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!branch || !onSubmit || isSubmitting) return;
        setIsSubmitting(true);
        try {
            await onSubmit({
                id: branch.id,
                name,
                manager_id: managerId ? Number(managerId) : null,
                contact: contact || null,
                status,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!branch) return null;

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 rounded-xl bg-neutral-50/80 p-6 dark:bg-neutral-900/40"
        >
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="edit-name">
                        Branch Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="edit-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={inputClassName}
                        placeholder="Enter branch name"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="edit-manager">Manager</Label>
                    <Select
                        value={managerId || 'none'}
                        onValueChange={(v) =>
                            setManagerId(v === 'none' ? '' : v)
                        }
                    >
                        <SelectTrigger
                            className={cn(
                                inputClassName,
                                'ring-offset-2 focus-visible:border-text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                            )}
                        >
                            <SelectValue placeholder="Select manager" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">Not assigned</SelectItem>
                            {employees.map((emp) => (
                                <SelectItem
                                    key={emp.id}
                                    value={String(emp.id)}
                                >
                                    {emp.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="edit-contact">Contact</Label>
                    <Input
                        id="edit-contact"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        className={inputClassName}
                        placeholder="Contact number"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select
                        value={status}
                        onValueChange={(v) =>
                            setStatus(v as 'active' | 'inactive')
                        }
                    >
                        <SelectTrigger
                            className={cn(
                                inputClassName,
                                'ring-offset-2 focus-visible:border-text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                            )}
                        >
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex justify-end gap-2">
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#1f5c35] text-white hover:bg-[#1f5c35]/90 disabled:opacity-70"
                >
                    {isSubmitting ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        <Save className="size-4" />
                    )}
                    {isSubmitting ? 'Saving...' : 'Save Branch'}
                </Button>
            </div>
        </form>
    );
}
