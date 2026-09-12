<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Reservation;
use App\Models\Venue;
use App\Models\User;
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    public function index(Request $request)
    {
        $stats = [
            'total_revenue'      => Order::where('status', 'paid')->sum('grand_total'),
            'total_platform_fees'=> Reservation::where('status', 'confirmed')->sum('booking_fee_amount'),
            'total_bookings'     => Reservation::count(),
            'total_venues'       => Venue::count(),
            'total_subscribers'  => User::whereIn('role', ['subscriber', 'booker'])->count(),
        ];

        $recentOrders = Order::with('reservations.venue')->latest()->take(10)->get();

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'stats' => $stats, 'recent_orders' => $recentOrders]);
        }

        return view('admin.dashboard', compact('stats', 'recentOrders'));
    }
}