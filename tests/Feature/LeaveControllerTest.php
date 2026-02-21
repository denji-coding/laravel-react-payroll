<?php

use App\Models\User;

test('leaves index page requires authentication', function () {
    $response = $this->get(route('leaves'));

    $response->assertRedirect(route('login'));
});

test('leaves index page is displayed for authenticated users', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('leaves'));

    $response
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('leaves/index'));
});
