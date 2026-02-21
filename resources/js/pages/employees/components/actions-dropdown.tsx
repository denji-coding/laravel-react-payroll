import { Eye, MoreVertical, Pencil, RotateCcw, Trash2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

type ActionsDropdownProps = {
    onEdit?: () => void;
    onView?: () => void;
    onDelete?: () => void;
    onRestore?: () => void;
    showView?: boolean;
    showRestore?: boolean;
    className?: string;
};

export function ActionsDropdown({
    onEdit,
    onView,
    onDelete,
    onRestore,
    showView = true,
    showRestore = false,
    className,
}: ActionsDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className={cn(
                        'rounded-full p-1.5 text-neutral-500 outline-none ring-0 transition-all duration-100 hover:scale-110 hover:bg-primary hover:text-white focus:outline-none focus:ring-0 data-[state=open]:bg-primary data-[state=open]:text-white dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100',
                        className
                    )}
                    aria-label="Open actions menu"
                >
                    <MoreVertical className="size-4" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                sideOffset={6}
                className="min-w-[9.5rem] rounded-lg border border-neutral-200 bg-white py-1.5 shadow-lg dark:border-neutral-800 dark:bg-neutral-950"
            >
                <DropdownMenuItem
                    onClick={onEdit}
                    className="gap-2.5 px-3 py-2 text-sm transition-colors data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary dark:data-[highlighted]:bg-primary/20"
                >
                    <Pencil className="size-4 text-neutral-500 dark:text-neutral-400" />
                    Edit
                </DropdownMenuItem>
                {showView && (
                    <DropdownMenuItem
                        onClick={onView}
                        className="gap-2.5 px-3 py-2 text-sm transition-colors data-[highlighted]:bg-blue-500/10 data-[highlighted]:text-blue-600 dark:data-[highlighted]:bg-blue-500/20 dark:data-[highlighted]:text-blue-400"
                    >
                        <Eye className="size-4 text-neutral-500 dark:text-neutral-400" />
                        View
                    </DropdownMenuItem>
                )}
                {showRestore && (
                    <DropdownMenuItem
                        onClick={onRestore}
                        className="gap-2.5 px-3 py-2 text-sm transition-colors data-[highlighted]:bg-green-500/10 data-[highlighted]:text-green-600 dark:data-[highlighted]:bg-green-500/20 dark:data-[highlighted]:text-green-400"
                    >
                        <RotateCcw className="size-4 text-neutral-500 dark:text-neutral-400" />
                        Restore
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="my-1 bg-neutral-200 dark:bg-neutral-800" />
                <DropdownMenuItem
                    variant="default"
                    onClick={onDelete}
                    className="gap-2.5 px-3 py-2 text-sm text-neutral-500 transition-colors data-[highlighted]:bg-red-500/10 data-[highlighted]:text-red-700 dark:text-red-400 dark:data-[highlighted]:bg-red-500/20 dark:data-[highlighted]:text-red-300"
                >
                    <Trash2 className="size-4 shrink-0" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
