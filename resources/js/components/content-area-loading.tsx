import { usePageLoading } from '@/contexts/page-loading-context';
import { Skeleton } from '@/components/ui/skeleton';

type ContentAreaLoadingProps = {
    children: React.ReactNode;
};

function ContentAreaSkeleton() {
    return (
        <div
            className="flex h-full flex-1 flex-col gap-2 overflow-x-auto rounded-xl p-3"
            aria-busy="true"
            aria-live="polite"
        >
            <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800">
                <div className="space-y-4 px-4 py-3">
                    {/* Page title block */}
                    <div className="flex items-start gap-3">
                        <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-4 w-72 max-w-full" />
                        </div>
                    </div>
                    {/* Toolbar: search, tabs, button */}
                    <div className="flex flex-wrap items-center gap-3">
                        <Skeleton className="h-9 w-full rounded-md xl:w-64" />
                        <div className="flex gap-1">
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton key={i} className="h-9 w-20 rounded-md" />
                            ))}
                        </div>
                        <Skeleton className="ml-auto h-9 w-32 rounded-md" />
                    </div>
                </div>
                {/* Table skeleton */}
                <div className="border-t border-border">
                    <div className="flex gap-4 border-b border-border bg-muted/30 px-4 py-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Skeleton key={i} className="h-4 flex-1 rounded" />
                        ))}
                    </div>
                    {[1, 2, 3, 4, 5].map((row) => (
                        <div
                            key={row}
                            className="flex gap-4 border-b border-border px-4 py-3 last:border-b-0"
                        >
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <Skeleton key={i} className="h-4 flex-1 rounded" />
                            ))}
                        </div>
                    ))}
                    <div className="flex items-center justify-between gap-4 border-t border-border px-4 py-3">
                        <Skeleton className="h-4 w-40" />
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-9 w-20 rounded-md" />
                            <Skeleton className="h-4 w-24" />
                            <div className="flex gap-1">
                                <Skeleton className="h-8 w-8 rounded-md" />
                                <Skeleton className="h-8 w-8 rounded-md" />
                                <Skeleton className="h-8 w-8 rounded-md" />
                                <Skeleton className="h-8 w-8 rounded-md" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function ContentAreaLoading({ children }: ContentAreaLoadingProps) {
    const loading = usePageLoading();

    if (loading) {
        return <ContentAreaSkeleton />;
    }

    return <>{children}</>;
}
