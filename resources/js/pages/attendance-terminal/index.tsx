import { Head } from '@inertiajs/react';
import { AttendanceTerminalHeader } from '@/components/attendance-terminal-header';
import { AttendanceTerminalSidebar } from '@/components/attendance-terminal-sidebar';
import {
    AttendanceTerminalDataTable,
} from '@/pages/attendance-terminal/data-table/data-table';
import {
    createAttendanceColumns,
    type AttendanceRecord,
} from '@/pages/attendance-terminal/data-table/columns';

type AttendanceTerminalPageProps = {
    records?: AttendanceRecord[];
};

export default function AttendanceTerminal({ records = [] }: AttendanceTerminalPageProps) {
    const columns = createAttendanceColumns();
    const data = records.map((r, i) => ({ ...r, no: i + 1 }));

    return (
        <>
            <Head title="Attendance Terminal" />
            <div className="flex min-h-screen w-full flex-col bg-neutral-100 dark:bg-neutral-900 sm:flex-row">
                <AttendanceTerminalSidebar />
                <main className="flex flex-1 flex-col overflow-auto p-6">
                    <div className="mx-auto w-full max-w-6xl">
                        <AttendanceTerminalHeader />
                        <AttendanceTerminalDataTable columns={columns} data={data} />
                    </div>
                </main>
            </div>
        </>
    );
}
