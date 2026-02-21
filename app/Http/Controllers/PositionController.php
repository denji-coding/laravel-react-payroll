<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePositionRequest;
use App\Http\Requests\UpdatePositionRequest;
use App\Models\Position;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class PositionController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('positions/index', [
            'positions' => Inertia::defer(fn () => Position::query()
                ->orderBy('name')
                ->get(['id', 'name', 'description', 'status'])
                ->map(fn (Position $position) => [
                    'id' => $position->id,
                    'name' => $position->name,
                    'description' => $position->description ?? '',
                    'status' => $position->status ?? 'active',
                ])),
        ]);
    }

    public function store(StorePositionRequest $request): JsonResponse
    {
        $position = Position::query()->create([
            'name' => $request->validated('name'),
            'description' => $request->validated('description'),
            'status' => $request->validated('status', 'active'),
        ]);

        return response()->json([
            'message' => 'Position created successfully.',
            'position' => [
                'id' => $position->id,
                'name' => $position->name,
                'description' => $position->description,
                'status' => $position->status,
            ],
        ], 201);
    }

    public function update(UpdatePositionRequest $request, Position $position): JsonResponse
    {
        $position->update([
            'name' => $request->validated('name'),
            'description' => $request->validated('description'),
            'status' => $request->validated('status', 'active'),
        ]);

        return response()->json([
            'message' => 'Position updated successfully.',
            'position' => [
                'id' => $position->id,
                'name' => $position->name,
                'description' => $position->description,
                'status' => $position->status,
            ],
        ]);
    }

    public function destroy(Position $position): JsonResponse
    {
        $position->delete();

        return response()->json([
            'message' => 'Position has been removed.',
        ]);
    }
}
