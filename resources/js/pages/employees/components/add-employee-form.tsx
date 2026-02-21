import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon, Eye, EyeOff, Loader2, RefreshCw, Save, Upload } from 'lucide-react';
import { employees } from '@/routes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useRef, useState } from 'react';

const inputClassName =
    'rounded-md border border-neutral-200 bg-white ring-offset-2 outline-none focus-visible:border-text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring dark:border-neutral-800 dark:bg-neutral-950';

export type StoreEmployeeData = {
    employee_id: string;
    first_name: string;
    last_name: string;
    middle_name?: string | null;
    email?: string | null;
    phone?: string | null;
    date_of_birth?: string | null;
    gender?: string | null;
    civil_status?: string | null;
    address?: string | null;
    position_id?: number | null;
    branch_id?: number | null;
    date_hired?: string | null;
    basic_salary?: string | null;
    rfid?: string | null;
    status: 'active' | 'inactive' | 'deleted';
    photo?: File | null;
    sss?: string | null;
    philhealth?: string | null;
    pagibig?: string | null;
    tin?: string | null;
    bank_name?: string | null;
    bank_account?: string | null;
    emergency_contact_name?: string | null;
    emergency_contact_phone?: string | null;
};

type PositionOption = { id: number; name: string };
type BranchOption = { id: number; name: string };

type AddEmployeeFormProps = {
    positions?: PositionOption[];
    branches?: BranchOption[];
    onCancel?: () => void;
    onSubmit?: (data: StoreEmployeeData) => void | Promise<void>;
};

function generateEmployeeId(): string {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `EMP-${random}`;
}

export function AddEmployeeForm({
    positions = [],
    branches = [],
    onCancel,
    onSubmit,
}: AddEmployeeFormProps) {
    const [employeeId, setEmployeeId] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState<string>('');
    const [civilStatus, setCivilStatus] = useState<string>('');
    const [address, setAddress] = useState('');
    const [positionId, setPositionId] = useState<string>('');
    const [branchId, setBranchId] = useState<string>('');
    const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
    const [dateHired, setDateHired] = useState<Date | undefined>(undefined);
    const [basicSalary, setBasicSalary] = useState('');
    const [rfid, setRfid] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [dateOfBirthOpen, setDateOfBirthOpen] = useState(false);
    const [dateHiredOpen, setDateHiredOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [sss, setSss] = useState('');
    const [philhealth, setPhilhealth] = useState('');
    const [pagibig, setPagibig] = useState('');
    const [tin, setTin] = useState('');
    const [bankName, setBankName] = useState('');
    const [bankAccount, setBankAccount] = useState('');
    const [emergencyContactName, setEmergencyContactName] = useState('');
    const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleGenerateId = () => {
        setEmployeeId(generateEmployeeId());
    };

    const MAX_PHOTO_SIZE = 2 * 1024 * 1024;
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!ALLOWED_TYPES.includes(file.type)) {
            return;
        }
        if (file.size > MAX_PHOTO_SIZE) {
            return;
        }
        if (photoPreview) {
            URL.revokeObjectURL(photoPreview);
        }
        setPhoto(file);
        setPhotoPreview(URL.createObjectURL(file));
    };

    const handleRemovePhoto = () => {
        if (photoPreview) {
            URL.revokeObjectURL(photoPreview);
        }
        setPhoto(null);
        setPhotoPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!onSubmit || isSubmitting) return;
        setIsSubmitting(true);
        try {
            await onSubmit({
                employee_id: employeeId,
                first_name: firstName,
                last_name: lastName,
                middle_name: middleName || null,
                email: email || null,
                phone: phone || null,
                date_of_birth: dateOfBirth ? format(dateOfBirth, 'yyyy-MM-dd') : null,
                gender: gender || null,
                civil_status: civilStatus || null,
                address: address || null,
                position_id: positionId ? Number(positionId) : null,
                branch_id: branchId ? Number(branchId) : null,
                date_hired: dateHired ? format(dateHired, 'yyyy-MM-dd') : null,
                basic_salary: basicSalary || null,
                rfid: rfid || null,
                status: isActive ? 'active' : 'inactive',
                photo: photo ?? undefined,
                sss: sss || null,
                philhealth: philhealth || null,
                pagibig: pagibig || null,
                tin: tin || null,
                bank_name: bankName || null,
                bank_account: bankAccount || null,
                emergency_contact_name: emergencyContactName || null,
                emergency_contact_phone: emergencyContactPhone || null,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 rounded-xl bg-neutral-50/80 p-6 dark:bg-neutral-900/40"
        >
            {/* Personal Information */}
            <Card className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-md dark:border-neutral-700 dark:bg-neutral-950/50">
                <CardHeader className="pb-4">
                    <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                        Personal Information
                    </h2>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col gap-6 sm:flex-row">
                        <div className="flex flex-col items-center gap-3 sm:w-36">
                            <Avatar className="size-[90px] overflow-hidden rounded-full border-2 border-[#2e8b57] bg-neutral-100 dark:bg-neutral-800">
                                {photoPreview ? (
                                    <AvatarImage
                                        src={photoPreview}
                                        alt="Profile preview"
                                        className="object-cover"
                                    />
                                ) : (
                                    <AvatarFallback className="text-2xl font-medium text-[#2e8b57]">
                                        E
                                    </AvatarFallback>
                                )}
                            </Avatar>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".jpg,.jpeg,.png,.webp"
                                className="hidden"
                                onChange={handlePhotoChange}
                                aria-label="Upload employee photo"
                            />
                            <div className="flex w-full gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 border-neutral-200 dark:border-neutral-700"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                >
                                    <Upload className="size-4" />
                                    Upload
                                </Button>
                                {photoPreview && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="shrink-0 border-neutral-200 dark:border-neutral-700"
                                        onClick={handleRemovePhoto}
                                        aria-label="Remove photo"
                                    >
                                        ×
                                    </Button>
                                )}
                            </div>
                            <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
                                Optional. JPG, PNG or WebP (max 2MB)
                            </p>
                        </div>

                        <div className="flex-1 space-y-4">
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="employee_id">
                                        Employee ID <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="employee_id"
                                            name="employee_id"
                                            value={employeeId}
                                            onChange={e => setEmployeeId(e.target.value)}
                                            className={inputClassName}
                                            placeholder="Enter employee ID"
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleGenerateId}
                                            className="h-9 shrink-0 border-neutral-200 hover:bg-primary hover:text-white dark:border-neutral-700 dark:hover:bg-neutral-900/50 px-3 py-1"
                                            aria-label="Generate employee ID"
                                        >
                                            <RefreshCw className="size-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="first_name">
                                        First Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="first_name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className={inputClassName}
                                        placeholder="Enter first name"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last_name">
                                        Last Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="last_name"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className={inputClassName}
                                        placeholder="Enter last name"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="middle_name">Middle Name</Label>
                                    <Input
                                        id="middle_name"
                                        value={middleName}
                                        onChange={(e) => setMiddleName(e.target.value)}
                                        className={inputClassName}
                                        placeholder="Enter middle name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={inputClassName}
                                        placeholder="Enter email address"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className={inputClassName}
                                        placeholder="Enter phone number"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                                    <Popover
                                        open={dateOfBirthOpen}
                                        onOpenChange={setDateOfBirthOpen}
                                    >
                                        <PopoverTrigger asChild>
                                            <Button
                                                id="date_of_birth"
                                                variant="outline"
                                                className={cn(
                                                    inputClassName,
                                                    'h-9 w-full justify-start text-left font-normal ring-offset-2 focus-visible:border-text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                                                    !dateOfBirth && 'text-muted-foreground'
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 size-4" />
                                                {dateOfBirth
                                                    ? format(dateOfBirth, 'MMMM d, yyyy')
                                                    : 'Pick a date'}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                captionLayout="dropdown"
                                                selected={dateOfBirth}
                                                onSelect={date => {
                                                    setDateOfBirth(date);
                                                    if (date) setDateOfBirthOpen(false);
                                                }}
                                                initialFocus
                                                className="rounded-lg border"
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <input
                                        type="hidden"
                                        name="date_of_birth"
                                        value={dateOfBirth ? format(dateOfBirth, 'yyyy-MM-dd') : ''}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select value={gender || undefined} onValueChange={setGender}>
                                        <SelectTrigger
                                            className={cn(
                                                inputClassName,
                                                'ring-offset-2 focus-visible:border-text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                                            )}
                                        >
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="civil_status">Civil Status</Label>
                                    <Select value={civilStatus || undefined} onValueChange={setCivilStatus}>
                                        <SelectTrigger
                                            className={cn(
                                                inputClassName,
                                                'ring-offset-2 focus-visible:border-text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                                            )}
                                        >
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="single">Single</SelectItem>
                                            <SelectItem value="married">Married</SelectItem>
                                            <SelectItem value="widowed">Widowed</SelectItem>
                                            <SelectItem value="separated">Separated</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <textarea
                                    id="address"
                                    rows={3}
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className={cn(
                                        'w-full rounded-md px-3 py-2 text-sm shadow-xs placeholder:text-neutral-500',
                                        inputClassName
                                    )}
                                    placeholder="Enter address"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Employment Details */}
            <Card className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-md dark:border-neutral-700 dark:bg-neutral-950/50">
                <CardHeader className="pb-4">
                    <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                        Employment Details
                    </h2>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="position">Position</Label>
                            <Select
                                value={positionId}
                                onValueChange={setPositionId}
                            >
                                <SelectTrigger
                                    className={cn(
                                        inputClassName,
                                        'ring-offset-2 focus-visible:border-text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                                    )}
                                >
                                    <SelectValue placeholder="Select position" />
                                </SelectTrigger>
                                <SelectContent>
                                    {positions.map((p) => (
                                        <SelectItem
                                            key={p.id}
                                            value={String(p.id)}
                                        >
                                            {p.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="branch">Branch</Label>
                            <Select
                                value={branchId}
                                onValueChange={setBranchId}
                            >
                                <SelectTrigger
                                    className={cn(
                                        inputClassName,
                                        'ring-offset-2 focus-visible:border-text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                                    )}
                                >
                                    <SelectValue placeholder="Select branch" />
                                </SelectTrigger>
                                <SelectContent>
                                    {branches.map((b) => (
                                        <SelectItem
                                            key={b.id}
                                            value={String(b.id)}
                                        >
                                            {b.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="date_hired">Date Hired</Label>
                            <Popover
                                open={dateHiredOpen}
                                onOpenChange={setDateHiredOpen}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        id="date_hired"
                                        variant="outline"
                                        className={cn(
                                            inputClassName,
                                            'h-9 w-full justify-start text-left font-normal ring-offset-2 focus-visible:border-text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                                            !dateHired && 'text-muted-foreground'
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 size-4" />
                                        {dateHired
                                            ? format(dateHired, 'MMMM d, yyyy')
                                            : 'Pick a date'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        captionLayout="dropdown"
                                        selected={dateHired}
                                        onSelect={date => {
                                            setDateHired(date);
                                            if (date) setDateHiredOpen(false);
                                        }}
                                        initialFocus
                                        className="rounded-lg border"
                                    />
                                </PopoverContent>
                            </Popover>
                            <input
                                type="hidden"
                                name="date_hired"
                                value={dateHired ? format(dateHired, 'yyyy-MM-dd') : ''}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="basic_salary">Basic Salary (₱)</Label>
                            <Input
                                id="basic_salary"
                                type="number"
                                value={basicSalary}
                                onChange={(e) => setBasicSalary(e.target.value)}
                                className={inputClassName}
                                placeholder="0.00"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="rfid">RFID Card Number</Label>
                            <Input
                                id="rfid"
                                value={rfid}
                                onChange={(e) => setRfid(e.target.value)}
                                className={inputClassName}
                                placeholder="Enter RFID number"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="hidden"
                            name="active"
                            value={isActive ? '1' : '0'}
                        />
                        <Label htmlFor="active-switch" className="text-sm font-medium">
                            Active
                        </Label>
                        <Switch
                            id="active-switch"
                            checked={isActive}
                            onCheckedChange={setIsActive}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* User Account & Role */}
            <Card className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-md dark:border-neutral-700 dark:bg-neutral-950/50">
                <CardHeader className="pb-4">
                    <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                        User Account & Role
                    </h2>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="role">
                                Role <span className="text-red-500">*</span>
                            </Label>
                            <Select defaultValue="employee">
                                <SelectTrigger
                                    className={cn(
                                        inputClassName,
                                        'ring-offset-2 focus-visible:border-text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                                    )}
                                >
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="employee">Employee</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="manager">Manager</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">
                                Password <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    className={cn(inputClassName, 'pr-10')}
                                    placeholder="Min 8 characters"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <EyeOff className="size-4" />
                                    ) : (
                                        <Eye className="size-4" />
                                    )}
                                </button>
                            </div>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                Employee will login using their email and this password
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Government IDs & Banking */}
            <Card className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-md dark:border-neutral-700 dark:bg-neutral-950/50">
                <CardHeader className="pb-4">
                    <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                        Government IDs & Banking
                    </h2>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="sss">SSS Number</Label>
                            <Input
                                id="sss"
                                value={sss}
                                onChange={(e) => setSss(e.target.value)}
                                className={inputClassName}
                                placeholder="Enter SSS number"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="philhealth">PhilHealth Number</Label>
                            <Input
                                id="philhealth"
                                value={philhealth}
                                onChange={(e) => setPhilhealth(e.target.value)}
                                className={inputClassName}
                                placeholder="Enter PhilHealth number"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pagibig">Pag-IBIG Number</Label>
                            <Input
                                id="pagibig"
                                value={pagibig}
                                onChange={(e) => setPagibig(e.target.value)}
                                className={inputClassName}
                                placeholder="Enter Pag-IBIG number"
                            />
                        </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="tin">TIN Number</Label>
                            <Input
                                id="tin"
                                value={tin}
                                onChange={(e) => setTin(e.target.value)}
                                className={inputClassName}
                                placeholder="Enter TIN number"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bank_name">Bank Name</Label>
                            <Input
                                id="bank_name"
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                                className={inputClassName}
                                placeholder="Enter bank name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bank_account">Bank Account Number</Label>
                            <Input
                                id="bank_account"
                                value={bankAccount}
                                onChange={(e) => setBankAccount(e.target.value)}
                                className={inputClassName}
                                placeholder="Enter account number"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-md dark:border-neutral-700 dark:bg-neutral-950/50">
                <CardHeader className="pb-4">
                    <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                        Emergency Contact
                    </h2>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="emergency_contact_name">
                                Emergency Contact Name
                            </Label>
                            <Input
                                id="emergency_contact_name"
                                value={emergencyContactName}
                                onChange={(e) => setEmergencyContactName(e.target.value)}
                                className={inputClassName}
                                placeholder="Contact person name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="emergency_contact_phone">
                                Emergency Contact Phone
                            </Label>
                            <Input
                                id="emergency_contact_phone"
                                value={emergencyContactPhone}
                                onChange={(e) => setEmergencyContactPhone(e.target.value)}
                                className={inputClassName}
                                placeholder="Contact phone number"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
                {onCancel ? (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                ) : (
                    <Button type="button" variant="outline" asChild>
                        <Link href={employees().url}>Cancel</Link>
                    </Button>
                )}
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#1f5c35] text-white hover:bg-[#1f5c35]/90 disabled:opacity-70"
                >
                    {isSubmitting ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        <Save className="size-4" />
                    )}
                    {isSubmitting ? 'Saving...' : 'Save Employee'}
                </Button>
            </div>
        </form>
    );
}
