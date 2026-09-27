<?php

namespace Database\Seeders;

use App\Models\ShippingMethod;
use Illuminate\Database\Seeder;

class ShippingMethodSeeder extends Seeder
{
    public function run(): void
    {
        $methods = [
            ['name' => 'Standard Delivery', 'cost' => 100, 'estimated_days' => '3-5 days'],
            ['name' => 'Express Delivery', 'cost' => 250, 'estimated_days' => '1-2 days'],
        ];

        foreach ($methods as $method) {
            ShippingMethod::firstOrCreate(['name' => $method['name']], $method);
        }
    }
}
