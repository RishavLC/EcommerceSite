<?php

namespace App\Services\Auth;

use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function register(array $data): User
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'password' => $data['password'], // hashed automatically via the 'hashed' cast
        ]);

        // Every new account starts as a buyer. Seller access is layered on
        // top after an approved seller application (Phase 7) - it never
        // replaces the buyer role.
        $buyerRole = Role::where('slug', 'buyer')->first();
        if ($buyerRole) {
            $user->roles()->attach($buyerRole);
        }

        return $user;
    }

    public function login(array $credentials): User
    {
        if (! Auth::attempt(['email' => $credentials['email'], 'password' => $credentials['password']])) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        request()->session()->regenerate();

        $user = Auth::user();

        if ($user->status !== 'active') {
            $this->logout();
            throw ValidationException::withMessages([
                'email' => ['Your account is '.$user->status.'. Please contact support.'],
            ]);
        }

        return $user;
    }

    public function logout(): void
    {
        Auth::guard('web')->logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();
    }
}
