<?php

namespace App\Http\Controllers\Booking;

use App\Http\Controllers\Controller;

use App\Models\Booking\BookingOrder;
use App\Models\Booking\BookingReservation;
use App\Models\Booking\BookingVenue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BookingOrderController extends Controller
{
    /**
     * Display a listing of orders with search and status filtering.
     */
    public function index(Request $request)
    {
        $orders = BookingOrder::with('reservations.venue.category')
            ->when($request->search, function ($query, $search) {
                $query->where('order_code', 'LIKE', "%{$search}%")
                    ->orWhere('guest_name', 'LIKE', "%{$search}%")
                    ->orWhere('guest_email', 'LIKE', "%{$search}%");
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->latest()
            ->paginate($request->get('per_page', 15));

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => $orders,
            ]);
        }

        return view('orders.index', compact('orders'));
    }

    /**
     * Show the form for creating a new order.
     */
    public function create()
    {
        return view('orders.create');
    }

    /**
     * Store a newly created order and its child reservations in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'guest_name'                    => 'required|string|max:255',
            'guest_email'                   => 'required|email|max:255',
            'guest_phone'                   => 'nullable|string|max:20',
            'cart'                          => 'required|array|min:1',
            'cart.*.venue_id'               => 'required|exists:venues,id',
            'cart.*.reservation_date'       => 'required|date|after_or_equal:today',
            'cart.*.slot_time'              => 'required|string',
            'cart.*.booking_fee_percentage' => 'nullable|numeric|min:0|max:100',
            'cart.*.discount_percentage'    => 'nullable|numeric|min:0|max:100',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            // 1. Create base order
            $order = BookingOrder::create([
                'user_id'               => auth()->id(),
                'order_code'            => 'ORD-' . strtoupper(Str::random(6)),
                'guest_name'            => $validated['guest_name'],
                'guest_email'           => $validated['guest_email'],
                'guest_phone'           => $validated['guest_phone'] ?? null,
                'subtotal_amount'       => 0,
                'total_fee_amount'      => 0,
                'total_discount_amount' => 0,
                'grand_total'           => 0,
                'status'                => 'paid',
            ]);

            // 2. Add each reservation item in cart
            foreach ($validated['cart'] as $item) {
                $venue = BookingVenue::findOrFail($item['venue_id']);

                BookingReservation::create([
                    'order_id'               => $order->id,
                    'venue_id'               => $venue->id,
                    'reservation_date'       => $item['reservation_date'],
                    'slot_time'              => $item['slot_time'],
                    'base_price'             => $venue->base_price,
                    'booking_fee_percentage' => $item['booking_fee_percentage'] ?? 10.00,
                    'discount_percentage'    => $item['discount_percentage'] ?? 0.00,
                    'pass_code'              => 'PASS-' . strtoupper(Str::random(6)),
                    'status'                 => 'confirmed',
                ]);
            }

            // 3. Recalculate order totals from created reservations
            $order->recalculateTotals();

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Order created successfully.',
                    'data'    => $order->load('reservations.venue.category'),
                ], 201);
            }

            return redirect()->route('orders.show', $order)
                ->with('success', 'Order created successfully.');
        });
    }

    /**
     * Display the specified order with its reservation passes.
     */
    public function show(Request $request, BookingOrder $order)
    {
        $order->load('reservations.venue.category', 'user');

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data'    => $order,
            ]);
        }

        return view('orders.show', compact('order'));
    }

    /**
     * Show the form for editing the specified order.
     */
    public function edit(BookingOrder $order)
    {
        return view('orders.edit', compact('order'));
    }

    /**
     * Update order status or guest contact details in storage.
     */
    public function update(Request $request, BookingOrder $order)
    {
        $validated = $request->validate([
            'guest_name'  => 'required|string|max:255',
            'guest_email' => 'required|email|max:255',
            'guest_phone' => 'nullable|string|max:20',
            'status'      => 'required|in:pending,paid,cancelled',
        ]);

        $order->update($validated);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Order updated successfully.',
                'data'    => $order,
            ]);
        }

        return redirect()->route('orders.show', $order)
            ->with('success', 'Order updated successfully.');
    }

    /**
     * Remove the specified order from storage.
     */
    public function destroy(Request $request, BookingOrder $order)
    {
        // Deleting the order automatically cascades to delete child reservations
        $order->delete();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Order deleted successfully.',
            ]);
        }

        return redirect()->route('orders.index')
            ->with('success', 'Order deleted successfully.');
    }
}
