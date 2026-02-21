<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Branch;
use App\Models\Employee;
use App\Models\Leave;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $totalEmployees = Employee::count();
        $activeBranches = Branch::count();
        $presentToday = Attendance::count();
        $totalForPresent = max($totalEmployees, 1);
        $presentPercentage = (int) round(($presentToday / $totalForPresent) * 100);
        $pendingLeaves = Leave::count();
        $payrollThisMonth = 0;
        $avgAttendance = $totalEmployees > 0
            ? (int) round(Attendance::count() / $totalEmployees * 100)
            : 0;

        return Inertia::render('dashboard/index', [
            'stats' => [
                'totalEmployees' => $totalEmployees,
                'activeBranches' => $activeBranches,
                'presentToday' => $presentToday,
                'presentPercentage' => $presentPercentage,
                'pendingLeaves' => $pendingLeaves,
                'payrollThisMonth' => $payrollThisMonth,
                'avgAttendance' => $avgAttendance,
            ],
        ]);
    }
}
