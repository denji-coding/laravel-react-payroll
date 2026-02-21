import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { myAttendance } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'My Attendance',
        href: myAttendance().url,
    },
];

export default function MyAttendance() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Attendance" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <PlaceholderPattern className="relative min-h-[40vh] w-full rounded-xl border border-sidebar-border/70 stroke-neutral-900/20 dark:border-sidebar-border dark:stroke-neutral-100/20" />
            </div>
        </AppLayout>
    );
}
