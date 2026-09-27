<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index()
    {
        return $this->success(Role::all());
    }

    public function assign(Request $request, User $user)
    {
        $request->validate(['role' => ['required', 'exists:roles,slug']]);

        $role = Role::where('slug', $request->role)->firstOrFail();
        $user->roles()->syncWithoutDetaching($role);

        return $this->success($user->load('roles'), 'Role assigned.');
    }

    public function revoke(Request $request, User $user)
    {
        $request->validate(['role' => ['required', 'exists:roles,slug']]);

        $role = Role::where('slug', $request->role)->firstOrFail();
        $user->roles()->detach($role);

        return $this->success($user->load('roles'), 'Role revoked.');
    }
}
