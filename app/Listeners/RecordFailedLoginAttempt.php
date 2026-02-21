<?php

namespace App\Listeners;

use App\Models\User;
use Illuminate\Auth\Events\Failed;
use Laravel\Fortify\Fortify;

class RecordFailedLoginAttempt
{
    public function handle(Failed $event): void
    {
        $credentials = $event->credentials ?? [];
        $email = $credentials[Fortify::username()] ?? null;

        if (! $email) {
            return;
        }

        $user = User::query()->where(Fortify::username(), $email)->first();

        if ($user) {
            $user->recordFailedLogin();
        }
    }
}
