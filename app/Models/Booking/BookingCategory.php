<?php

namespace App\Models\Booking;

use App\Models\Booking;
use App\Models\Venue;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class BookingCategory extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'key',
        'name',
        'icon',
        'badge_text',
        'is_badge',
    ];

    /**
     * Cast attributes to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_badge' => 'boolean',
    ];

    /* ============================================================
       RELATIONSHIPS
    ============================================================ */

    /**
     * Get all venues under this category.
     */
    public function venues(): HasMany
    {
        return $this->hasMany(BookingVenue::class)->with(['reservations','category']);
    }

    /**
     * Get all reservations across all venues in this category.
     */
    public function reservations(): HasManyThrough
    {
        return $this->hasManyThrough(BookingReservation::class, BookingVenue::class);
    }
}
