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
                'user_id' => 2,
                'key' => 'sports',
                'name' => 'Sports Courts',
                'icon' => 'sports',
                'badge_text' => null,
                'is_badge' => false,
            ],
            [
                'user_id' => 2,
                'key' => 'hotel',
                'name' => 'Hotels & Suites',
                'icon' => 'hotel',
                'badge_text' => null,
                'is_badge' => false,
            ],
            [
                'user_id' => 2,
                'key' => 'workspace',
                'name' => 'Co-Working Hubs',
                'icon' => 'workspace',
                'badge_text' => null,
                'is_badge' => false,
            ],
            [
                'user_id' => 4,
                'key' => 'studio',
                'name' => 'Studios & Halls',
                'icon' => 'studio',
                'badge_text' => null,
                'is_badge' => false,
            ],
            [
                'user_id' => 4,
                'key' => 'fitness',
                'name' => 'Gym & Fitness',
                'icon' => 'fitness',
                'badge_text' => 'New',
                'is_badge' => true,
            ],
            [
                'user_id' => 4,
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
