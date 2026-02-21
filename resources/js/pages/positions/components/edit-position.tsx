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

export type EditPositionFormData = {
    id: number;
    name: string;
    description?: string | null;
    status?: 'active' | 'inactive';
};

export type UpdatePositionData = {
    id: number;
    name: string;
    description?: string | null;
    status?: 'active' | 'inactive';
};

type EditPositionFormProps = {
    position?: EditPositionFormData | null;
    onCancel?: () => void;
    onSubmit?: (data: UpdatePositionData) => void | Promise<void>;
};

export function EditPositionForm({ position, onCancel, onSubmit }: EditPositionFormProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<'active' | 'inactive'>('active');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (position) {
            setName(position.name);
            setDescription(position.description ?? '');
            setStatus((position.status ?? 'active') as 'active' | 'inactive');
        }
    }, [position]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!position || !onSubmit || isSubmitting) return;
        setIsSubmitting(true);
        try {
            await onSubmit({
                id: position.id,
                name,
                description: description || null,
                status,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!position) return null;

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 rounded-xl bg-neutral-50/80 p-6 dark:bg-neutral-900/40"
        >
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="edit-name">
                        Position Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="edit-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={inputClassName}
                        placeholder="Enter position name (e.g. Bus Driver)"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <textarea
                        id="edit-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className={cn(
                            'w-full rounded-md px-3 py-2 text-sm shadow-xs placeholder:text-neutral-500',
                            inputClassName
                        )}
                        placeholder="Enter description (e.g. Test)"
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
                    {isSubmitting ? 'Saving...' : 'Save Position'}
                </Button>
            </div>
        </form>
    );
}
