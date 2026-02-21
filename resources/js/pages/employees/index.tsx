import { Head, router } from '@inertiajs/react';
import { Plus, Search, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useMemo, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { employees } from '@/routes';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { AddEmployeeForm } from '@/pages/employees/components/add-employee-form';
import {
    EditEmployeeForm,
    type EditEmployeeFormData,
} from '@/pages/employees/components/edit-employee-form';
import { ViewEmployeeModal, type ViewEmployeeData } from '@/pages/employees/components/view-employee-modal';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';
import {
    deleteEmployee,
    forceDeleteEmployee,
    storeEmployee,
    updateEmployee,
} from '@/lib/api/employees';
import {
    createEmployeeColumns,
    type Employee,
} from './data-table/columns';
import type { StoreEmployeeData } from './components/add-employee-form';
import { DataTable } from './data-table/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Employees',
        href: employees().url,
    },
];

type StatusFilter = 'all' | 'active' | 'inactive' | 'deleted';

const statusTabs: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'deleted', label: 'Deleted' },
];

function filterEmployees(
    employees: Employee[],
    search: string,
    statusFilter: StatusFilter
) {
    const searchLower = search.toLowerCase().trim();
    return employees.filter((employee) => {
        const matchesStatus =
            statusFilter === 'all' || employee.status === statusFilter;
        const matchesSearch =
            !searchLower ||
            String(employee.employee_id).toLowerCase().includes(searchLower) ||
            employee.name.toLowerCase().includes(searchLower) ||
            employee.position.toLowerCase().includes(searchLower) ||
            employee.branch.toLowerCase().includes(searchLower);
        return matchesStatus && matchesSearch;
    });
}

type Position = { id: number; name: string };
type Branch = { id: number; name: string };

type EmployeesPageProps = {
    employees?: Employee[];
    positions: Position[];
    branches: Branch[];
};

export default function Employees({ employees, positions, branches }: EmployeesPageProps) {
    const loading = employees === undefined;

    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [search, setSearch] = useState('');
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<EditEmployeeFormData | null>(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [viewingEmployee, setViewingEmployee] = useState<ViewEmployeeData | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState<{
        employee: Employee;
        force: boolean;
    } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const mapToViewData = (emp: Employee & { status?: string }) => ({
        id: String(emp.employee_id),
        employeeId: emp.employee_id,
        name: emp.name,
        position: emp.position,
        branch: emp.branch,
        status: emp.status,
    });

    const filteredEmployees = useMemo(
        () => filterEmployees((employees ?? []) as Employee[], search, statusFilter),
        [employees, search, statusFilter]
    );

    const employeeColumns = useMemo(
        () =>
            createEmployeeColumns({
                statusFilter,
                onEdit: (emp) => {
                    setEditingEmployee(emp as unknown as EditEmployeeFormData);
                    setEditModalOpen(true);
                },
                onView: (emp) => {
                    setViewingEmployee(mapToViewData(emp));
                    setViewModalOpen(true);
                },
                onDelete: (emp) => {
                    setEmployeeToDelete({
                        employee: emp,
                        force: statusFilter === 'deleted',
                    });
                    setDeleteConfirmOpen(true);
                },
                onRestore:
                    statusFilter === 'deleted'
                        ? async (emp) => {
                              const full = emp as unknown as EditEmployeeFormData & {
                                  photo?: string;
                              };
                              try {
                                  await updateEmployee({
                                      id: full.id,
                                      employee_id: full.employee_id,
                                      first_name: full.first_name,
                                      last_name: full.last_name,
                                      middle_name: full.middle_name ?? null,
                                      email: full.email ?? null,
                                      phone: full.phone ?? null,
                                      date_of_birth: full.date_of_birth ?? null,
                                      gender: full.gender ?? null,
                                      civil_status: full.civil_status ?? null,
                                      address: full.address ?? null,
                                      position_id: full.position_id ?? null,
                                      branch_id: full.branch_id ?? null,
                                      date_hired: full.date_hired ?? null,
                                      basic_salary: full.basic_salary ?? null,
                                      rfid: full.rfid ?? null,
                                      status: 'active',
                                      sss: full.sss ?? null,
                                      philhealth: full.philhealth ?? null,
                                      pagibig: full.pagibig ?? null,
                                      tin: full.tin ?? null,
                                      bank_name: full.bank_name ?? null,
                                      bank_account: full.bank_account ?? null,
                                      emergency_contact_name:
                                          full.emergency_contact_name ?? null,
                                      emergency_contact_phone:
                                          full.emergency_contact_phone ?? null,
                                  });
                                  toast.success('Employee restored', {
                                      description: `${emp.name} has been restored successfully.`,
                                  });
                                  router.reload();
                              } catch (err: unknown) {
                                  const axiosErr = err as {
                                      response?: {
                                          data?: {
                                              message?: string;
                                              errors?: Record<string, string[]>;
                                          };
                                      };
                                  };
                                  const responseData = axiosErr?.response?.data;
                                  const message =
                                      responseData?.message ||
                                      (responseData?.errors &&
                                      typeof responseData.errors === 'object'
                                          ? Object.values(responseData.errors)
                                                .flat()
                                                .join(' ')
                                          : 'Failed to restore employee.');
                                  toast.error('Error', {
                                      description: String(message),
                                  });
                              }
                          }
                        : undefined,
                onStatusChange: async (emp, newStatus) => {
                    const full = emp as unknown as EditEmployeeFormData & { photo?: string };
                    try {
                        await updateEmployee({
                            id: full.id,
                            employee_id: full.employee_id,
                            first_name: full.first_name,
                            last_name: full.last_name,
                            middle_name: full.middle_name ?? null,
                            email: full.email ?? null,
                            phone: full.phone ?? null,
                            date_of_birth: full.date_of_birth ?? null,
                            gender: full.gender ?? null,
                            civil_status: full.civil_status ?? null,
                            address: full.address ?? null,
                            position_id: full.position_id ?? null,
                            branch_id: full.branch_id ?? null,
                            date_hired: full.date_hired ?? null,
                            basic_salary: full.basic_salary ?? null,
                            rfid: full.rfid ?? null,
                            status: newStatus,
                            sss: full.sss ?? null,
                            philhealth: full.philhealth ?? null,
                            pagibig: full.pagibig ?? null,
                            tin: full.tin ?? null,
                            bank_name: full.bank_name ?? null,
                            bank_account: full.bank_account ?? null,
                            emergency_contact_name: full.emergency_contact_name ?? null,
                            emergency_contact_phone: full.emergency_contact_phone ?? null,
                        });
                        toast.success('Status updated', {
                            description: `Employee status changed to ${newStatus}.`,
                        });
                        router.reload();
                    } catch (err: unknown) {
                        const axiosErr = err as {
                            response?: {
                                data?: {
                                    message?: string;
                                    errors?: Record<string, string[]>;
                                };
                            };
                        };
                        const responseData = axiosErr?.response?.data;
                        let message = 'Failed to update status.';
                        if (responseData?.message) {
                            message = String(responseData.message);
                        } else if (
                            responseData?.errors &&
                            typeof responseData.errors === 'object'
                        ) {
                            message = Object.values(responseData.errors)
                                .flat()
                                .join(' ');
                        }
                        toast.error('Error', { description: message });
                    }
                },
            }),
        [statusFilter]
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleStatusChange = (value: StatusFilter) => {
        setStatusFilter(value);
    };

    const handleConfirmDelete = async () => {
        if (!employeeToDelete) return;
        const { employee, force } = employeeToDelete;
        setIsDeleting(true);
        try {
            if (force) {
                await forceDeleteEmployee(employee.id);
                toast.success('Employee deleted', {
                    description: `${employee.name} has been permanently removed.`,
                });
            } else {
                await deleteEmployee(employee.id);
                toast.success('Employee deleted', {
                    description: `${employee.name} has been removed.`,
                });
            }
            setDeleteConfirmOpen(false);
            setEmployeeToDelete(null);
            router.reload();
        } catch (err: unknown) {
            const axiosErr = err as {
                response?: {
                    data?: {
                        message?: string;
                        errors?: Record<string, string[]>;
                    };
                };
            };
            const responseData = axiosErr?.response?.data;
            const message =
                responseData?.message ||
                (responseData?.errors &&
                typeof responseData.errors === 'object'
                    ? Object.values(responseData.errors).flat().join(' ')
                    : 'Failed to delete employee.');
            toast.error('Error', { description: String(message) });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCloseDeleteConfirm = (open: boolean) => {
        if (!open) {
            setDeleteConfirmOpen(false);
            if (!isDeleting) setEmployeeToDelete(null);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Employees" />
            <div className="flex h-full flex-1 flex-col gap-2 overflow-x-auto rounded-xl p-3">
                <Card className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800">
                <div>
                    <Dialog
                        open={editModalOpen}
                        onOpenChange={(open) => {
                            setEditModalOpen(open);
                            if (!open) setEditingEmployee(null);
                        }}
                    >
                        <DialogContent
                            className="!max-w-4xl max-h-[90vh] overflow-y-auto [&>button]:text-white [&>button]:hover:text-white"
                            aria-describedby={undefined}
                        >
                            <DialogHeader className="-m-6 mb-0 rounded-t-lg bg-primary px-6 py-4 text-primary-foreground">
                                <DialogTitle className="text-primary-foreground">Edit Employee</DialogTitle>
                            </DialogHeader>
                            <EditEmployeeForm
                                employee={editingEmployee ?? undefined}
                                positions={positions}
                                branches={branches}
                                onCancel={() => {
                                    setEditModalOpen(false);
                                    setEditingEmployee(null);
                                }}
                                onSubmit={async (data) => {
                                    try {
                                        await updateEmployee(data);
                                        toast.success('Employee updated', {
                                            description: 'Employee details have been saved.',
                                        });
                                        setEditModalOpen(false);
                                        setEditingEmployee(null);
                                        router.reload();
                                    } catch (err: unknown) {
                                        const axiosErr = err as {
                                            response?: {
                                                data?: {
                                                    message?: string;
                                                    errors?: Record<string, string[]>;
                                                };
                                            };
                                        };
                                        const responseData = axiosErr?.response?.data;
                                        let message = 'Failed to update employee.';
                                        if (responseData?.message) {
                                            message = String(responseData.message);
                                        } else if (
                                            responseData?.errors &&
                                            typeof responseData.errors === 'object'
                                        ) {
                                            message = Object.values(
                                                responseData.errors
                                            )
                                                .flat()
                                                .join(' ');
                                        }
                                        toast.error('Error', { description: message });
                                    }
                                }}
                            />
                        </DialogContent>
                    </Dialog>

                    <Dialog
                        open={viewModalOpen}
                        onOpenChange={(open) => {
                            setViewModalOpen(open);
                            if (!open) setViewingEmployee(null);
                        }}
                    >
                        <DialogContent
                            className="!max-w-2xl max-h-[90vh] overflow-y-auto [&>button]:text-white [&>button]:hover:text-white"
                            aria-describedby={undefined}
                        >
                            <DialogHeader className="-m-6 mb-0 rounded-t-lg bg-primary px-6 py-4 text-primary-foreground">
                                <DialogTitle className="text-primary-foreground">View Employee</DialogTitle>
                            </DialogHeader>
                            <ViewEmployeeModal employee={viewingEmployee} />
                        </DialogContent>
                    </Dialog>

                    <Dialog
                        open={deleteConfirmOpen}
                        onOpenChange={handleCloseDeleteConfirm}
                    >
                        <DialogContent
                            className="sm:max-w-md"
                            aria-describedby="delete-confirm-description"
                        >
                            <DialogHeader>
                                <DialogTitle>
                                    {employeeToDelete?.force
                                        ? 'Permanently delete employee?'
                                        : 'Delete employee?'}
                                </DialogTitle>
                                <DialogDescription id="delete-confirm-description">
                                    {employeeToDelete ? (
                                        employeeToDelete.force ? (
                                            <>
                                                Are you sure you want to permanently delete{' '}
                                                <span className="font-medium text-foreground">
                                                    {employeeToDelete.employee.name}
                                                </span>
                                                ? This action cannot be undone.
                                            </>
                                        ) : (
                                            <>
                                                Are you sure you want to remove{' '}
                                                <span className="font-medium text-foreground">
                                                    {employeeToDelete.employee.name}
                                                </span>
                                                ? You can restore them later from the
                                                Deleted tab.
                                            </>
                                        )
                                    ) : null}
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="gap-2 sm:gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={isDeleting}
                                    onClick={() => handleCloseDeleteConfirm(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    disabled={isDeleting}
                                    onClick={handleConfirmDelete}
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                    <CardContent className="p-0">
                        <div className="space-y-4 px-4 py-3 -mt-11 dark:border-neutral-800">
                            {/* Row 1: Icon, title, description (left) */}
                            <div className="flex items-start gap-3">
                                <div className="rounded-lg border-2 border-primary bg-primary/5 p-2 text-primary dark:bg-primary/20">
                                    <Users className="size-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold tracking-tight text-primary">
                                        Employees
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Manage employees and their details in your organization.
                                    </p>
                                </div>
                            </div>
                            {/* Row 2: Search | Status | Add; full width each below xl, single row on xl+ */}
                            <div className="flex flex-wrap items-center gap-3 xl:flex-nowrap">
                                <div className="relative min-w-full w-full xl:min-w-0 xl:w-72 xl:flex-shrink-0">
                                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 shrink-0 text-neutral-500" />
                                    <Input
                                        placeholder="Search employees..."
                                        value={search}
                                        onChange={handleSearchChange}
                                        className="h-10 w-full rounded-md border bg-white pl-9 focus-visible:border-muted-foreground focus-visible:ring-2 focus-visible:ring-ring ring-offset-2 dark:bg-white dark:border-[#2e8b57] dark:focus-visible:border-[#2e8b57] dark:focus-visible:ring-[#2e8b57]/20"
                                    />
                                </div>
                                <div className="flex min-w-full w-full justify-center xl:min-w-0 xl:w-auto xl:flex-1 xl:flex-shrink-0">
                                    <div className="flex w-full flex-wrap justify-center gap-1 rounded-md border border-neutral-200 bg-neutral-100/50 p-0.5 xl:w-auto xl:min-w-0 dark:border-neutral-800 dark:bg-neutral-900/50">
                                        {statusTabs.map((tab) => (
                                            <button
                                                key={tab.value}
                                                type="button"
                                                onClick={() => handleStatusChange(tab.value)}
                                                className={cn(
                                                    'shrink-0 rounded-md px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap hover:bg-primary dark:hover:bg-neutral-900/50',
                                                    statusFilter === tab.value
                                                        ? 'bg-primary text-white shadow-sm dark:bg-neutral-800 dark:text-neutral-100'
                                                        : 'text-neutral-500 hover:bg-primary hover:text-white dark:text-neutral-400 dark:hover:text-neutral-300'
                                                )}
                                            >
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex min-w-full w-full xl:min-w-0 xl:w-auto xl:flex-shrink-0">
                                    <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
                                        <DialogTrigger asChild>
                                            <Button
                                                className="w-full cursor-pointer bg-[#1f5c35] text-white hover:bg-[#1f5c35]/90 xl:w-auto"
                                                size="lg"
                                            >
                                                <Plus className="size-5" />
                                                Add Employee
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent
                                            className="!max-w-4xl max-h-[90vh] overflow-y-auto [&>button]:text-white [&>button]:hover:text-white"
                                            aria-describedby={undefined}
                                        >
                                            <DialogHeader className="-m-6 mb-0 rounded-t-lg bg-primary px-6 py-4 text-primary-foreground">
                                                <DialogTitle className="text-primary-foreground">Add New Employee</DialogTitle>
                                            </DialogHeader>
                                            <AddEmployeeForm
                                                positions={positions}
                                                branches={branches}
                                                onCancel={() => setAddModalOpen(false)}
                                                onSubmit={async (data: StoreEmployeeData) => {
                                                    try {
                                                        await storeEmployee(data);
                                                        toast.success('Employee added', {
                                                            description: 'New employee has been created successfully.',
                                                        });
                                                        setAddModalOpen(false);
                                                        router.reload();
                                                    } catch (err: unknown) {
                                                        const axiosErr = err as {
                                                            response?: {
                                                                data?: { message?: string; errors?: Record<string, string[]> };
                                                                status?: number;
                                                            };
                                                        };
                                                        const data = axiosErr?.response?.data;
                                                        let message = 'Failed to add employee.';
                                                        if (data?.message) {
                                                            message = String(data.message);
                                                        } else if (
                                                            data?.errors &&
                                                            typeof data.errors === 'object'
                                                        ) {
                                                            message = Object.values(data.errors)
                                                                .flat()
                                                                .join(' ');
                                                        }
                                                        toast.error('Error', { description: message });
                                                    }
                                                }}
                                            />
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </div>

                        <div className="mx-3 mb-3 overflow-x-auto rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950/50">
                            <div className="min-w-0 p-3 pt-0">
                                <DataTable
                                    columns={employeeColumns}
                                    data={filteredEmployees}
                                    loading={loading}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
