<?php

namespace App\Models\Booking;

use App\Models\Booking;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BookingOrder extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'order_code',
        'guest_name',
        'guest_email',
        'guest_phone',
        'subtotal_amount',
        'total_fee_amount',
        'total_discount_amount',
        'grand_total',
        'status',
    ];

    /**
     * Cast attributes to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'subtotal_amount'       => 'decimal:2',
        'total_fee_amount'      => 'decimal:2',
        'total_discount_amount' => 'decimal:2',
        'grand_total'           => 'decimal:2',
    ];

    /* ============================================================
       RELATIONSHIPS
    ============================================================ */

    /**
     * Get the user who placed this order (nullable for guests).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get all individual reservations associated with this checkout batch.
     */

    public function reservations(): HasMany
    {
        // Explicitly define 'booking_order_id' as the foreign key
        return $this->hasMany(BookingReservation::class, 'booking_order_id');
    }
    public function order(): BelongsTo
    {
        // Explicitly define 'booking_order_id' as the foreign key
        return $this->belongsTo(BookingOrder::class, 'booking_order_id');
    }
    /* ============================================================
       HELPER METHODS
    ============================================================ */

    /**
     * Recalculate and update the order totals from its reservations.
     */
    public function recalculateTotals(): void
    {
        $this->subtotal_amount       = $this->reservations()->sum('base_price');
        $this->total_fee_amount      = $this->reservations()->sum('booking_fee_amount');
        $this->total_discount_amount = $this->reservations()->sum('discount_amount');
        $this->grand_total           = $this->reservations()->sum('final_price');

        $this->save();
    }
}
