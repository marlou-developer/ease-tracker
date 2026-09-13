<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Admin Portal User
        User::updateOrCreate(
            ['email' => 'admin@omnireserve.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        // 2. Subscriber User (VIP Member)
        User::updateOrCreate(
            ['email' => 'subscriber@omnireserve.com'],
            [
                'name' => 'Jordan Cruz',
                'password' => Hash::make('password'),
                'role' => 'Lessee',
                'email_verified_at' => now(),
            ]
        );

        // 3. Booker User (Standard Customer)
        User::updateOrCreate(
            ['email' => 'booker@omnireserve.com'],
            [
                'name' => 'Alex Morgan',
                'password' => Hash::make('password'),
                'role' => 'booker',
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'subscriber2@omnireserve.com'],
            [
                'name' => 'Jordan Cruz 2',
                'password' => Hash::make('password'),
                'role' => 'Lessee',
                'email_verified_at' => now(),
            ]
        );
    }
}
