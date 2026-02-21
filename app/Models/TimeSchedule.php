<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TimeSchedule extends Model
{
    /** @use HasFactory<\Database\Factories\TimeScheduleFactory> */
    use HasFactory;

    /** @var array<int, string> */
    protected $fillable = [
        'employee_id',
        'schedule_data',
    ];

    protected function casts(): array
    {
        return [
            'schedule_data' => 'array',
        ];
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
