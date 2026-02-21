import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const [bgImageFailed, setBgImageFailed] = useState(false);
    const authBackgroundUrl =
        (usePage().props as { authBackgroundUrl?: string }).authBackgroundUrl ??
        '/images/image_bg.jpg';

    return (
        <div className="relative flex h-svh min-h-0 flex-col items-center justify-center overflow-x-hidden overflow-y-hidden p-4 md:p-6">
            {/* Background: image with blur, or neutral gradient if image missing/fails */}
            <div
                aria-hidden
                className="absolute inset-0 overflow-hidden bg-gradient-to-br from-gray-300 via-gray-200 to-gray-400 dark:from-gray-800 dark:via-gray-900 dark:to-gray-700"
            >
                {authBackgroundUrl && !bgImageFailed && (
                    <img
                        src={authBackgroundUrl}
                        alt=""
                        aria-hidden
                        className="absolute inset-0 h-full w-full scale-105 object-cover object-center blur-[6px]"
                        onError={() => setBgImageFailed(true)}
                    />
                )}
            </div>
            {/* Subtle overlay for readability */}
            <div
                aria-hidden
                className="absolute inset-0 bg-black/30 dark:bg-black/50"
            />

            {/* Centered card */}
            <div className="relative z-10 w-full max-w-sm min-w-0 flex-shrink-0">
                <div className="flex min-h-0 flex-col gap-5 rounded-2xl border border-white/20 bg-white/95 px-6 py-6 shadow-2xl backdrop-blur-md dark:border-white/10 dark:bg-gray-900/95">
                    <div className="flex flex-col items-center gap-2">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-1 font-medium"
                        >
                            <div className="flex h-24 w-24 items-center justify-center rounded-md">
                                <AppLogoIcon className="size-8 fill-current text-[var(--foreground)] dark:text-white" />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-0.5 text-center">
                            <h1 className="text-lg font-medium">{title}</h1>
                            <p className="text-center text-xs text-muted-foreground">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
