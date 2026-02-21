import { Skeleton } from '@/components/ui/skeleton';

export function SettingsContentSkeleton() {
    return (
        <section
            className="max-w-xl space-y-12"
            aria-busy="true"
            aria-live="polite"
        >
            <div className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-full max-w-md" />
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-9 w-full rounded-md" />
                        </div>
                    ))}
                </div>
                <div className="flex gap-2 pt-2">
                    <Skeleton className="h-9 w-24 rounded-md" />
                    <Skeleton className="h-9 w-32 rounded-md" />
                </div>
            </div>
        </section>
    );
}
