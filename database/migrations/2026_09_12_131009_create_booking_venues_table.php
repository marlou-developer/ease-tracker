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
        Schema::create('booking_venues', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->string('name'); // e.g., 'Riverside Tennis Club'
            $table->string('area'); // e.g., 'Riverside Park'
            $table->string('address');
            $table->decimal('base_price', 8, 2); // Base rate per unit/slot
            $table->decimal('commission_percentage', 5, 2)->default(10.00); // Venue platform commission rate (e.g. 10.00%)
            $table->string('unit_label')->default('hour'); // e.g., 'court', 'suite', 'desk'
            $table->decimal('rating', 3, 2)->default(5.00);
            $table->string('distance')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_venues');
    }
};
