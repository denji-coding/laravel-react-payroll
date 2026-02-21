<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class PayrollController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('payroll/index', [
            'periods' => [],
            'earnings' => [],
            'deductions' => [],
        ]);
    }
}
