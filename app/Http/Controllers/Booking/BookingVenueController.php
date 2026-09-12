<?php

namespace App\Http\Controllers\Booking;

use App\Http\Controllers\Controller;

use App\Models\Booking\BookingCategory;
use App\Models\Booking\BookingVenue;
use Illuminate\Http\Request;

class BookingVenueController extends Controller
{
   /**
     * Display a listing of venues with category filtering and search.
     */
    public function index(Request $request)
    {
        $venues = BookingVenue::with('category')
            ->when($request->category, function ($query, $category) {
                $query->byCategory($category);
            })
            ->when($request->search, function ($query, $search) {
                $query->search($search);
            })
            ->latest()
            ->paginate($request->get('per_page', 15));

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => $venues,
            ]);
        }

        return view('venues.index', compact('venues'));
    }

    /**
     * Show the form for creating a new venue.
     */
    public function create()
    {
        $categories = BookingCategory::all();
        return view('venues.create', compact('categories'));
    }

    /**
     * Store a newly created venue in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id'           => 'required|exists:categories,id',
            'name'                  => 'required|string|max:255',
            'area'                  => 'required|string|max:255',
            'address'               => 'required|string|max:255',
            'base_price'            => 'required|numeric|min:0',
            'commission_percentage' => 'nullable|numeric|min:0|max:100',
            'unit_label'            => 'required|string|max:50',
            'rating'                => 'nullable|numeric|min:0|max:5',
            'distance'              => 'nullable|string|max:50',
        ]);

        $validated['commission_percentage'] = $validated['commission_percentage'] ?? 10.00;
        $validated['rating'] = $validated['rating'] ?? 5.00;

        $venue = BookingVenue::create($validated);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Venue created successfully.',
                'data'    => $venue->load('category'),
            ], 201);
        }

        return redirect()->route('venues.index')
            ->with('success', 'Venue created successfully.');
    }

    /**
     * Display the specified venue details with reservations.
     */
    public function show(Request $request, BookingVenue $venue)
    {
        $venue->load(['category', 'reservations' => function ($query) {
            $query->latest();
        }]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data'    => $venue,
            ]);
        }

        return view('venues.show', compact('venue'));
    }

    /**
     * Show the form for editing the specified venue.
     */
    public function edit(BookingVenue $venue)
    {
        $categories = BookingCategory::all();
        return view('venues.edit', compact('venue', 'categories'));
    }

    /**
     * Update the specified venue in storage.
     */
    public function update(Request $request, BookingVenue $venue)
    {
        $validated = $request->validate([
            'category_id'           => 'required|exists:categories,id',
            'name'                  => 'required|string|max:255',
            'area'                  => 'required|string|max:255',
            'address'               => 'required|string|max:255',
            'base_price'            => 'required|numeric|min:0',
            'commission_percentage' => 'nullable|numeric|min:0|max:100',
            'unit_label'            => 'required|string|max:50',
            'rating'                => 'nullable|numeric|min:0|max:5',
            'distance'              => 'nullable|string|max:50',
        ]);

        $venue->update($validated);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Venue updated successfully.',
                'data'    => $venue->load('category'),
            ]);
        }

        return redirect()->route('venues.show', $venue)
            ->with('success', 'Venue updated successfully.');
    }

    /**
     * Remove the specified venue from storage.
     */
    public function destroy(Request $request, BookingVenue $venue)
    {
        // Prevent deletion if the venue has active or completed reservations
        if ($venue->reservations()->exists()) {
            $errorMsg = 'Cannot delete venue because it has active reservation records.';

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => $errorMsg,
                ], 422);
            }

            return redirect()->back()->with('error', $errorMsg);
        }

        $venue->delete();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Venue deleted successfully.',
            ]);
        }

        return redirect()->route('venues.index')
            ->with('success', 'Venue deleted successfully.');
    }
}
