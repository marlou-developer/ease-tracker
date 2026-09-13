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
        Schema::create('booking_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('key')->unique(); // e.g., 'sports', 'hotel', 'workspace'
            $table->string('name'); // e.g., 'Sports Courts', 'Hotels & Suites'
            $table->string('icon')->nullable();
            $table->string('badge_text')->nullable();
            $table->boolean('is_badge')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_categories');
    }
};
