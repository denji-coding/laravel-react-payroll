import { api } from '@/lib/axios';

export type StoreBranchPayload = {
    name: string;
    manager_id?: number | null;
    contact?: string | null;
    status?: 'active' | 'inactive';
};

export type UpdateBranchPayload = {
    id: number;
    name: string;
    manager_id?: number | null;
    contact?: string | null;
    status?: 'active' | 'inactive';
};

export async function storeBranch(
    payload: StoreBranchPayload
): Promise<{
    message: string;
    branch: {
        id: number;
        name: string;
        manager: string;
        employees_count: number;
        contact: string;
        status: string;
    };
}> {
    const { data } = await api.post('/branches', payload);
    return data;
}

export async function updateBranch(
    payload: UpdateBranchPayload
): Promise<{
    message: string;
    branch: {
        id: number;
        name: string;
        manager: string;
        employees_count: number;
        contact: string;
        status: string;
    };
}> {
    const { id, ...rest } = payload;
    const { data } = await api.put(`/branches/${id}`, rest);
    return data;
}

export async function deleteBranch(id: number): Promise<{ message: string }> {
    const { data } = await api.delete(`/branches/${id}`);
    return data;
}
