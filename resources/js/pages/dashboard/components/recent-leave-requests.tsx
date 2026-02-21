import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type LeaveRequest = {
    id: string;
    employeeName: string;
    leaveType: string;
    status: string;
    timestamp: string;
};

const mockLeaveRequests: LeaveRequest[] = [
    {
        id: '1',
        employeeName: 'Test2 Test2',
        leaveType: 'Unpaid Leave',
        status: 'Pending',
        timestamp: '6 days ago',
    },
    {
        id: '2',
        employeeName: 'Test3 Test3',
        leaveType: 'Vacation Leave',
        status: 'Pending',
        timestamp: '23 days ago',
    },
    {
        id: '3',
        employeeName: 'New Branch',
        leaveType: 'Vacation Leave',
        status: 'Pending',
        timestamp: '25 days ago',
    },
    {
        id: '4',
        employeeName: 'John Doe',
        leaveType: 'Vacation Leave',
        status: 'Rejected',
        timestamp: '25 days ago',
    },
    {
        id: '5',
        employeeName: 'Jane Smith',
        leaveType: 'Sick Leave',
        status: 'Approved',
        timestamp: 'about 1 month ago',
    },
];

type RecentLeaveRequestsProps = {
    items?: LeaveRequest[];
    className?: string;
};

export function RecentLeaveRequests({
    items = mockLeaveRequests,
    className,
}: RecentLeaveRequestsProps) {
    return (
        <Card
            className={cn(
                'border-sidebar-border/70 dark:border-sidebar-border overflow-hidden rounded-xl bg-white shadow-sm',
                className
            )}
        >
            <CardHeader className="pb-4">
                <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                    Recent Leave Requests
                </h2>
            </CardHeader>
            <CardContent className="space-y-3 px-6 pb-6">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-start justify-between gap-4 rounded-lg bg-neutral-100/80 px-4 py-3 dark:bg-neutral-800/50"
                    >
                        <div className="min-w-0 flex-1 space-y-0.5">
                            <p className="truncate font-medium text-neutral-900 dark:text-neutral-100">
                                {item.employeeName}
                            </p>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                {item.leaveType} - {item.status}
                            </p>
                        </div>
                        <span className="shrink-0 text-xs text-neutral-500 dark:text-neutral-400">
                            {item.timestamp}
                        </span>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
