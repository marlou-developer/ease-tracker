<?php

namespace Database\Seeders;

use App\Models\Booking\BookingCategory;
use App\Models\Booking\BookingVenue;
use Illuminate\Database\Seeder;

class VenueSeeder extends Seeder
{
    public function run(): void
    {
        $categories = BookingCategory::pluck('id', 'key');

        $venues = [
            // Sports
            [
                'category_id' => $categories['sports'],
                'name' => 'Riverside Tennis Club',
                'area' => 'Riverside Park',
                'address' => '12 Riverside Ave',
                'base_price' => 25.00,
                'commission_percentage' => 10.00,
                'unit_label' => 'court',
                'rating' => 4.80,
                'distance' => '1.2 km',
            ],
            [
                'category_id' => $categories['sports'],
                'name' => 'Greenfield Turf Field',
                'area' => 'Greenfield',
                'address' => '5 Greenfield Way',
                'base_price' => 60.00,
                'commission_percentage' => 10.00,
                'unit_label' => 'pitch',
                'rating' => 4.70,
                'distance' => '2.1 km',
            ],

            // Hotel
            [
                'category_id' => $categories['hotel'],
                'name' => 'Grand Vista Resort & Spa',
                'area' => 'Downtown',
                'address' => '450 Ocean Parkway',
                'base_price' => 180.00,
                'commission_percentage' => 12.00,
                'unit_label' => 'suite',
                'rating' => 4.90,
                'distance' => '0.5 km',
            ],
            [
                'category_id' => $categories['hotel'],
                'name' => 'Urban Boutique Hotel',
                'area' => 'Central District',
                'address' => '128 Main St',
                'base_price' => 120.00,
                'commission_percentage' => 10.00,
                'unit_label' => 'room',
                'rating' => 4.50,
                'distance' => '1.8 km',
            ],

            // Workspace
            [
                'category_id' => $categories['workspace'],
                'name' => 'Nexus Co-Working Hub',
                'area' => 'Tech District',
                'address' => '101 Innovation Way',
                'base_price' => 15.00,
                'commission_percentage' => 8.00,
                'unit_label' => 'desk',
                'rating' => 4.70,
                'distance' => '2.1 km',
            ],

            // Studio
            [
                'category_id' => $categories['studio'],
                'name' => 'Lumina Photography Studio',
                'area' => 'Arts Quarter',
                'address' => '88 Canvas St',
                'base_price' => 65.00,
                'commission_percentage' => 10.00,
                'unit_label' => 'hall',
                'rating' => 4.60,
                'distance' => '3.4 km',
            ],

            // Fitness
            [
                'category_id' => $categories['fitness'],
                'name' => 'Pulse CrossFit & Gym',
                'area' => 'Metro Center',
                'address' => '14 Power St',
                'base_price' => 20.00,
                'commission_percentage' => 10.00,
                'unit_label' => 'day pass',
                'rating' => 4.90,
                'distance' => '0.9 km',
            ],

            // Wellness
            [
                'category_id' => $categories['wellness'],
                'name' => 'Serenity Sauna & Spa',
                'area' => 'Lakeside',
                'address' => '90 Calm Water Rd',
                'base_price' => 50.00,
                'commission_percentage' => 10.00,
                'unit_label' => 'session',
                'rating' => 4.80,
                'distance' => '3.1 km',
            ],
        ];

        foreach ($venues as $venue) {
            BookingVenue::updateOrCreate(['name' => $venue['name']], $venue);
        }
    }
}