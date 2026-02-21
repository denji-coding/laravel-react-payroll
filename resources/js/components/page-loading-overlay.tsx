import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { PageLoadingProvider } from '@/contexts/page-loading-context';

const SHOW_DELAY_MS = 150;

type PageLoadingOverlayProps = {
    children: React.ReactNode;
};

export function PageLoadingOverlay({ children }: PageLoadingOverlayProps) {
    const [loading, setLoading] = useState(false);
    const showTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const removeStart = router.on('start', (event: CustomEvent & { detail: { visit: { prefetch?: boolean } } }) => {
            const visit = event?.detail?.visit;
            if (visit?.prefetch) {
                return;
            }
            showTimeoutRef.current = setTimeout(() => setLoading(true), SHOW_DELAY_MS);
        });

        const removeFinish = router.on('finish', () => {
            if (showTimeoutRef.current) {
                clearTimeout(showTimeoutRef.current);
                showTimeoutRef.current = null;
            }
            setLoading(false);
        });

        return () => {
            removeStart();
            removeFinish();
            if (showTimeoutRef.current) {
                clearTimeout(showTimeoutRef.current);
            }
        };
    }, []);

    return <PageLoadingProvider loading={loading}>{children}</PageLoadingProvider>;
}
