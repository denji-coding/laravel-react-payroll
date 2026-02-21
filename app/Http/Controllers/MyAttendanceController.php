<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class MyAttendanceController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('my-attendance/index');
    }
}
