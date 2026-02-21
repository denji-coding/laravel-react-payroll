import * as React from 'react';
import { EyeClosed, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

const iconClass = 'h-4 w-4 shrink-0';

const PasswordInput = React.forwardRef<
    HTMLInputElement,
    React.ComponentProps<typeof Input> & { containerClassName?: string }
>(function PasswordInput({ className, containerClassName, type: _type, ...props }, ref) {
    const [visible, setVisible] = React.useState(false);

    return (
        <div className={cn('relative w-full', containerClassName)}>
            <Input
                ref={ref}
                type={visible ? 'text' : 'password'}
                className={cn('pr-9', className)}
                {...props}
            />
            <button
                type="button"
                tabIndex={-1}
                onClick={() => setVisible((v) => !v)}
                className="absolute inset-y-0 right-0 z-10 flex w-9 flex-shrink-0 items-center justify-center rounded-r-md border-0 bg-transparent text-gray-500 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset dark:text-gray-400 dark:hover:text-gray-300"
                aria-label={visible ? 'Hide password' : 'Show password'}
            >
                {visible ? <EyeClosed className={iconClass} aria-hidden /> : <Eye className={iconClass} aria-hidden />}
            </button>
        </div>
    );
});

export { PasswordInput };
