<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Venue;
use Illuminate\Http\Request;

class AdminVenueController extends Controller
{
    public function index(Request $request)
    {
        $venues = Venue::with('category')->withCount('reservations')->latest()->paginate(15);

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'data' => $venues]);
        }

        return view('admin.venues.index', compact('venues'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id'           => 'required|exists:categories,id',
            'name'                  => 'required|string|max:255',
            'area'                  => 'required|string|max:255',
            'address'               => 'required|string|max:255',
            'base_price'            => 'required|numeric|min:0',
            'commission_percentage' => 'required|numeric|min:0|max:100',
            'unit_label'            => 'required|string|max:50',
        ]);

        $venue = Venue::create($validated);

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'message' => 'Venue created by Admin.', 'data' => $venue], 201);
        }

        return redirect()->route('admin.venues.index')->with('success', 'Venue created successfully.');
    }
}