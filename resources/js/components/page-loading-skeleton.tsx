import { Skeleton } from '@/components/ui/skeleton';

export function PageLoadingSkeleton() {
    return (
        <div
            className="fixed inset-0 z-[100] flex bg-background"
            aria-live="polite"
            aria-busy="true"
        >
            {/* Sidebar skeleton */}
            <aside className="flex w-16 shrink-0 flex-col border-r border-border md:w-52">
                <div className="flex h-16 items-center gap-2 border-b border-border px-2 md:px-4">
                    <Skeleton className="h-9 w-9 shrink-0 rounded-md" />
                    <Skeleton className="hidden h-5 flex-1 md:block" />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-2 md:p-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-9 w-full rounded-md" />
                    ))}
                </div>
                <div className="border-t border-border p-2 md:p-4">
                    <Skeleton className="h-10 w-full rounded-md" />
                </div>
            </aside>

            {/* Main content skeleton */}
            <main className="flex min-w-0 flex-1 flex-col">
                {/* Header / breadcrumb bar */}
                <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-4 md:px-6">
                    <Skeleton className="h-9 w-9 shrink-0 rounded-md" />
                    <div className="flex flex-1 flex-col gap-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="hidden h-3 w-48 md:block" />
                    </div>
                </header>

                {/* Page content area */}
                <div className="flex flex-1 flex-col gap-4 overflow-auto p-4 md:p-6">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-72 max-w-full" />
                    </div>

                    {/* Card grid skeleton */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Skeleton key={i} className="h-24 w-full rounded-lg" />
                        ))}
                    </div>

                    {/* Table/content block skeleton */}
                    <div className="flex flex-1 flex-col gap-3 rounded-lg border border-border p-4">
                        <div className="flex items-center justify-between gap-2">
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-9 w-28 rounded-md" />
                        </div>
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-64 w-full" />
                        <div className="flex justify-end gap-2">
                            <Skeleton className="h-9 w-20 rounded-md" />
                            <Skeleton className="h-9 w-20 rounded-md" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
