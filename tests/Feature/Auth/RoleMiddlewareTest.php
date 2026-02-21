<?php

use App\Models\User;

test('user with admin role can access role-protected route', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->get(route('admin-only'));

    $response->assertOk();
});

test('user without admin role receives 403', function () {
    $user = User::factory()->create(['role' => 'user']);

    $response = $this->actingAs($user)->get(route('admin-only'));

    $response->assertForbidden();
});

test('guest is redirected to login', function () {
    $response = $this->get(route('admin-only'));

    $response->assertRedirect(route('login'));
});
