import { api } from '@/lib/axios';

export type StoreEmployeePayload = {
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
    basic_salary?: string | number | null;
    rfid?: string | null;
    status?: 'active' | 'inactive' | 'deleted';
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

export type UpdateEmployeePayload = StoreEmployeePayload & { id: number };

function appendPayloadToFormData(
    formData: FormData,
    payload: StoreEmployeePayload,
    options?: { includePhoto: boolean }
): void {
    formData.append('employee_id', payload.employee_id);
    formData.append('first_name', payload.first_name);
    formData.append('last_name', payload.last_name);
    formData.append('status', payload.status ?? 'active');
    if (payload.middle_name != null && payload.middle_name !== '')
        formData.append('middle_name', payload.middle_name);
    if (payload.email != null && payload.email !== '')
        formData.append('email', payload.email);
    if (payload.phone != null && payload.phone !== '')
        formData.append('phone', payload.phone);
    if (payload.date_of_birth)
        formData.append('date_of_birth', payload.date_of_birth);
    if (payload.gender) formData.append('gender', payload.gender);
    if (payload.civil_status)
        formData.append('civil_status', payload.civil_status);
    if (payload.address != null && payload.address !== '')
        formData.append('address', payload.address);
    if (payload.position_id != null)
        formData.append('position_id', String(payload.position_id));
    if (payload.branch_id != null)
        formData.append('branch_id', String(payload.branch_id));
    if (payload.date_hired) formData.append('date_hired', payload.date_hired);
    if (payload.basic_salary != null && payload.basic_salary !== '')
        formData.append('basic_salary', String(payload.basic_salary));
    if (payload.rfid != null && payload.rfid !== '')
        formData.append('rfid', payload.rfid);
    if (payload.sss != null && payload.sss !== '')
        formData.append('sss', payload.sss);
    if (payload.philhealth != null && payload.philhealth !== '')
        formData.append('philhealth', payload.philhealth);
    if (payload.pagibig != null && payload.pagibig !== '')
        formData.append('pagibig', payload.pagibig);
    if (payload.tin != null && payload.tin !== '')
        formData.append('tin', payload.tin);
    if (payload.bank_name != null && payload.bank_name !== '')
        formData.append('bank_name', payload.bank_name);
    if (payload.bank_account != null && payload.bank_account !== '')
        formData.append('bank_account', payload.bank_account);
    if (payload.emergency_contact_name != null && payload.emergency_contact_name !== '')
        formData.append('emergency_contact_name', payload.emergency_contact_name);
    if (payload.emergency_contact_phone != null && payload.emergency_contact_phone !== '')
        formData.append('emergency_contact_phone', payload.emergency_contact_phone);
    if (options?.includePhoto && payload.photo instanceof File) {
        formData.append('photo', payload.photo);
    }
}

export async function storeEmployee(
    payload: StoreEmployeePayload
): Promise<{ message: string; employee: unknown }> {
    const hasPhoto = payload.photo instanceof File;
    if (hasPhoto) {
        const formData = new FormData();
        appendPayloadToFormData(formData, payload, { includePhoto: true });
        const { data } = await api.post('/employees', formData);
        return data;
    }
    const body: Record<string, unknown> = {
        employee_id: payload.employee_id,
        first_name: payload.first_name,
        last_name: payload.last_name,
        status: payload.status ?? 'active',
        middle_name: payload.middle_name ?? null,
        email: payload.email ?? null,
        phone: payload.phone ?? null,
        date_of_birth: payload.date_of_birth ?? null,
        gender: payload.gender ?? null,
        civil_status: payload.civil_status ?? null,
        address: payload.address ?? null,
        position_id: payload.position_id ?? null,
        branch_id: payload.branch_id ?? null,
        date_hired: payload.date_hired ?? null,
        basic_salary: payload.basic_salary ?? null,
        rfid: payload.rfid ?? null,
        sss: payload.sss ?? null,
        philhealth: payload.philhealth ?? null,
        pagibig: payload.pagibig ?? null,
        tin: payload.tin ?? null,
        bank_name: payload.bank_name ?? null,
        bank_account: payload.bank_account ?? null,
        emergency_contact_name: payload.emergency_contact_name ?? null,
        emergency_contact_phone: payload.emergency_contact_phone ?? null,
    };
    const { data } = await api.post('/employees', body);
    return data;
}

export async function updateEmployee(
    payload: UpdateEmployeePayload
): Promise<{ message: string; employee: unknown }> {
    const { id, ...rest } = payload;
    const hasPhoto = rest.photo instanceof File;
    if (hasPhoto) {
        const formData = new FormData();
        appendPayloadToFormData(formData, rest, { includePhoto: true });
        const { data } = await api.put(`/employees/${id}`, formData);
        return data;
    }
    const body: Record<string, unknown> = {
        employee_id: rest.employee_id,
        first_name: rest.first_name,
        last_name: rest.last_name,
        status: rest.status ?? 'active',
        middle_name: rest.middle_name ?? null,
        email: rest.email ?? null,
        phone: rest.phone ?? null,
        date_of_birth: rest.date_of_birth ?? null,
        gender: rest.gender ?? null,
        civil_status: rest.civil_status ?? null,
        address: rest.address ?? null,
        position_id: rest.position_id ?? null,
        branch_id: rest.branch_id ?? null,
        date_hired: rest.date_hired ?? null,
        basic_salary: rest.basic_salary ?? null,
        rfid: rest.rfid ?? null,
        sss: rest.sss ?? null,
        philhealth: rest.philhealth ?? null,
        pagibig: rest.pagibig ?? null,
        tin: rest.tin ?? null,
        bank_name: rest.bank_name ?? null,
        bank_account: rest.bank_account ?? null,
        emergency_contact_name: rest.emergency_contact_name ?? null,
        emergency_contact_phone: rest.emergency_contact_phone ?? null,
    };
    const { data } = await api.put(`/employees/${id}`, body);
    return data;
}

export async function deleteEmployee(id: number): Promise<{ message: string }> {
    const { data } = await api.delete(`/employees/${id}`);
    return data;
}

export async function forceDeleteEmployee(id: number): Promise<{ message: string }> {
    const { data } = await api.delete(`/employees/${id}/force`);
    return data;
}
