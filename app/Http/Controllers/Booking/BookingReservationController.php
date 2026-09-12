<?php

namespace App\Http\Controllers;

use App\Models\Booking\BookingReservation;
use App\Models\Booking\BookingVenue;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

class BookingReservationController extends Controller
{
     public function index(Request $request)
    {
        $reservations = BookingReservation::with(['venue.category', 'order'])
            ->when($request->search, function ($query, $search) {
                $query->where('pass_code', 'LIKE', "%{$search}%")
                      ->orWhereHas('venue', function ($q) use ($search) {
                          $q->where('name', 'LIKE', "%{$search}%");
                      })
                      ->orWhereHas('order', function ($q) use ($search) {
                          $q->where('order_code', 'LIKE', "%{$search}%")
                            ->orWhere('guest_name', 'LIKE', "%{$search}%");
                      });
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->date, function ($query, $date) {
                $query->whereDate('reservation_date', $date);
            })
            ->latest()
            ->paginate($request->get('per_page', 15));

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => $reservations,
            ]);
        }

        return view('reservations.index', compact('reservations'));
    }

    /**
     * Show the form for creating a new reservation.
     */
    public function create()
    {
        $venues = BookingVenue::with('category')->get();
        return view('reservations.create', compact('venues'));
    }

    /**
     * Store a newly created reservation in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id'               => 'required|exists:orders,id',
            'venue_id'               => 'required|exists:venues,id',
            'reservation_date'       => [
                'required',
                'date',
                'after_or_equal:today',
                // Prevent double booking for the same venue, date, and slot
                Rule::unique('reservations')->where(function ($query) use ($request) {
                    return $query->where('venue_id', $request->venue_id)
                                 ->where('reservation_date', $request->reservation_date)
                                 ->where('slot_time', $request->slot_time)
                                 ->where('status', '!=', 'cancelled');
                }),
            ],
            'slot_time'              => 'required|string',
            'booking_fee_percentage' => 'nullable|numeric|min:0|max:100',
            'discount_percentage'    => 'nullable|numeric|min:0|max:100',
        ], [
            'reservation_date.unique' => 'This venue is already booked for the selected date and time slot.',
        ]);

        $venue = BookingVenue::findOrFail($validated['venue_id']);

        $reservation = BookingReservation::create([
            'order_id'               => $validated['order_id'],
            'venue_id'               => $venue->id,
            'reservation_date'       => $validated['reservation_date'],
            'slot_time'              => $validated['slot_time'],
            'base_price'             => $venue->base_price,
            'booking_fee_percentage' => $validated['booking_fee_percentage'] ?? 10.00,
            'discount_percentage'    => $validated['discount_percentage'] ?? 0.00,
            'pass_code'              => 'PASS-' . strtoupper(Str::random(6)),
            'status'                 => 'confirmed',
        ]);

        // Recalculate parent order totals after adding a new reservation
        $reservation->order->recalculateTotals();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Reservation created successfully.',
                'data'    => $reservation->load('venue.category', 'order'),
            ], 201);
        }

        return redirect()->route('reservations.show', $reservation)
            ->with('success', 'Reservation created successfully.');
    }

    /**
     * Display the specified reservation details.
     */
    public function show(Request $request, BookingReservation $reservation)
    {
        $reservation->load('venue.category', 'order');

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data'    => $reservation,
            ]);
        }

        return view('reservations.show', compact('reservation'));
    }

    /**
     * Show the form for editing the specified reservation.
     */
    public function edit(BookingReservation $reservation)
    {
        $venues = BookingVenue::all();
        return view('reservations.edit', compact('reservation', 'venues'));
    }

    /**
     * Update the specified reservation in storage.
     */
    public function update(Request $request, BookingReservation $reservation)
    {
        $validated = $request->validate([
            'venue_id'               => 'required|exists:venues,id',
            'reservation_date'       => [
                'required',
                'date',
                Rule::unique('reservations')->where(function ($query) use ($request) {
                    return $query->where('venue_id', $request->venue_id)
                                 ->where('reservation_date', $request->reservation_date)
                                 ->where('slot_time', $request->slot_time)
                                 ->where('status', '!=', 'cancelled');
                })->ignore($reservation->id),
            ],
            'slot_time'              => 'required|string',
            'booking_fee_percentage' => 'nullable|numeric|min:0|max:100',
            'discount_percentage'    => 'nullable|numeric|min:0|max:100',
            'status'                 => 'required|in:confirmed,completed,cancelled',
        ], [
            'reservation_date.unique' => 'This venue is already booked for the selected date and time slot.',
        ]);

        $venue = BookingVenue::findOrFail($validated['venue_id']);
        $validated['base_price'] = $venue->base_price;

        $reservation->update($validated);

        // Recalculate parent order totals after pricing/percentage changes
        $reservation->order->recalculateTotals();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Reservation updated successfully.',
                'data'    => $reservation->load('venue.category', 'order'),
            ]);
        }

        return redirect()->route('reservations.show', $reservation)
            ->with('success', 'Reservation updated successfully.');
    }

    /**
     * Remove the specified reservation from storage.
     */
    public function destroy(Request $request, BookingReservation $reservation)
    {
        $order = $reservation->order;

        $reservation->delete();

        // Recalculate parent order totals after deleting a reservation
        if ($order) {
            $order->recalculateTotals();
        }

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Reservation deleted successfully.',
            ]);
        }

        return redirect()->route('reservations.index')
            ->with('success', 'Reservation deleted successfully.');
    }
}
