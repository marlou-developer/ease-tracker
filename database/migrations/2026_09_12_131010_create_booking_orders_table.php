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
        Schema::create('booking_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('order_code')->unique(); // e.g., 'ORD-X9A7B'
            $table->string('guest_name');
            $table->string('guest_email');
            $table->string('guest_phone')->nullable();
            $table->decimal('subtotal_amount', 10, 2); // Base price sum
            $table->decimal('total_fee_amount', 10, 2); // Sum of percentage booking fees
            $table->decimal('total_discount_amount', 10, 2); // Sum of percentage discounts
            $table->decimal('grand_total', 10, 2); // Final amount paid
            $table->enum('status', ['pending', 'paid', 'cancelled'])->default('paid');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_orders');
    }
};
