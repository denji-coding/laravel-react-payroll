<?php

namespace App\Listeners;

use App\Models\User;
use Illuminate\Auth\Events\Login;

class ClearLoginLockoutOnSuccess
{
    public function handle(Login $event): void
    {
        $user = $event->user;

        if ($user instanceof User) {
            $user->clearLockout();
        }
    }
}
