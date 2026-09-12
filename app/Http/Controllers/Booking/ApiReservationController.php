<?php

namespace App\Http\Controllers\Reservation;

use App\Http\Controllers\Controller;
use App\Models\Booking\BookingOrder;
use App\Models\Booking\BookingReservation;
use App\Models\Booking\BookingVenue;
use Illuminate\Http\Request;

class ApiReservationController extends Controller
{
    /**
     * Check booked time slots for a venue on a specific date.
     *
     * GET /api/v1/venues/{venue}/availability?date=2026-09-15
     */
    public function checkAvailability(Request $request, BookingVenue $venue)
    {
        $request->validate([
            'date' => 'required|date',
        ]);

        $bookedSlots = BookingReservation::where('venue_id', $venue->id)
            ->whereDate('reservation_date', $request->date)
            ->where('status', '!=', 'cancelled')
            ->pluck('slot_time');

        return response()->json([
            'success'      => true,
            'venue_id'     => $venue->id,
            'date'         => $request->date,
            'booked_slots' => $bookedSlots,
        ]);
    }

    /**
     * Look up order details and reservations using an order code.
     *
     * GET /api/v1/orders/{order_code}
     */
    public function trackOrder(string $order_code)
    {
        $order = BookingOrder::with('reservations.venue.category')
            ->where('order_code', $order_code)
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $order,
        ]);
    }
}
