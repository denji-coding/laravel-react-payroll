import type { ComponentPropsWithoutRef } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { toUrl } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types';

function isExternalHref(href: NavItem['href']): boolean {
    const url = toUrl(href);
    return url.startsWith('http://') || url.startsWith('https://');
}

export function NavFooter({
    items,
    label = 'Employee Portal',
    className,
    defaultOpen = false,
    ...props
}: ComponentPropsWithoutRef<typeof SidebarGroup> & {
    items: NavItem[];
    label?: string;
    defaultOpen?: boolean;
}) {
    return (
        <Collapsible defaultOpen={defaultOpen}>
            <SidebarGroup
                {...props}
                className={cn(
                    'group-data-[collapsible=icon]:p-0',
                    className
                )}
            >
                <CollapsibleTrigger asChild>
                    <SidebarGroupLabel className="flex cursor-pointer items-center justify-between text-white [&[data-state=open]>svg]:rotate-180">
                        {label}
                        <ChevronDown className="size-4 shrink-0 text-white transition-transform duration-200" />
                    </SidebarGroupLabel>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        className="text-white hover:text-white"
                                    >
                                        {isExternalHref(item.href) ? (
                                            <a
                                                href={toUrl(item.href)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {item.icon && (
                                                    <item.icon className="h-5 w-5" />
                                                )}
                                                <span>{item.title}</span>
                                            </a>
                                        ) : (
                                            <Link href={item.href} prefetch>
                                                {item.icon && (
                                                    <item.icon className="h-5 w-5" />
                                                )}
                                                <span>{item.title}</span>
                                            </Link>
                                        )}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </CollapsibleContent>
            </SidebarGroup>
        </Collapsible>
    );
}
