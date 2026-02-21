import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type Announcement = {
    id: string;
    title: string;
    description: string;
    timestamp: string;
};

const mockAnnouncements: Announcement[] = [
    {
        id: '1',
        title: 'Test Real-time notification',
        description: 'Test',
        timestamp: '25 days ago',
    },
    {
        id: '2',
        title: 'Test',
        description: 'Test meeting',
        timestamp: '28 days ago',
    },
    {
        id: '3',
        title: 'Meeting',
        description: 'Team sync scheduled',
        timestamp: '29 days ago',
    },
];

type AnnouncementsProps = {
    items?: Announcement[];
    className?: string;
};

export function Announcements({
    items = mockAnnouncements,
    className,
}: AnnouncementsProps) {
    return (
        <Card
            className={cn(
                'border-sidebar-border/70 dark:border-sidebar-border overflow-hidden rounded-xl bg-white shadow-sm',
                className
            )}
        >
            <CardHeader className="pb-4">
                <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                    Announcements
                </h2>
            </CardHeader>
            <CardContent className="space-y-3 px-6 pb-6">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="rounded-lg bg-neutral-100/80 px-4 py-3 dark:bg-neutral-800/50"
                    >
                        <p className="font-medium text-neutral-900 dark:text-neutral-100">
                            {item.title}
                        </p>
                        <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                            {item.description}
                        </p>
                        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                            {item.timestamp}
                        </p>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
