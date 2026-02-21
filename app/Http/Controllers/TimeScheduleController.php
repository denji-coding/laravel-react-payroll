<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTimeScheduleRequest;
use App\Http\Requests\UpdateTimeScheduleRequest;
use App\Models\Employee;
use App\Models\TimeSchedule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TimeScheduleController extends Controller
{
    public function index(Request $request): Response
    {
        $employees = Employee::query()
            ->where('status', 'active')
            ->orderBy('first_name')
            ->get(['id', 'employee_id', 'first_name', 'last_name'])
            ->map(fn (Employee $e) => [
                'id' => $e->id,
                'employee_id' => $e->employee_id,
                'name' => trim($e->first_name.' '.$e->last_name),
            ]);

        return Inertia::render('time-schedule/index', [
            'employees' => $employees,
            'schedules' => Inertia::defer(fn () => TimeSchedule::query()
                ->with('employee:id,employee_id,first_name,last_name')
                ->orderBy('id')
                ->get()
                ->map(function (TimeSchedule $ts) {
                    $data = $ts->schedule_data ?? [];
                    $dutyDays = collect($data)->filter(fn ($d) => ($d['duty'] ?? false))->pluck('day')->values()->all();
                    $firstDuty = collect($data)->firstWhere('duty', true);
                    $morning = $firstDuty ? $firstDuty['am_in'].' - '.$firstDuty['am_out'] : '08:00 - 12:00';
                    $afternoon = $firstDuty ? $firstDuty['pm_in'].' - '.$firstDuty['pm_out'] : '13:00 - 17:00';

                    return [
                        'id' => $ts->id,
                        'employee_id' => $ts->employee->employee_id,
                        'name' => trim($ts->employee->first_name.' '.$ts->employee->last_name),
                        'duty_days' => $dutyDays,
                        'morning' => $morning,
                        'afternoon' => $afternoon,
                    ];
                })
                ->all()),
        ]);
    }

    public function store(StoreTimeScheduleRequest $request): JsonResponse
    {
        $timeSchedule = TimeSchedule::query()->create([
            'employee_id' => $request->validated('employee_id'),
            'schedule_data' => $request->validated('days'),
        ]);
        $timeSchedule->load('employee');

        return response()->json([
            'message' => 'Schedule created successfully.',
            'schedule' => $this->formatSchedule($timeSchedule),
        ], 201);
    }

    public function update(UpdateTimeScheduleRequest $request, TimeSchedule $time_schedule): JsonResponse
    {
        $time_schedule->update([
            'employee_id' => $request->validated('employee_id'),
            'schedule_data' => $request->validated('days'),
        ]);

        $ts = $time_schedule->fresh();
        $ts->load('employee');

        return response()->json([
            'message' => 'Schedule updated successfully.',
            'schedule' => $this->formatSchedule($ts),
        ]);
    }

    public function destroy(TimeSchedule $time_schedule): JsonResponse
    {
        $time_schedule->delete();

        return response()->json([
            'message' => 'Schedule has been removed.',
        ]);
    }

    /** @param array<string, mixed> $data */
    private function formatSchedule(TimeSchedule $ts): array
    {
        $data = $ts->schedule_data ?? [];
        $dutyDays = collect($data)->filter(fn ($d) => ($d['duty'] ?? false))->pluck('day')->values()->all();
        $firstDuty = collect($data)->firstWhere('duty', true);
        $morning = $firstDuty ? $firstDuty['am_in'].' - '.$firstDuty['am_out'] : '08:00 - 12:00';
        $afternoon = $firstDuty ? $firstDuty['pm_in'].' - '.$firstDuty['pm_out'] : '13:00 - 17:00';

        return [
            'id' => $ts->id,
            'employee_id' => $ts->employee->employee_id,
            'name' => trim($ts->employee->first_name.' '.$ts->employee->last_name),
            'duty_days' => $dutyDays,
            'morning' => $morning,
            'afternoon' => $afternoon,
        ];
    }
}
