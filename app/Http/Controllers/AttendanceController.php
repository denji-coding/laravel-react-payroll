<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    public function __invoke(Request $request): Response
    {
        return Inertia::render('attendance/index', [
            'attendances' => [],
            'summary' => [
                'present' => 0,
                'late' => 0,
                'absent' => 0,
                'onLeave' => 0,
            ],
            'date' => $request->query('date', now()->format('Y-m-d')),
        ]);
    }
}
