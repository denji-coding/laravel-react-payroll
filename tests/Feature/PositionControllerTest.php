<?php

use App\Models\Position;
use App\Models\User;

test('positions index page requires authentication', function () {
    $response = $this->get(route('positions'));

    $response->assertRedirect(route('login'));
});

test('positions index page is displayed for authenticated users', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('positions'));

    $response->assertOk();
});

test('position can be stored', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('positions.store'), [
        'name' => 'Bus Driver',
        'description' => 'Drives buses.',
        'status' => 'active',
    ]);

    $response
        ->assertStatus(201)
        ->assertJson([
            'message' => 'Position created successfully.',
            'position' => [
                'name' => 'Bus Driver',
                'description' => 'Drives buses.',
                'status' => 'active',
            ],
        ]);

    $this->assertDatabaseHas('positions', [
        'name' => 'Bus Driver',
        'description' => 'Drives buses.',
        'status' => 'active',
    ]);
});

test('position can be updated', function () {
    $user = User::factory()->create();
    $position = Position::factory()->create([
        'name' => 'Driver',
        'description' => 'Original description',
        'status' => 'active',
    ]);

    $response = $this->actingAs($user)->put(route('positions.update', $position), [
        'name' => 'Senior Driver',
        'description' => 'Updated description',
        'status' => 'inactive',
    ]);

    $response
        ->assertOk()
        ->assertJson([
            'message' => 'Position updated successfully.',
            'position' => [
                'id' => $position->id,
                'name' => 'Senior Driver',
                'description' => 'Updated description',
                'status' => 'inactive',
            ],
        ]);

    $position->refresh();
    expect($position->name)->toBe('Senior Driver');
    expect($position->description)->toBe('Updated description');
    expect($position->status)->toBe('inactive');
});

test('position update requires authentication', function () {
    $position = Position::factory()->create();

    $response = $this->put(route('positions.update', $position), [
        'name' => 'Updated Name',
        'description' => '',
        'status' => 'active',
    ]);

    $response->assertRedirect(route('login'));
});
