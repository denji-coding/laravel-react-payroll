import { cn } from '@/lib/utils';

const LOGO_SRC = '/images/company-logo.png';

type LogoLoadingProps = {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
};

const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32',
};

export function LogoLoading({ className, size = 'md' }: LogoLoadingProps) {
    return (
        <div
            className={cn('relative flex shrink-0 items-center justify-center', className)}
            role="status"
            aria-label="Loading"
        >
            {/* Circling border - SVG stroke animates around the circle */}
            <svg
                className={cn('absolute animate-[spin_1.2s_linear_infinite]', sizeClasses[size])}
                viewBox="0 0 100 100"
                aria-hidden
            >
                <circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="60 250"
                    className="text-primary/60"
                />
            </svg>
            {/* Logo with blink */}
            <img
                src={LOGO_SRC}
                alt=""
                className={cn(
                    'relative z-10 object-contain animate-logo-blink',
                    sizeClasses[size],
                )}
            />
        </div>
    );
}
