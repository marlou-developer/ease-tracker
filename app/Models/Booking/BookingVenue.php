<?php

namespace App\Models\Booking;

use App\Models\Booking;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasOne;

class BookingVenue extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'booking_category_id',
        'name',
        'area',
        'address',
        'base_price',
        'commission_percentage',
        'unit_label',
        'rating',
        'distance',
        'start_time',
        'end_time',
    ];

    /**
     * Cast attributes to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'base_price'            => 'decimal:2',
        'commission_percentage' => 'decimal:2',
        'rating'                => 'decimal:2',
        'start_time'            => 'datetime:H:i',
        'end_time'              => 'datetime:H:i',
    ];

    /* ============================================================
       RELATIONSHIPS
    ============================================================ */

    /**
     * Get the category that this venue belongs to.
     */
    public function category(): HasOne
    {
        return $this->hasOne(BookingCategory::class, 'id', 'booking_category_id');
    }

    /**
     * Get all reservations booked for this venue.
     */
    public function reservations(): HasMany
    {
        return $this->hasMany(BookingReservation::class);
    }

    /* ============================================================
       SCOPES & HELPERS
    ============================================================ */

    /**
     * Scope query to filter venues by category key or ID.
     */
    public function scopeByCategory(Builder $query, string|int $category): Builder
    {
        if (is_numeric($category)) {
            return $query->where('booking_category_id', $category);
        }

        return $query->whereHas('category', function (Builder $q) use ($category) {
            $q->where('key', $category);
        });
    }

    /**
     * Scope query to search venues by name, area, or address.
     */
    public function scopeSearch(Builder $query, string $term): Builder
    {
        return $query->where(function (Builder $q) use ($term) {
            $q->where('name', 'LIKE', "%{$term}%")
                ->orWhere('area', 'LIKE', "%{$term}%")
                ->orWhere('address', 'LIKE', "%{$term}%");
        });
    }
}
