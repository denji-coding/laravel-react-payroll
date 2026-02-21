'use client';

import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

export type DaySchedule = {
    day: string;
    duty: boolean;
    am_in: string;
    am_out: string;
    pm_in: string;
    pm_out: string;
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

const DEFAULT_TIMES = {
    am_in: '08:00',
    am_out: '12:00',
    pm_in: '13:00',
    pm_out: '17:00',
};

export const DEFAULT_DAY_SCHEDULES: DaySchedule[] = DAYS.map((day) => ({
    day,
    duty: day !== 'Sat' && day !== 'Sun',
    ...DEFAULT_TIMES,
}));

type ScheduleDailyGridProps = {
    days: DaySchedule[];
    onChange: (days: DaySchedule[]) => void;
};

export function ScheduleDailyGrid({ days, onChange }: ScheduleDailyGridProps) {
    const updateDay = (index: number, updates: Partial<DaySchedule>) => {
        const next = [...days];
        next[index] = { ...next[index], ...updates };
        onChange(next);
    };

    const applyMonFri = () => {
        onChange(
            days.map((d, i) => ({
                ...d,
                duty: i < 5,
                am_in: DEFAULT_TIMES.am_in,
                am_out: DEFAULT_TIMES.am_out,
                pm_in: DEFAULT_TIMES.pm_in,
                pm_out: DEFAULT_TIMES.pm_out,
            }))
        );
    };

    const selectAll = () => {
        onChange(
            days.map((d) => ({
                ...d,
                duty: true,
                am_in: DEFAULT_TIMES.am_in,
                am_out: DEFAULT_TIMES.am_out,
                pm_in: DEFAULT_TIMES.pm_in,
                pm_out: DEFAULT_TIMES.pm_out,
            }))
        );
    };

    const clearAll = () => {
        onChange(
            days.map((d) => ({
                ...d,
                duty: false,
                am_in: DEFAULT_TIMES.am_in,
                am_out: DEFAULT_TIMES.am_out,
                pm_in: DEFAULT_TIMES.pm_in,
                pm_out: DEFAULT_TIMES.pm_out,
            }))
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={applyMonFri}
                >
                    Mon-Fri
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={selectAll}>
                    Select All
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={clearAll}>
                    Clear All
                </Button>
            </div>
            <div className="overflow-x-auto rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="w-24">Day</TableHead>
                            <TableHead className="w-20">Duty</TableHead>
                            <TableHead>AM In</TableHead>
                            <TableHead>AM Out</TableHead>
                            <TableHead>PM In</TableHead>
                            <TableHead>PM Out</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {days.map((d, i) => (
                            <TableRow key={d.day}>
                                <TableCell className="font-medium">
                                    {d.day}
                                </TableCell>
                                <TableCell>
                                    <Switch
                                        checked={d.duty}
                                        onCheckedChange={(checked) =>
                                            updateDay(i, { duty: checked })
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type="time"
                                        value={d.am_in}
                                        disabled={!d.duty}
                                        onChange={(e) =>
                                            updateDay(i, { am_in: e.target.value })
                                        }
                                        className={cn(
                                            'h-9 w-full max-w-32',
                                            !d.duty && 'cursor-not-allowed opacity-60'
                                        )}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type="time"
                                        value={d.am_out}
                                        disabled={!d.duty}
                                        onChange={(e) =>
                                            updateDay(i, { am_out: e.target.value })
                                        }
                                        className={cn(
                                            'h-9 w-full max-w-32',
                                            !d.duty && 'cursor-not-allowed opacity-60'
                                        )}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type="time"
                                        value={d.pm_in}
                                        disabled={!d.duty}
                                        onChange={(e) =>
                                            updateDay(i, { pm_in: e.target.value })
                                        }
                                        className={cn(
                                            'h-9 w-full max-w-32',
                                            !d.duty && 'cursor-not-allowed opacity-60'
                                        )}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type="time"
                                        value={d.pm_out}
                                        disabled={!d.duty}
                                        onChange={(e) =>
                                            updateDay(i, { pm_out: e.target.value })
                                        }
                                        className={cn(
                                            'h-9 w-full max-w-32',
                                            !d.duty && 'cursor-not-allowed opacity-60'
                                        )}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
