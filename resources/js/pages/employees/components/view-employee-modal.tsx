import { Briefcase, CreditCard, Phone, Shield, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export type ViewEmployeeData = {
    id?: string;
    employeeId?: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    middleName?: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: string;
    civilStatus?: string;
    address?: string;
    position?: string;
    branch?: string;
    status?: string;
    dateHired?: string;
    basicSalary?: string;
    rfid?: string;
    isActive?: boolean;
    role?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    sss?: string;
    philhealth?: string;
    pagibig?: string;
    tin?: string;
    bankName?: string;
    bankAccount?: string;
};

type ViewEmployeeModalProps = {
    employee: ViewEmployeeData | null;
};

const iconClassName = 'size-4 shrink-0 text-[#2e8b57] dark:text-[#2e8b57]';

function Field({ label, value }: { label: string; value?: string | null }) {
    return (
        <div className="flex flex-col gap-0.5">
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {label}
            </p>
            <p className="text-sm text-neutral-900 dark:text-neutral-100">
                {value ?? '—'}
            </p>
        </div>
    );
}

function SectionHeader({
    icon: Icon,
    title,
}: {
    icon: React.ElementType;
    title: string;
}) {
    return (
        <div className="mb-4 flex items-center gap-2">
            <Icon className={iconClassName} strokeWidth={1.5} />
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                {title}
            </h3>
        </div>
    );
}

function statusBadgeClass(status?: string) {
    switch (status?.toLowerCase()) {
        case 'active':
            return 'rounded-full bg-[#2e8b57] px-2.5 py-0.5 text-xs font-medium text-white';
        case 'inactive':
            return 'rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
        case 'deleted':
            return 'rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400';
        default:
            return 'rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-800 dark:bg-neutral-900/30 dark:text-neutral-400';
    }
}

export function ViewEmployeeModal({ employee }: ViewEmployeeModalProps) {
    if (!employee) return null;

    const displayName =
        employee.name ??
        [employee.firstName, employee.middleName, employee.lastName]
            .filter(Boolean)
            .join(' ');

    const roleOrPosition = employee.position ?? employee.role ?? '—';

    const formatSalary = (value?: string | null) => {
        if (!value) return '—';
        const num = parseFloat(value);
        if (Number.isNaN(num)) return value;
        return `₱${num.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
    };

    return (
        <div className="space-y-6 rounded-md border bg-white p-6 dark:bg-neutral-950">
            {/* Header Section */}
            <div className="flex items-start gap-5">
                <Avatar className="size-20 shrink-0 overflow-hidden rounded-full border-2 border-[#2e8b57] bg-[#2e8b57]/10 dark:bg-[#2e8b57]/20">
                    <AvatarFallback className="text-2xl font-medium text-[#2e8b57]">
                        {displayName?.charAt(0)?.toUpperCase() ?? 'E'}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                        {displayName || '—'}
                    </h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {roleOrPosition}
                    </p>
                    {employee.status && (
                        <span
                            className={cn(
                                'mt-1 inline-flex w-fit',
                                statusBadgeClass(employee.status)
                            )}
                        >
                            {employee.status}
                        </span>
                    )}
                </div>
            </div>

            {/* Two-Column Layout */}
            <div className="grid gap-8 lg:grid-cols-2">
                {/* Left Column */}
                <div className="space-y-6">
                    {/* Personal Information */}
                    <div>
                        <SectionHeader icon={User} title="Personal Information" />
                        <div className="space-y-4">
                            <Field
                                label="Employee ID"
                                value={employee.employeeId ?? employee.id}
                            />
                            <Field label="Email" value={employee.email} />
                            <Field label="Phone" value={employee.phone} />
                            <Field label="Date of Birth" value={employee.dateOfBirth} />
                            <Field label="Gender" value={employee.gender} />
                            <Field label="Civil Status" value={employee.civilStatus} />
                            <Field label="Address" value={employee.address} />
                        </div>
                    </div>

                    {/* Government IDs */}
                    <div>
                        <SectionHeader icon={Shield} title="Government IDs" />
                        <div className="space-y-4">
                            <Field label="SSS Number" value={employee.sss} />
                            <Field
                                label="PhilHealth Number"
                                value={employee.philhealth}
                            />
                            <Field label="Pag-IBIG Number" value={employee.pagibig} />
                            <Field label="TIN Number" value={employee.tin} />
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Employment Details */}
                    <div>
                        <SectionHeader icon={Briefcase} title="Employment Details" />
                        <div className="space-y-4">
                            <Field label="Position" value={employee.position} />
                            <Field label="Branch" value={employee.branch} />
                            <Field label="Date Hired" value={employee.dateHired} />
                            <Field
                                label="Basic Salary"
                                value={
                                    employee.basicSalary
                                        ? formatSalary(employee.basicSalary)
                                        : '—'
                                }
                            />
                            <Field label="RFID Card" value={employee.rfid} />
                        </div>
                    </div>

                    {/* Banking Information */}
                    <div>
                        <SectionHeader icon={CreditCard} title="Banking Information" />
                        <div className="space-y-4">
                            <Field label="Bank Name" value={employee.bankName} />
                            <Field label="Account Number" value={employee.bankAccount} />
                        </div>
                    </div>

                    {/* Emergency Contact */}
                    <div>
                        <SectionHeader icon={Phone} title="Emergency Contact" />
                        <div className="space-y-4">
                            <Field
                                label="Contact Name"
                                value={employee.emergencyContactName}
                            />
                            <Field
                                label="Contact Phone"
                                value={employee.emergencyContactPhone}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
