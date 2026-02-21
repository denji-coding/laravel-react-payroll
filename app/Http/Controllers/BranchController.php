<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBranchRequest;
use App\Http\Requests\UpdateBranchRequest;
use App\Models\Branch;
use App\Models\Employee;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BranchController extends Controller
{
    public function index(Request $request): Response
    {
        $employees = Employee::query()
            ->whereHas('position', fn ($q) => $q->where('name', 'Manager'))
            ->orderBy('first_name')
            ->get(['id', 'first_name', 'last_name'])
            ->map(fn (Employee $e) => [
                'id' => $e->id,
                'name' => trim($e->first_name.' '.$e->last_name),
            ]);

        return Inertia::render('branches/index', [
            'branches' => Inertia::defer(fn () => Branch::query()
                ->with('manager:id,first_name,last_name')
                ->withCount('employees')
                ->orderBy('name')
                ->get()
                ->map(fn (Branch $branch) => [
                    'id' => $branch->id,
                    'name' => $branch->name,
                    'manager_id' => $branch->manager_id,
                    'manager' => $branch->manager
                        ? $branch->manager->first_name.' '.$branch->manager->last_name
                        : 'Not assigned',
                    'employees_count' => $branch->employees_count,
                    'contact' => $branch->contact ?? '',
                    'status' => $branch->status ?? 'active',
                ])),
            'employees' => $employees,
        ]);
    }

    public function store(StoreBranchRequest $request): JsonResponse
    {
        $branch = Branch::query()->create([
            'name' => $request->validated('name'),
            'manager_id' => $request->validated('manager_id'),
            'contact' => $request->validated('contact'),
            'status' => $request->validated('status', 'active'),
        ]);

        return response()->json([
            'message' => 'Branch created successfully.',
            'branch' => [
                'id' => $branch->id,
                'name' => $branch->name,
                'manager' => 'Not assigned',
                'employees_count' => 0,
                'contact' => $branch->contact ?? '',
                'status' => $branch->status,
            ],
        ], 201);
    }

    public function update(UpdateBranchRequest $request, Branch $branch): JsonResponse
    {
        $branch->update([
            'name' => $request->validated('name'),
            'manager_id' => $request->validated('manager_id'),
            'contact' => $request->validated('contact'),
            'status' => $request->validated('status', 'active'),
        ]);

        $branch->load('manager:id,first_name,last_name');
        $branch->loadCount('employees');

        return response()->json([
            'message' => 'Branch updated successfully.',
            'branch' => [
                'id' => $branch->id,
                'name' => $branch->name,
                'manager' => $branch->manager
                    ? $branch->manager->first_name.' '.$branch->manager->last_name
                    : 'Not assigned',
                'employees_count' => $branch->employees_count,
                'contact' => $branch->contact ?? '',
                'status' => $branch->status,
            ],
        ]);
    }

    public function destroy(Branch $branch): JsonResponse
    {
        $branch->delete();

        return response()->json([
            'message' => 'Branch has been removed.',
        ]);
    }
}
