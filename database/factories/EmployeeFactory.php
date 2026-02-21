<?php

namespace Database\Factories;

use App\Models\Branch;
use App\Models\Position;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Employee>
 */
class EmployeeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        static $counter = 1;

        return [
            'employee_id' => sprintf('EMP-%03d', $counter++),
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'position_id' => Position::factory(),
            'branch_id' => Branch::factory(),
            'status' => 'active',
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'inactive',
        ]);
    }

    public function deleted(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'deleted',
        ]);
    }
}
