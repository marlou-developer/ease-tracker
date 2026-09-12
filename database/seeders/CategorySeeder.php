<?php

namespace Database\Seeders;

use App\Models\Booking\BookingCategory;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'key' => 'sports',
                'name' => 'Sports Courts',
                'icon' => 'sports',
                'badge_text' => null,
                'is_badge' => false,
            ],
            [
                'key' => 'hotel',
                'name' => 'Hotels & Suites',
                'icon' => 'hotel',
                'badge_text' => null,
                'is_badge' => false,
            ],
            [
                'key' => 'workspace',
                'name' => 'Co-Working Hubs',
                'icon' => 'workspace',
                'badge_text' => null,
                'is_badge' => false,
            ],
            [
                'key' => 'studio',
                'name' => 'Studios & Halls',
                'icon' => 'studio',
                'badge_text' => null,
                'is_badge' => false,
            ],
            [
                'key' => 'fitness',
                'name' => 'Gym & Fitness',
                'icon' => 'fitness',
                'badge_text' => 'New',
                'is_badge' => true,
            ],
            [
                'key' => 'wellness',
                'name' => 'Spa & Wellness',
                'icon' => 'wellness',
                'badge_text' => null,
                'is_badge' => false,
            ],
        ];

        foreach ($categories as $cat) {
            BookingCategory::updateOrCreate(['key' => $cat['key']], $cat);
        }
    }
}