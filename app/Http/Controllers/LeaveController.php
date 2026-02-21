<?php

namespace App\Http\Controllers;

use App\Models\Leave;
use Inertia\Inertia;
use Inertia\Response;

class LeaveController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('leaves/index', [
            'leaves' => Inertia::defer(fn () => Leave::query()
                ->with('employee:id,first_name,last_name,middle_name')
                ->latest()
                ->get()
                ->map(fn (Leave $leave) => [
                    'id' => $leave->id,
                    'employee_id' => $leave->employee_id,
                    'employee_name' => $leave->employee
                        ? trim(
                            "{$leave->employee->first_name} {$leave->employee->last_name} {$leave->employee->middle_name}"
                        )
                        : '',
                    'leave_type' => $leave->leave_type,
                    'start_date' => $leave->start_date->toDateString(),
                    'end_date' => $leave->end_date->toDateString(),
                    'status' => $leave->status,
                    'reason' => $leave->reason,
                ])),
        ]);
    }
}
