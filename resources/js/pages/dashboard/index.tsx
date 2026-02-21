import { Head } from '@inertiajs/react';
import {
    Building2,
    Calendar,
    Clock,
    DollarSign,
    TrendingUp,
    Users,
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { Announcements } from './components/announcements';
import { ChartAreaDefault } from './components/chart-area';
import { ChartBarActive } from './components/bar-chart-active';
import { ChartBarMixed } from './components/bar-chart';
import { ChartPieDonut } from './components/pie-chart';
import { RecentLeaveRequests } from './components/recent-leave-requests';
import { SectionCard } from './components/section-card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface DashboardStats {
    totalEmployees: number;
    activeBranches: number;
    presentToday: number;
    presentPercentage: number;
    pendingLeaves: number;
    payrollThisMonth: number;
    avgAttendance: number;
}

export default function Dashboard() {
    const { auth, stats } = usePage<SharedData & { stats: DashboardStats }>()
        .props;
    const userName = auth?.user?.name ?? 'User';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground">
                        Welcome back, {userName}! Here&apos;s what&apos;s
                        happening today.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <SectionCard
                        title="Total Employees"
                        value={stats.totalEmployees}
                        icon={Users}
                    />
                    <SectionCard
                        title="Active Branches"
                        value={stats.activeBranches}
                        icon={Building2}
                    />
                    <SectionCard
                        title="Present Today"
                        value={stats.presentToday}
                        subtitle={`${stats.presentPercentage}%`}
                        icon={Clock}
                    />
                    <SectionCard
                        title="Pending Leaves"
                        value={stats.pendingLeaves}
                        icon={Calendar}
                    />
                    <SectionCard
                        title="Payroll This Month"
                        value={`₱${stats.payrollThisMonth.toLocaleString()}`}
                        icon={DollarSign}
                    />
                    <SectionCard
                        title="Avg. Attendance"
                        value={`${stats.avgAttendance}%`}
                        icon={TrendingUp}
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <ChartAreaDefault />
                    <ChartPieDonut />
                    <ChartBarMixed />
                    <ChartBarActive />
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <RecentLeaveRequests />
                    <Announcements />
                </div>
            </div>
        </AppLayout>
    );
}
