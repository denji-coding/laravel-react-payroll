'use client';

import { Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';

export function AttendanceTerminalHeader() {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const time = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });
    const dateFormatted = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <header className="mb-6 space-y-1 text-center mt-5">
            <p className="text-4xl font-bold tracking-tight leading-tight text-[#1a3d2b] text-neutral-900 sm:text-7xl">
                {time}
            </p>
            <p className="text-base text-neutral-600 text-center">
                Scan your ID card or enter your Employee ID to log attendance
            </p>
            <div className="mt-7 flex items-center justify-center gap-2 text-md text-neutral-600">
                <Calendar className="size-6 shrink-0" />
                <span>{dateFormatted}</span>
            </div>
        </header>
    );
}
