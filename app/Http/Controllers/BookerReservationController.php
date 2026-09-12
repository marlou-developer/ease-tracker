<?php

namespace App\Http\Controllers\Booker;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;

class BookerReservationController extends Controller
{
    public function show(Request $request, $id)
    {
        $reservation = Reservation::whereHas('order', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })
            ->with(['venue.category', 'order'])
            ->findOrFail($id);

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'data' => $reservation]);
        }

        return view('booker.reservations.show', compact('reservation'));
    }

    public function cancel(Request $request, $id)
    {
        $reservation = Reservation::whereHas('order', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })
            ->findOrFail($id);

        if ($reservation->reservation_date->isPast()) {
            return response()->json(['success' => false, 'message' => 'Cannot cancel past reservations.'], 422);
        }

        $reservation->update(['status' => 'cancelled']);
        $reservation->order->recalculateTotals();

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'message' => 'Reservation cancelled successfully.']);
        }

        return redirect()->back()->with('success', 'Reservation cancelled.');
    }
}
