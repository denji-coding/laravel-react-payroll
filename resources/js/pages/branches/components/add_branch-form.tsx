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
import { useState } from 'react';

const inputClassName =
    'rounded-md border border-neutral-200 bg-white ring-offset-2 outline-none focus-visible:border-text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring dark:border-neutral-800 dark:bg-neutral-950';

export type StoreBranchData = {
    name: string;
    manager_id?: number | null;
    contact?: string | null;
    status?: 'active' | 'inactive';
};

type EmployeeOption = { id: number; name: string };

type AddBranchFormProps = {
    employees: EmployeeOption[];
    onCancel?: () => void;
    onSubmit?: (data: StoreBranchData) => void | Promise<void>;
};

export function AddBranchForm({
    employees,
    onCancel,
    onSubmit,
}: AddBranchFormProps) {
    const [name, setName] = useState('');
    const [managerId, setManagerId] = useState<string>('');
    const [contact, setContact] = useState('');
    const [status, setStatus] = useState<'active' | 'inactive'>('active');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!onSubmit || isSubmitting) return;
        setIsSubmitting(true);
        try {
            await onSubmit({
                name,
                manager_id: managerId ? Number(managerId) : null,
                contact: contact || null,
                status,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 rounded-xl bg-neutral-50/80 p-6 dark:bg-neutral-900/40"
        >
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">
                        Branch Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={inputClassName}
                        placeholder="Enter branch name"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="manager">Manager</Label>
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
                    <Label htmlFor="contact">Contact</Label>
                    <Input
                        id="contact"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        className={inputClassName}
                        placeholder="Contact number"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
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
