<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            ['name' => 'Nike Air Sneakers', 'category' => 'Footwear', 'price' => 120, 'old_price' => 150, 'stock' => 25, 'image' => '👟', 'badge' => 'Top', 'rating' => 5, 'reviews_count' => 120],
            ['name' => 'Smart Watch Pro', 'category' => 'Electronics', 'price' => 80, 'old_price' => 100, 'stock' => 40, 'image' => '⌚', 'badge' => 'New', 'rating' => 4, 'reviews_count' => 95],
            ['name' => 'Wireless Headphones', 'category' => 'Audio', 'price' => 60, 'old_price' => 90, 'stock' => 60, 'image' => '🎧', 'badge' => null, 'rating' => 4, 'reviews_count' => 88],
            ['name' => 'Running Shoes', 'category' => 'Footwear', 'price' => 95, 'old_price' => null, 'stock' => 30, 'image' => '👟', 'badge' => null, 'rating' => 4, 'reviews_count' => 52],
            ['name' => 'Bluetooth Speaker', 'category' => 'Audio', 'price' => 45, 'old_price' => 60, 'stock' => 50, 'image' => '🔊', 'badge' => 'Sale', 'rating' => 4, 'reviews_count' => 67],
            ['name' => 'Leather Backpack', 'category' => 'Fashion', 'price' => 75, 'old_price' => null, 'stock' => 20, 'image' => '🎒', 'badge' => null, 'rating' => 5, 'reviews_count' => 41],
            ['name' => 'Sunglasses Classic', 'category' => 'Fashion', 'price' => 35, 'old_price' => 50, 'stock' => 70, 'image' => '🕶️', 'badge' => 'New', 'rating' => 4, 'reviews_count' => 33],
            ['name' => 'Yoga Mat', 'category' => 'Sports', 'price' => 25, 'old_price' => null, 'stock' => 80, 'image' => '🧘', 'badge' => null, 'rating' => 4, 'reviews_count' => 29],
            ['name' => 'Skincare Set', 'category' => 'Beauty', 'price' => 55, 'old_price' => 70, 'stock' => 45, 'image' => '🧴', 'badge' => 'Top', 'rating' => 5, 'reviews_count' => 74],
            ['name' => 'Novel Bestseller Bundle', 'category' => 'Books', 'price' => 30, 'old_price' => null, 'stock' => 100, 'image' => '📚', 'badge' => null, 'rating' => 4, 'reviews_count' => 18],
            ['name' => 'Basketball', 'category' => 'Sports', 'price' => 28, 'old_price' => 35, 'stock' => 55, 'image' => '🏀', 'badge' => null, 'rating' => 4, 'reviews_count' => 22],
            ['name' => 'Gaming Mouse', 'category' => 'Electronics', 'price' => 40, 'old_price' => null, 'stock' => 65, 'image' => '🖱️', 'badge' => 'New', 'rating' => 4, 'reviews_count' => 58],
        ];

        foreach ($products as $p) {
            $category = Category::where('name', $p['category'])->first();

            Product::updateOrCreate(
                ['slug' => Str::slug($p['name'])],
                [
                    'category_id' => $category?->id,
                    'name' => $p['name'],
                    'description' => "Premium quality {$p['name']} designed for comfort, durability and modern style.",
                    'price' => $p['price'],
                    'old_price' => $p['old_price'],
                    'stock' => $p['stock'],
                    'image' => $p['image'],
                    'badge' => $p['badge'],
                    'rating' => $p['rating'],
                    'reviews_count' => $p['reviews_count'],
                    'is_active' => true,
                ]
            );
        }
    }
}
