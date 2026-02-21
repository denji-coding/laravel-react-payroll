import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

type EmployeeOption = { id: number; employee_id: string; name: string };

type AddEmployeeScheduleFormProps = {
    employees: EmployeeOption[];
    onCancel?: () => void;
    onSubmit?: (data: { employee_id: number }) => void | Promise<void>;
};

export function AddEmployeeScheduleForm({
    employees,
    onCancel,
    onSubmit,
}: AddEmployeeScheduleFormProps) {
    const [employeeId, setEmployeeId] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!onSubmit || isSubmitting || !employeeId) return;
        setIsSubmitting(true);
        try {
            await onSubmit({ employee_id: Number(employeeId) });
        } finally {
            setIsSubmitting(false);
        }
    };

    const employeesWithoutSchedule = employees;

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 rounded-xl bg-neutral-50/80 p-6 dark:bg-neutral-900/40"
        >
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="employee">Select Employee</Label>
                    <Select
                        value={employeeId}
                        onValueChange={setEmployeeId}
                        disabled={employeesWithoutSchedule.length === 0}
                    >
                        <SelectTrigger
                            id="employee"
                            className="rounded-md border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950"
                        >
                            <SelectValue placeholder="Choose an employee..." />
                        </SelectTrigger>
                        <SelectContent>
                            {employeesWithoutSchedule.map((emp) => (
                                <SelectItem
                                    key={emp.id}
                                    value={String(emp.id)}
                                    className="cursor-pointer"
                                >
                                    {emp.employee_id} - {emp.name}
                                </SelectItem>
                            ))}
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
                    disabled={isSubmitting || !employeeId}
                    className="bg-[#1f5c35] text-white hover:bg-[#1f5c35]/90"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 size-4 animate-spin" />
                            Adding...
                        </>
                    ) : (
                        'Add Schedule'
                    )}
                </Button>
            </div>
        </form>
    );
}
