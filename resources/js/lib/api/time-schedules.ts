import { api } from '@/lib/axios';

export type DaySchedule = {
    day: string;
    duty: boolean;
    am_in: string;
    am_out: string;
    pm_in: string;
    pm_out: string;
};

export type StoreTimeSchedulePayload = {
    employee_id: number;
    days: DaySchedule[];
};

export type UpdateTimeSchedulePayload = {
    id: number;
    employee_id: number;
    days: DaySchedule[];
};

export async function storeTimeSchedule(
    payload: StoreTimeSchedulePayload
): Promise<{ message: string; schedule: unknown }> {
    const { data } = await api.post('/time-schedules', payload);
    return data;
}

export async function updateTimeSchedule(
    payload: UpdateTimeSchedulePayload
): Promise<{ message: string; schedule: unknown }> {
    const { id, ...rest } = payload;
    const { data } = await api.put(`/time-schedules/${id}`, rest);
    return data;
}

export async function deleteTimeSchedule(
    id: number
): Promise<{ message: string }> {
    const { data } = await api.delete(`/time-schedules/${id}`);
    return data;
}
