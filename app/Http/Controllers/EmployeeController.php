<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Models\Branch;
use App\Models\Employee;
use App\Models\Position;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    private function mapEmployeeToArray(Employee $employee): array
    {
        return [
            'id' => $employee->id,
            'employee_id' => $employee->employee_id,
            'first_name' => $employee->first_name,
            'last_name' => $employee->last_name,
            'middle_name' => $employee->middle_name,
            'email' => $employee->email,
            'phone' => $employee->phone,
            'date_of_birth' => $employee->date_of_birth?->format('Y-m-d'),
            'gender' => $employee->gender,
            'civil_status' => $employee->civil_status,
            'address' => $employee->address,
            'position_id' => $employee->position_id,
            'position' => $employee->position?->name ?? '-',
            'branch_id' => $employee->branch_id,
            'branch' => $employee->branch?->name ?? '-',
            'date_hired' => $employee->date_hired?->format('Y-m-d'),
            'basic_salary' => $employee->basic_salary !== null ? (string) $employee->basic_salary : null,
            'rfid' => $employee->rfid,
            'status' => $employee->status,
            'photo' => $employee->photo ? Storage::url($employee->photo) : null,
            'sss' => $employee->sss,
            'philhealth' => $employee->philhealth,
            'pagibig' => $employee->pagibig,
            'tin' => $employee->tin,
            'bank_name' => $employee->bank_name,
            'bank_account' => $employee->bank_account,
            'emergency_contact_name' => $employee->emergency_contact_name,
            'emergency_contact_phone' => $employee->emergency_contact_phone,
            'name' => trim("{$employee->first_name} {$employee->last_name}"),
        ];
    }

    public function index(): Response
    {
        $positions = Position::query()->orderBy('name')->get(['id', 'name']);
        $branches = Branch::query()->orderBy('name')->get(['id', 'name']);

        $positions = Position::query()->orderBy('name')->get(['id', 'name']);
        $branches = Branch::query()->orderBy('name')->get(['id', 'name']);

        return Inertia::render('employees/index', [
            'employees' => Inertia::defer(fn () => Employee::query()
                ->with(['position', 'branch'])
                ->latest()
                ->get()
                ->map(fn (Employee $employee) => $this->mapEmployeeToArray($employee))),
            'positions' => $positions,
            'branches' => $branches,
        ]);
    }

    public function store(StoreEmployeeRequest $request): JsonResponse
    {
        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('employees', 'public');
        }

        $employee = Employee::query()->create([
            'employee_id' => $request->validated('employee_id'),
            'first_name' => $request->validated('first_name'),
            'last_name' => $request->validated('last_name'),
            'middle_name' => $request->validated('middle_name'),
            'email' => $request->validated('email'),
            'phone' => $request->validated('phone'),
            'date_of_birth' => $request->validated('date_of_birth'),
            'gender' => $request->validated('gender'),
            'civil_status' => $request->validated('civil_status'),
            'address' => $request->validated('address'),
            'position_id' => $request->validated('position_id'),
            'branch_id' => $request->validated('branch_id'),
            'date_hired' => $request->validated('date_hired'),
            'basic_salary' => $request->validated('basic_salary'),
            'rfid' => $request->validated('rfid'),
            'status' => $request->validated('status', 'active'),
            'photo' => $photoPath,
            'sss' => $request->validated('sss'),
            'philhealth' => $request->validated('philhealth'),
            'pagibig' => $request->validated('pagibig'),
            'tin' => $request->validated('tin'),
            'bank_name' => $request->validated('bank_name'),
            'bank_account' => $request->validated('bank_account'),
            'emergency_contact_name' => $request->validated('emergency_contact_name'),
            'emergency_contact_phone' => $request->validated('emergency_contact_phone'),
        ]);

        return response()->json([
            'message' => 'Employee created successfully.',
            'employee' => $this->mapEmployeeToArray($employee),
        ], 201);
    }

    public function update(UpdateEmployeeRequest $request, Employee $employee): JsonResponse
    {
        $photoPath = $employee->photo;
        if ($request->hasFile('photo')) {
            if ($employee->photo && Storage::disk('public')->exists($employee->photo)) {
                Storage::disk('public')->delete($employee->photo);
            }
            $photoPath = $request->file('photo')->store('employees', 'public');
        }

        $employee->update([
            'employee_id' => $request->validated('employee_id'),
            'first_name' => $request->validated('first_name'),
            'last_name' => $request->validated('last_name'),
            'middle_name' => $request->validated('middle_name'),
            'email' => $request->validated('email'),
            'phone' => $request->validated('phone'),
            'date_of_birth' => $request->validated('date_of_birth'),
            'gender' => $request->validated('gender'),
            'civil_status' => $request->validated('civil_status'),
            'address' => $request->validated('address'),
            'position_id' => $request->validated('position_id'),
            'branch_id' => $request->validated('branch_id'),
            'date_hired' => $request->validated('date_hired'),
            'basic_salary' => $request->validated('basic_salary'),
            'rfid' => $request->validated('rfid'),
            'status' => $request->validated('status', 'active'),
            'photo' => $photoPath,
            'sss' => $request->validated('sss'),
            'philhealth' => $request->validated('philhealth'),
            'pagibig' => $request->validated('pagibig'),
            'tin' => $request->validated('tin'),
            'bank_name' => $request->validated('bank_name'),
            'bank_account' => $request->validated('bank_account'),
            'emergency_contact_name' => $request->validated('emergency_contact_name'),
            'emergency_contact_phone' => $request->validated('emergency_contact_phone'),
        ]);

        $employee->load(['position', 'branch']);

        return response()->json([
            'message' => 'Employee updated successfully.',
            'employee' => $this->mapEmployeeToArray($employee),
        ]);
    }

    public function destroy(Employee $employee): JsonResponse
    {
        $employee->update(['status' => 'deleted']);

        return response()->json([
            'message' => 'Employee has been removed.',
        ]);
    }

    public function forceDestroy(Employee $employee): JsonResponse
    {
        if ($employee->photo && Storage::disk('public')->exists($employee->photo)) {
            Storage::disk('public')->delete($employee->photo);
        }
        $employee->delete();

        return response()->json([
            'message' => 'Employee has been permanently removed.',
        ]);
    }
}
