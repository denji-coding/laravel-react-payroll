import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SectionCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    className?: string;
}

export function SectionCard({
    title,
    value,
    subtitle,
    icon: Icon,
    className,
}: SectionCardProps) {
    return (
        <Card
            className={cn(
                'border-sidebar-border/70 dark:border-sidebar-border',
                className
            )}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                    {title}
                </h3>
                <Icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {subtitle && (
                    <p className="text-xs text-muted-foreground">{subtitle}</p>
                )}
            </CardContent>
        </Card>
    );
}
