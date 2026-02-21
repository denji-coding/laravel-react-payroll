'use client';

import { Clock, CreditCard, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type InputMode = 'rfid' | 'manual';

const inputModeTabs: { value: InputMode; label: string; icon: React.ReactNode }[] = [
    { value: 'rfid', label: 'RFID', icon: <CreditCard className="mr-1 inline-block size-3" /> },
    { value: 'manual', label: 'Manual', icon: <User className="mr-1 inline-block size-3" /> },
];

const RFID_MANUAL_CLEAR_DELAY_MS = 100;

export function AttendanceTerminalSidebar() {
    const [inputMode, setInputMode] = useState<InputMode>('rfid');
    const [rfidValue, setRfidValue] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const rfidInputRef = useRef<HTMLInputElement>(null);
    const employeeIdInputRef = useRef<HTMLInputElement>(null);
    const rfidClearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (inputMode === 'rfid') {
            rfidInputRef.current?.focus();
        } else {
            employeeIdInputRef.current?.focus();
        }
    }, [inputMode]);

    useEffect(
        () => () => {
            if (rfidClearTimerRef.current) {
                clearTimeout(rfidClearTimerRef.current);
            }
        },
        []
    );

    const handleSubmit = () => {
        if (inputMode === 'manual' && employeeId.trim()) {
            // TODO: Submit attendance
        }
    };

    const handleRfidSubmit = () => {
        if (rfidValue.trim()) {
            // TODO: Submit RFID attendance
            if (rfidClearTimerRef.current) {
                clearTimeout(rfidClearTimerRef.current);
                rfidClearTimerRef.current = null;
            }
            setRfidValue('');
        }
    };

    const handleRfidInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setRfidValue(newValue);

        if (rfidClearTimerRef.current) {
            clearTimeout(rfidClearTimerRef.current);
        }

        rfidClearTimerRef.current = setTimeout(() => {
            rfidClearTimerRef.current = null;
            setRfidValue((prev) => (prev.length === 1 ? '' : prev));
        }, RFID_MANUAL_CLEAR_DELAY_MS);
    };

    return (
        <aside className="flex w-full max-w-[320px] flex-col bg-primary p-6 sm:max-w-[280px]">
            {/* Header: Logo, company name, system name */}
            <div className="mb-8 flex flex-col items-center text-center">
                <div className="relative mb-3">
                    <div className="flex size-[10rem] items-center justify-center rounded-full">
                        <AppLogoIcon className="size-20 shrink-0 object-contain" />
                    </div>
                </div>
                <span className="font-sans text-center text-2xl font-bold leading-tight text-white">
                    <span className="block">Migrants Venture</span>
                    <span className="block">Corporation</span>
                </span>
                <p className="text-center mt-2 text-sm text-white">
                    Employee Attendance System
                </p>
            </div>

            {/* Input Mode: Label + Status tab buttons */}
            <div className="mb-6 flex flex-col space-y-2">
                <p className="text-center text-sm text-white">Input Mode</p>
                <div className="flex w-full flex-wrap justify-center gap-1 rounded-md border border-white/20 bg-white/10 p-0.5">
                    {inputModeTabs.map((tab) => (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => setInputMode(tab.value)}
                            className={cn(
                                'min-w-[5rem] flex-1 shrink-0 rounded-md px-4 py-1 text-sm font-medium transition-colors whitespace-nowrap cursor-pointer',
                                inputMode === tab.value
                                    ? 'bg-white text-[#1a3d2b] shadow-sm'
                                    : 'text-white hover:bg-white/20 hover:text-white'
                            )}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* RFID Card Number / Manual Input */}
            <div className="mb-8 flex-1 space-y-2">
                {inputMode === 'rfid' ? (
                    <>
                        <p className="text-sm font-bold text-white">RFID Card Number</p>
                        <div className="relative flex min-h-[48px] items-center justify-center rounded-md border border-white bg-transparent px-3 py-2.5 focus-within:ring-2 focus-within:ring-green-500/50 focus-within:ring-offset-2 focus-within:ring-offset-primary">
                            <input
                                type="text"
                                value={rfidValue}
                                placeholder="Waiting for RFID scan..."
                                className="pointer-events-none w-full bg-transparent text-center text-sm text-green-400 placeholder:text-white"
                                readOnly
                                tabIndex={-1}
                                aria-hidden
                            />
                            <input
                                ref={rfidInputRef}
                                type="text"
                                value={rfidValue}
                                onChange={handleRfidInput}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleRfidSubmit();
                                    }
                                }}
                                className="absolute inset-0 size-full min-w-0 opacity-0"
                                autoFocus
                                autoComplete="off"
                                aria-label="RFID scanner input"
                            />
                        </div>
                    </>
                ) : (
                    <>
                        
                        <p className="text-sm font-bold text-white">Employee ID</p>
                        
                        <div className="flex min-h-[48px] items-center justify-center rounded-md border border-white bg-transparent px-3 py-2.5 focus-within:ring-2 focus-within:ring-green-500/50 focus-within:ring-offset-2 focus-within:ring-offset-primary">
                            <input
                                ref={employeeIdInputRef}
                                value={employeeId}
                                onChange={(e) => setEmployeeId(e.target.value)}
                                placeholder="ENTER EMPLOYEE ID"
                                className="w-full bg-transparent text-center text-sm text-green-400 placeholder:text-white focus:outline-none"
                                autoFocus
                            />
                        </div>
                        
                        <Button
                            onClick={handleSubmit}
                            disabled={!employeeId.trim()}
                            className="w-full gap-2 bg-white text-[#1a3d2b] hover:bg-gray-400 disabled:pointer-events-auto disabled:bg-white mt-2 disabled:text-[#1a3d2b] disabled:opacity-70 cursor-pointer disabled:cursor-not-allowed"
                        >
                            <Clock className="size-4" />
                            Submit
                        </Button>
                    </>
                )}
            </div>

            <p className="text-center text-xs text-white">© 2026 MVC Corporation</p>
        </aside>
    );
}
