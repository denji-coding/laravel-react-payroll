'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SalaryComponent } from '../data-table/columns';

type SalaryComponentsTabProps = {
    earnings: SalaryComponent[];
    deductions: SalaryComponent[];
    onAddComponent?: () => void;
    onDeleteEarning?: (component: SalaryComponent) => void;
    onDeleteDeduction?: (component: SalaryComponent) => void;
};

export function SalaryComponentsTab({
    earnings,
    deductions,
    onAddComponent,
    onDeleteEarning,
    onDeleteDeduction,
}: SalaryComponentsTabProps) {
    return (
        <div className="p-4">
            <div className="mb-4 flex flex-wrap items-center -mt-7 justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-foreground">
                        Salary Components
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Configure earnings and deductions
                    </p>
                </div>
                <Button
                    className="bg-[#1f5c35] text-white hover:bg-[#1f5c35]/90"
                    size="sm"
                    onClick={onAddComponent}
                >
                    <Plus className="size-5" />
                    Add Component
                </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
                <div className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
                    <div className="border-b border-neutral-200 bg-primary/5 px-4 py-2 dark:border-neutral-800">
                        <h3 className="font-medium text-primary">Earnings</h3>
                    </div>
                    <ul className="divide-y divide-neutral-200 p-4 dark:divide-neutral-800">
                        {earnings.map((item) => (
                            <li
                                key={item.id}
                                className="flex items-center justify-between gap-2 py-2 first:pt-0 last:pb-0"
                            >
                                <span className="font-medium text-primary">
                                    {item.name}
                                </span>
                                {onDeleteEarning && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
                                        onClick={() => onDeleteEarning(item)}
                                        aria-label="Delete"
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
                    <div className="border-b border-neutral-200 bg-destructive/5 px-4 py-2 dark:border-neutral-800">
                        <h3 className="font-medium text-destructive">
                            Deductions
                        </h3>
                    </div>
                    <ul className="divide-y divide-neutral-200 p-4 dark:divide-neutral-800">
                        {deductions.map((item) => (
                            <li
                                key={item.id}
                                className="flex items-center justify-between gap-2 py-2 first:pt-0 last:pb-0"
                            >
                                <span className="font-medium text-destructive">
                                    {item.name}
                                </span>
                                {onDeleteDeduction && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
                                        onClick={() => onDeleteDeduction(item)}
                                        aria-label="Delete"
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
