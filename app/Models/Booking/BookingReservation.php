<?php

namespace App\Models\Booking;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookingReservation extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'order_id',
        'venue_id',
        'reservation_date',
        'slot_time',
        'base_price',
        'booking_fee_percentage',
        'booking_fee_amount',
        'discount_percentage',
        'discount_amount',
        'final_price',
        'pass_code',
        'status',
    ];

    /**
     * Cast attributes to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'reservation_date'       => 'date',
        'base_price'             => 'decimal:2',
        'booking_fee_percentage' => 'decimal:2',
        'booking_fee_amount'     => 'decimal:2',
        'discount_percentage'    => 'decimal:2',
        'discount_amount'        => 'decimal:2',
        'final_price'            => 'decimal:2',
    ];

    /**
     * The "booted" method of the model.
     * Automatically calculates fee, discount, and final price before saving.
     */
    protected static function booted(): void
    {
        static::saving(function (BookingReservation $reservation) {
            $base = $reservation->base_price ?? 0;

            // Ensure percentage defaults if not explicitly set
            $feePercent      = $reservation->booking_fee_percentage ?? 10.00;
            $discountPercent = $reservation->discount_percentage ?? 0.00;

            // Calculate amounts
            $reservation->booking_fee_amount = round($base * ($feePercent / 100), 2);
            $reservation->discount_amount    = round($base * ($discountPercent / 100), 2);

            // Calculate final price: (Base + Service Fee) - Discount
            $reservation->final_price = round(($base + $reservation->booking_fee_amount) - $reservation->discount_amount, 2);
        });
    }

    /* ============================================================
       RELATIONSHIPS
    ============================================================ */

    /**
     * Get the order/cart batch that owns this reservation.
     */
    public function order(): BelongsTo
    {
        // Explicitly declare 'order_id' to prevent Eloquent from guessing 'booking_order_id'
        return $this->belongsTo(BookingOrder::class, 'order_id');
    }

    /**
     * Get the venue/space for this reservation.
     */
    public function venue(): BelongsTo
    {
        // Explicitly declare 'venue_id' as well
        return $this->belongsTo(BookingVenue::class, 'venue_id');
    }
}