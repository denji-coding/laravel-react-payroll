<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class AttendanceTerminalController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('attendance-terminal/index', [
            'records' => [],
        ]);
    }
}
