'use client';

import { CreditCard, ChevronDown, User } from 'lucide-react';

import { cn } from '@/lib/utils';

export type InputMode = 'rfid' | 'manual';

const inputModeStyles: Record<InputMode, string> = {
    rfid:
        'rounded-md bg-white px-3 py-2 text-xs font-medium text-[#1a3d2b] dark:bg-white dark:text-[#1a3d2b]',
    manual:
        'rounded-md bg-white px-3 py-2 text-xs font-medium text-[#1a3d2b] dark:bg-white dark:text-[#1a3d2b]',
};

const inputModeLabels: Record<InputMode, string> = {
    rfid: 'RFID',
    manual: 'Manual',
};

const inputModeIcons: Record<InputMode, React.ReactNode> = {
    rfid: <CreditCard className="mr-1 inline-block size-3" />,
    manual: <User className="mr-1 inline-block size-3" />,
};

type InputModeDropdownProps = {
    value: InputMode;
    onModeChange: (mode: InputMode) => void;
    options?: InputMode[];
    disabled?: boolean;
};

export function InputModeDropdown({
    value,
    onModeChange,
    options = ['rfid', 'manual'],
    disabled = false,
}: InputModeDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    disabled={disabled}
                    className={cn(
                        'inline-flex w-full items-center justify-center gap-1 border-0 font-medium transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
                        inputModeStyles[value],
                        !disabled && 'cursor-pointer hover:opacity-90 focus:rounded-md'
                    )}
                    aria-label={`Input mode: ${value}. Click to change.`}
                >
                    {inputModeIcons[value]}
                    <span>{inputModeLabels[value]}</span>
                    <ChevronDown className="ml-1 size-3.5 opacity-70" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[8rem]">
                {options.map((mode) => (
                    <DropdownMenuItem
                        key={mode}
                        onClick={() => onModeChange(mode)}
                        className="flex cursor-pointer items-center capitalize"
                    >
                        <span className="mr-2 shrink-0">{inputModeIcons[mode]}</span>
                        {inputModeLabels[mode]}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
