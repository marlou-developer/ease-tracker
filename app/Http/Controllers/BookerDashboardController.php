<?php

namespace App\Http\Controllers\Booker;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Reservation;
use Illuminate\Http\Request;

class BookerDashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $activeReservations = Reservation::whereHas('order', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->where('status', 'confirmed')
            ->whereDate('reservation_date', '>=', now())
            ->with('venue.category')
            ->orderBy('reservation_date', 'asc')
            ->get();

        $orderHistory = Order::where('user_id', $user->id)
            ->with('reservations.venue')
            ->latest()
            ->paginate(10);

        if ($request->wantsJson()) {
            return response()->json([
                'success'             => true,
                'active_reservations' => $activeReservations,
                'order_history'       => $orderHistory,
            ]);
        }

        return view('booker.dashboard', compact('activeReservations', 'orderHistory'));
    }
}