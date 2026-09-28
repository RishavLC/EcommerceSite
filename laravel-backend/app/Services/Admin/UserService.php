<?php

namespace App\Services\Admin;

use App\Models\Role;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class UserService
{
    public function list(array $filters): LengthAwarePaginator
    {
        return User::with('roles')
            ->when($filters['search'] ?? null, function ($q, $search) {
                $q->where(fn ($q) => $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%"));
            })
            ->when($filters['role'] ?? null, fn ($q, $role) => $q->whereHas('roles', fn ($q) => $q->where('slug', $role)))
            ->when($filters['status'] ?? null, fn ($q, $status) => $q->where('status', $status))
            ->latest()
            ->paginate((int) ($filters['per_page'] ?? 15));
    }

    public function create(array $data): User
    {
        $roles = $data['roles'] ?? ['buyer'];
        unset($data['roles']);

        $user = User::create($data);
        $this->syncRoles($user, $roles);

        return $user->load('roles');
    }

    public function update(User $user, array $data): User
    {
        $roles = $data['roles'] ?? null;
        unset($data['roles']);

        // Blank password on edit means "leave unchanged".
        if (array_key_exists('password', $data) && empty($data['password'])) {
            unset($data['password']);
        }

        $user->update($data);

        if ($roles !== null) {
            $this->syncRoles($user, $roles);
        }

        return $user->load('roles');
    }

    public function setStatus(User $user, string $status): User
    {
        $user->update(['status' => $status]);

        // Kick a deactivated user out of any API-token sessions immediately.
        if ($status !== 'active') {
            $user->tokens()->delete();
        }

        return $user->load('roles');
    }

    protected function syncRoles(User $user, array $slugs): void
    {
        $user->roles()->sync(Role::whereIn('slug', $slugs)->pluck('id'));
    }
}
