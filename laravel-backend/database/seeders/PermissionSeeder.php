<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            ['name' => 'Manage Users', 'slug' => 'manage-users'],
            ['name' => 'Manage Sellers', 'slug' => 'manage-sellers'],
            ['name' => 'Manage Products', 'slug' => 'manage-products'],
            ['name' => 'Manage Orders', 'slug' => 'manage-orders'],
            ['name' => 'Manage Categories', 'slug' => 'manage-categories'],
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['slug' => $permission['slug']], $permission);
        }

        // Admin gets every permission by default; sellers/buyers get scoped
        // permissions added in later phases as their resources exist.
        $admin = Role::where('slug', 'admin')->first();
        $admin?->permissions()->sync(Permission::pluck('id'));
    }
}
