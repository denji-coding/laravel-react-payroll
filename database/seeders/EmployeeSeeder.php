<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Employee;
use App\Models\Position;
use Illuminate\Database\Seeder;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $positionNames = ['Driver', 'Manager', 'Supervisor', 'Branch Manager', 'Administrator'];
        $positions = collect($positionNames)->map(
            fn (string $name) => Position::factory()->create(['name' => $name])
        );

        $branchNames = ['Expressway Liaison Service', 'Migrants Venture Corporation'];
        $branches = collect($branchNames)->map(
            fn (string $name) => Branch::factory()->create(['name' => $name])
        );

        Employee::factory(7)
            ->sequence(fn () => [
                'position_id' => $positions->random()->id,
                'branch_id' => $branches->random()->id,
            ])
            ->create();

        Employee::factory(2)
            ->inactive()
            ->sequence(fn () => [
                'position_id' => $positions->random()->id,
                'branch_id' => $branches->random()->id,
            ])
            ->create();

        Employee::factory(2)
            ->deleted()
            ->sequence(fn () => [
                'position_id' => $positions->random()->id,
                'branch_id' => $branches->random()->id,
            ])
            ->create();
    }
}
