import { ChevronDown } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export type BranchStatus = 'active' | 'inactive';

const statusStyles: Record<BranchStatus, string> = {
    active:
        'rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400',
    inactive:
        'rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
};

type BranchStatusDropdownProps = {
    value: BranchStatus;
    onStatusChange: (status: BranchStatus) => void;
    disabled?: boolean;
};

export function BranchStatusDropdown({
    value,
    onStatusChange,
    disabled = false,
}: BranchStatusDropdownProps) {
    const options: BranchStatus[] = value === 'active' ? ['inactive'] : ['active'];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    disabled={disabled}
                    className={cn(
                        'inline-flex items-center gap-1 border-0 bg-transparent font-medium transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
                        statusStyles[value],
                        !disabled &&
                            'cursor-pointer hover:opacity-80 focus:rounded-full'
                    )}
                    aria-label={`Status: ${value}. Click to change.`}
                >
                    <span className="capitalize">{value}</span>
                    <ChevronDown className="size-3.5 opacity-70" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[7rem]">
                {options.map((status) => (
                    <DropdownMenuItem
                        key={status}
                        onClick={() => onStatusChange(status)}
                        className="capitalize"
                    >
                        {status}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
