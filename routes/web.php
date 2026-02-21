<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AttendanceTerminalController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\DtrController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\LeaveController;
use App\Http\Controllers\MyAttendanceController;
use App\Http\Controllers\MyPayslipsController;
use App\Http\Controllers\PayrollController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\TimeScheduleController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::middleware('role:admin')->get('admin-only', fn () => Inertia::render('welcome'))->name('admin-only');

    Route::get('employees', [EmployeeController::class, 'index'])->name('employees');
    Route::post('employees', [EmployeeController::class, 'store'])->name('employees.store');
    Route::put('employees/{employee}', [EmployeeController::class, 'update'])->name('employees.update');
    Route::delete('employees/{employee}', [EmployeeController::class, 'destroy'])->name('employees.destroy');
    Route::delete('employees/{employee}/force', [EmployeeController::class, 'forceDestroy'])->name('employees.force-destroy');
    Route::get('positions', [PositionController::class, 'index'])->name('positions');
    Route::post('positions', [PositionController::class, 'store'])->name('positions.store');
    Route::put('positions/{position}', [PositionController::class, 'update'])->name('positions.update');
    Route::delete('positions/{position}', [PositionController::class, 'destroy'])->name('positions.destroy');
    Route::get('branches', [BranchController::class, 'index'])->name('branches');
    Route::post('branches', [BranchController::class, 'store'])->name('branches.store');
    Route::put('branches/{branch}', [BranchController::class, 'update'])->name('branches.update');
    Route::delete('branches/{branch}', [BranchController::class, 'destroy'])->name('branches.destroy');
    Route::get('time-schedule', [TimeScheduleController::class, 'index'])->name('time-schedule');
    Route::post('time-schedules', [TimeScheduleController::class, 'store'])->name('time-schedules.store');
    Route::put('time-schedules/{time_schedule}', [TimeScheduleController::class, 'update'])->name('time-schedules.update');
    Route::delete('time-schedules/{time_schedule}', [TimeScheduleController::class, 'destroy'])->name('time-schedules.destroy');
    Route::get('attendance-terminal', AttendanceTerminalController::class)->name('attendance-terminal');
    Route::get('attendance', AttendanceController::class)->name('attendance');
    Route::get('leaves', LeaveController::class)->name('leaves');
    Route::get('payroll', PayrollController::class)->name('payroll');
    Route::get('reports', ReportController::class)->name('reports');

    Route::get('dtr', DtrController::class)->name('dtr');
    Route::get('my-attendance', MyAttendanceController::class)->name('my-attendance');
    Route::get('my-payslips', MyPayslipsController::class)->name('my-payslips');
});

require __DIR__.'/settings.php';
