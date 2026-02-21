<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class MyPayslipsController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('my-payslips/index');
    }
}
