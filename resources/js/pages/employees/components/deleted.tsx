import * as React from 'react';
import { toast } from 'sonner';
import { ActionsDropdown } from './actions-dropdown';
import { Badge } from '@/components/ui/badge';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

const ITEMS_PER_PAGE = 5;

type Employee = {
    id: string;
    name: string;
    position: string;
    branch: string;
    status: 'deleted';
};

type EmployeesDeletedProps = {
    employees?: Employee[];
    isLoading?: boolean;
    itemsPerPage?: number;
    onEdit?: (employee: Employee) => void;
    onView?: (employee: Employee) => void;
};

const mockDeletedEmployees: Employee[] = [
    {
        id: 'EMP-201',
        name: 'Deleted User 1',
        position: 'Driver',
        branch: 'Expressway Liaison Service',
        status: 'deleted',
    },
    {
        id: 'EMP-202',
        name: 'Deleted User 2',
        position: 'Manager',
        branch: 'Migrants Venture Corporation',
        status: 'deleted',
    },
];

export function EmployeesDeleted({
    employees = mockDeletedEmployees,
    isLoading = false,
    itemsPerPage = ITEMS_PER_PAGE,
    onEdit,
    onView,
}: EmployeesDeletedProps) {
    const totalPages = Math.ceil(employees.length / itemsPerPage) || 1;
    const [currentPage, setCurrentPage] = React.useState(1);
    const paginatedEmployees = React.useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return employees.slice(start, start + itemsPerPage);
    }, [employees, currentPage, itemsPerPage]);

    const paginationRange = React.useMemo(() => {
        const delta = 1;
        const range: number[] = [];
        const rangeWithDots: (number | 'ellipsis')[] = [];
        let l: number | undefined;
        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - delta && i <= currentPage + delta)
            ) {
                range.push(i);
            }
        }
        for (const i of range) {
            if (l !== undefined && i - l !== 1) {
                rangeWithDots.push('ellipsis');
            }
            rangeWithDots.push(i);
            l = i;
        }
        return rangeWithDots;
    }, [currentPage, totalPages]);

    const handlePageChange = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow className="border-b border-neutral-200 hover:bg-transparent dark:border-neutral-800">
                        <TableHead className="font-medium text-neutral-900 dark:text-neutral-100">
                            Employee ID
                        </TableHead>
                        <TableHead className="font-medium text-neutral-900 dark:text-neutral-100">
                            Name
                        </TableHead>
                        <TableHead className="font-medium text-neutral-900 dark:text-neutral-100">
                            Position
                        </TableHead>
                        <TableHead className="font-medium text-neutral-900 dark:text-neutral-100">
                            Branch
                        </TableHead>
                        <TableHead className="font-medium text-neutral-900 dark:text-neutral-100">
                            Status
                        </TableHead>
                        <TableHead className="font-medium text-neutral-900 dark:text-neutral-100">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        Array.from({ length: itemsPerPage }).map((_, i) => (
                            <TableRow
                                key={`skeleton-${i}`}
                                className="border-b border-neutral-100 dark:border-neutral-800"
                            >
                                <TableCell>
                                    <Skeleton className="h-4 w-20" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-4 w-32" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-4 w-24" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-4 w-40" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-5 w-16 rounded-full" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-8 w-20" />
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        paginatedEmployees.map((employee) => (
                            <TableRow
                                key={employee.id}
                                className="border-b border-neutral-100 dark:border-neutral-800"
                            >
                                <TableCell className="text-neutral-700 dark:text-neutral-300">
                                    {employee.id}
                                </TableCell>
                                <TableCell className="text-neutral-700 dark:text-neutral-300">
                                    {employee.name}
                                </TableCell>
                                <TableCell className="text-neutral-700 dark:text-neutral-300">
                                    {employee.position}
                                </TableCell>
                                <TableCell className="text-neutral-700 dark:text-neutral-300">
                                    {employee.branch}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="secondary"
                                        className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                    >
                                        {employee.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <ActionsDropdown
                                        onEdit={() => onEdit?.(employee)}
                                        onView={() => onView?.(employee)}
                                        onDelete={() => {
                                            // TODO: wire to delete API
                                            toast.success('Employee deleted', {
                                                description: `${employee.name} has been permanently removed.`,
                                            });
                                        }}
                                        onRestore={() => {
                                            // TODO: wire to restore API
                                            toast.success('Employee restored', {
                                                description: `${employee.name} has been restored successfully.`,
                                            });
                                        }}
                                        showRestore
                                    />
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {!isLoading && totalPages > 1 && (
                <div className="flex justify-between border-t px-4 py-3">
                    <p className="text-muted-foreground text-sm">
                        Showing{' '}
                        {(currentPage - 1) * itemsPerPage + 1} to{' '}
                        {Math.min(
                            currentPage * itemsPerPage,
                            employees.length
                        )}{' '}
                        of {employees.length} employees
                    </p>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handlePageChange(currentPage - 1);
                                    }}
                                    className={
                                        currentPage <= 1
                                            ? 'pointer-events-none opacity-50'
                                            : 'cursor-pointer'
                                    }
                                />
                            </PaginationItem>
                            {paginationRange.map((page, i) =>
                                page === 'ellipsis' ? (
                                    <PaginationItem key={`ellipsis-${i}`}>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                ) : (
                                    <PaginationItem key={page}>
                                        <PaginationLink
                                            href="#"
                                            isActive={currentPage === page}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handlePageChange(page);
                                            }}
                                            className="cursor-pointer"
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                )
                            )}
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handlePageChange(currentPage + 1);
                                    }}
                                    className={
                                        currentPage >= totalPages
                                            ? 'pointer-events-none opacity-50'
                                            : 'cursor-pointer'
                                    }
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </>
    );
}
