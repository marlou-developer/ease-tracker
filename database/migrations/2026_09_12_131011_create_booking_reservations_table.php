<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('booking_reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('venue_id')->constrained()->onDelete('cascade');
            $table->date('reservation_date'); // e.g., '2026-09-15'
            $table->string('slot_time'); // e.g., '14:00'

            // Financial calculations per booking
            $table->decimal('base_price', 8, 2); // Standard base price

            // Percentage fields
            $table->decimal('booking_fee_percentage', 5, 2)->default(10.00); // e.g., 10.00% service fee per booking
            $table->decimal('booking_fee_amount', 8, 2); // Calculated fee amount

            $table->decimal('discount_percentage', 5, 2)->default(0.00); // e.g., 15.00% promo discount per booking
            $table->decimal('discount_amount', 8, 2); // Calculated discount amount

            $table->decimal('final_price', 8, 2); // (base_price + fee_amount) - discount_amount

            $table->string('pass_code')->unique(); // e.g., 'PASS-8F291'
            $table->enum('status', ['confirmed', 'completed', 'cancelled'])->default('confirmed');

            $table->timestamps();

            // Prevent double-booking the same venue at the exact same date & time slot
            $table->unique(['venue_id', 'reservation_date', 'slot_time']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_reservations');
    }
};
