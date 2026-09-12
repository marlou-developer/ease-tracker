<?php

namespace Database\Seeders;

use App\Models\Booking\BookingOrder;
use App\Models\Booking\BookingReservation;
use App\Models\Booking\BookingVenue;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class OrderAndReservationSeeder extends Seeder
{
    public function run(): void
    {
        $subscriber = User::where('role', 'subscriber')->first();
        $booker = User::where('role', 'booker')->first();

        $venues = BookingVenue::all();

        if ($venues->isEmpty()) {
            return;
        }

        // --- Order 1: Subscriber (with 15% discount) ---
        $order1 = BookingOrder::create([
            'user_id' => $subscriber?->id,
            'order_code' => 'ORD-SUB001',
            'guest_name' => $subscriber?->name ?? 'Jordan Cruz',
            'guest_email' => $subscriber?->email ?? 'jordan@example.com',
            'guest_phone' => '+63 900 111 2222',
            'subtotal_amount' => 0,
            'total_fee_amount' => 0,
            'total_discount_amount' => 0,
            'grand_total' => 0,
            'status' => 'paid',
        ]);

        $this->createReservation([
            'order_id' => $order1->id,
            'venue_id' => $venues->where('name', 'Riverside Tennis Club')->first()->id ?? $venues->first()->id,
            'reservation_date' => now()->addDays(2)->format('Y-m-d'),
            'slot_time' => '10:00',
            'base_price' => 25.00,
            'booking_fee_percentage' => 10.00,
            'discount_percentage' => 15.00,
            'pass_code' => 'PASS-' . strtoupper(Str::random(6)),
            'status' => 'confirmed',
        ]);

        $this->createReservation([
            'order_id' => $order1->id,
            'venue_id' => $venues->where('name', 'Nexus Co-Working Hub')->first()->id ?? $venues->first()->id,
            'reservation_date' => now()->addDays(3)->format('Y-m-d'),
            'slot_time' => '14:00',
            'base_price' => 15.00,
            'booking_fee_percentage' => 10.00,
            'discount_percentage' => 15.00,
            'pass_code' => 'PASS-' . strtoupper(Str::random(6)),
            'status' => 'confirmed',
        ]);

        $order1->recalculateTotals();

        // --- Order 2: Booker (Standard Rate) ---
        $order2 = BookingOrder::create([
            'user_id' => $booker?->id,
            'order_code' => 'ORD-BKR002',
            'guest_name' => $booker?->name ?? 'Alex Morgan',
            'guest_email' => $booker?->email ?? 'alex@example.com',
            'guest_phone' => '+63 900 333 4444',
            'subtotal_amount' => 0,
            'total_fee_amount' => 0,
            'total_discount_amount' => 0,
            'grand_total' => 0,
            'status' => 'paid',
        ]);

        $this->createReservation([
            'order_id' => $order2->id,
            'venue_id' => $venues->where('name', 'Grand Vista Resort & Spa')->first()->id ?? $venues->first()->id,
            'reservation_date' => now()->addDays(5)->format('Y-m-d'),
            'slot_time' => '12:00',
            'base_price' => 180.00,
            'booking_fee_percentage' => 10.00,
            'discount_percentage' => 0.00,
            'pass_code' => 'PASS-' . strtoupper(Str::random(6)),
            'status' => 'confirmed',
        ]);

        $order2->recalculateTotals();
    }

    /**
     * Helper to compute mathematical amounts explicitly before insertion.
     */
    private function createReservation(array $attributes): BookingReservation
    {
        $base = $attributes['base_price'];
        $feePercent = $attributes['booking_fee_percentage'] ?? 10.00;
        $discountPercent = $attributes['discount_percentage'] ?? 0.00;

        $feeAmount = round($base * ($feePercent / 100), 2);
        $discountAmount = round($base * ($discountPercent / 100), 2);
        $finalPrice = round(($base + $feeAmount) - $discountAmount, 2);

        return BookingReservation::create(array_merge($attributes, [
            'booking_fee_amount' => $feeAmount,
            'discount_amount'    => $discountAmount,
            'final_price'        => $finalPrice,
        ]));
    }
}
