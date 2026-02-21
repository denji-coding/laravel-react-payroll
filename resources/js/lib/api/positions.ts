import { api } from '@/lib/axios';

export type StorePositionPayload = {
    name: string;
    description?: string | null;
    status?: 'active' | 'inactive';
};

export type UpdatePositionPayload = {
    id: number;
    name: string;
    description?: string | null;
    status?: 'active' | 'inactive';
};

export async function storePosition(
    payload: StorePositionPayload
): Promise<{
    message: string;
    position: { id: number; name: string; description?: string | null; status: string };
}> {
    const { data } = await api.post('/positions', payload);
    return data;
}

export async function updatePosition(
    payload: UpdatePositionPayload
): Promise<{
    message: string;
    position: { id: number; name: string; description?: string | null; status: string };
}> {
    const { id, ...rest } = payload;
    const { data } = await api.put(`/positions/${id}`, rest);
    return data;
}

export async function deletePosition(id: number): Promise<{ message: string }> {
    const { data } = await api.delete(`/positions/${id}`);
    return data;
}
