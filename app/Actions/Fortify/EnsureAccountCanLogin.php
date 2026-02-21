<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Validation\ValidationException;
use Laravel\Fortify\Fortify;

class EnsureAccountCanLogin
{
    public function __invoke($request, $next)
    {
        $user = User::query()->where(Fortify::username(), $request->{Fortify::username()})->first();

        if (! $user) {
            return $next($request);
        }

        if (! $user->isActive()) {
            throw ValidationException::withMessages([
                Fortify::username() => [__('auth.account_disabled')],
            ]);
        }

        if ($user->isLocked()) {
            throw ValidationException::withMessages([
                Fortify::username() => [__('auth.account_locked', [
                    'minutes' => (int) ceil($user->locked_until->diffInSeconds(now()) / 60),
                ])],
            ]);
        }

        return $next($request);
    }
}
