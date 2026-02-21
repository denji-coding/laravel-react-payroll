import { Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import {
    Building2,
    Calendar,
    CalendarClock,
    ChevronDown,
    ClipboardList,
    Clock,
    DollarSign,
    FileText,
    LayoutGrid,
    Monitor,
    Receipt,
    Settings,
    Briefcase,
    Users,
} from 'lucide-react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { toUrl } from '@/lib/utils';
import {
    attendance,
    attendanceTerminal,
    branches,
    dashboard,
    dtr,
    employees,
    leaves,
    myAttendance,
    myPayslips,
    payroll,
    positions,
    reports,
    settings,
    timeSchedule,
} from '@/routes';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
        icon: LayoutGrid,
    },
    {
        title: 'Employees',
        href: employees().url,
        icon: Users,
    },
    {
        title: 'Positions',
        href: positions().url,
        icon: Briefcase,
    },
    {
        title: 'Branches',
        href: branches().url,
        icon: Building2,
    },
    {
        title: 'Time Schedule',
        href: timeSchedule().url,
        icon: CalendarClock,
    },
    {
        title: 'Attendance Terminal',
        href: attendanceTerminal().url,
        icon: Monitor,
        openInNewTab: true,
    },
    {
        title: 'Attendance',
        href: attendance().url,
        icon: Clock,
    },
    {
        title: 'Leaves',
        href: leaves().url,
        icon: Calendar,
    },
    {
        title: 'Payroll',
        href: payroll().url,
        icon: DollarSign,
    },
    {
        title: 'Reports',
        href: reports().url,
        icon: FileText,
    },
    {
        title: 'Settings',
        href: settings().url,
        icon: Settings,
    },
];

const employeePortalItems: NavItem[] = [
    {
        title: 'DTR',
        href: dtr().url,
        icon: ClipboardList,
    },
    {
        title: 'My Attendance',
        href: myAttendance().url,
        icon: FileText,
    },
    {
        title: 'My Payslips',
        href: myPayslips().url,
        icon: Receipt,
    },
];

function isExternalHref(href: NavItem['href']): boolean {
    const url = toUrl(href);
    return url.startsWith('http://') || url.startsWith('https://');
}

export function AppSidebar() {
    const { state } = useSidebar();
    const { isCurrentUrl } = useCurrentUrl();
    const [employeePortalOpen, setEmployeePortalOpen] = useState(true);
    const employeePortalContentRef = useRef<HTMLDivElement>(null);
    const prevOpenRef = useRef(employeePortalOpen);

    useEffect(() => {
        const justOpened = employeePortalOpen && !prevOpenRef.current;
        prevOpenRef.current = employeePortalOpen;
        if (justOpened && employeePortalContentRef.current) {
            const timer = setTimeout(() => {
                employeePortalContentRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                });
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [employeePortalOpen]);

    return (
        <Sidebar collapsible="icon" variant="inset" className="bg-[-background] text-white">
            <SidebarHeader className="bg-[--background] px-2 pb-2 pt-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="!h-auto min-h-12 py-3">
                            <Link href={dashboard().url} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="bg-[-background]">
                <NavMain items={mainNavItems} />
                <Collapsible
                    open={state === 'collapsed' ? true : employeePortalOpen}
                    onOpenChange={setEmployeePortalOpen}
                    className="mt-auto"
                >
                    <SidebarGroup className="group-data-[collapsible=icon]:p-0">
                        <CollapsibleTrigger asChild>
                            <SidebarGroupLabel className="flex cursor-pointer items-center justify-between text-white [&[data-state=open]>svg]:rotate-180">
                                Employee Portal
                                <ChevronDown className="size-4 shrink-0 text-white transition-transform duration-200" />
                            </SidebarGroupLabel>
                        </CollapsibleTrigger>
                        <CollapsibleContent ref={employeePortalContentRef}>
                            <SidebarGroupContent>
                                <SidebarMenu className="group-data-[collapsible=icon]:items-center">
                                    {employeePortalItems.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={isCurrentUrl(item.href)}
                                                className="text-white hover:text-white"
                                                tooltip={{ children: item.title }}
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
            </SidebarContent>

            <SidebarFooter className="mt-auto shrink-0 bg-[--background] px-2 pb-2 pt-2">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
