<?php

namespace App\Http\Controllers\Booking;

use App\Http\Controllers\Controller;
use App\Models\Booking\BookingCategory;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class BookingCategoryController extends Controller
{
    /**
     * Display a listing of categories.
     */
    public function index(Request $request)
    {
        $categories = User::where('role','Lessee')
            ->with(['categories'])
            ->latest()
            ->get();


        return response()->json($categories);
    }

    /**
     * Show the form for creating a new category.
     */
    public function create()
    {
        return view('categories.create');
    }

    /**
     * Store a newly created category in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'       => 'required|string|max:255',
            'key'        => 'nullable|string|max:255|unique:categories,key',
            'icon'       => 'nullable|string|max:255',
            'badge_text' => 'nullable|string|max:50',
            'is_badge'   => 'nullable|boolean',
        ]);

        // Auto-generate key/slug if not manually supplied
        $validated['key'] = $validated['key'] ?? Str::slug($validated['name']);
        $validated['is_badge'] = $request->boolean('is_badge');

        $category = BookingCategory::create($validated);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Category created successfully.',
                'data'    => $category,
            ], 201);
        }

        return redirect()->route('categories.index')
            ->with('success', 'Category created successfully.');
    }

    /**
     * Display the specified category along with its venues.
     */
    public function show(Request $request, BookingCategory $category)
    {
        $category->load(['venues' => function ($query) {
            $query->latest();
        }]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data'    => $category,
            ]);
        }

        return view('categories.show', compact('category'));
    }

    /**
     * Show the form for editing the specified category.
     */
    public function edit(BookingCategory $category)
    {
        return view('categories.edit', compact('category'));
    }

    /**
     * Update the specified category in storage.
     */
    public function update(Request $request, BookingCategory $category)
    {
        $validated = $request->validate([
            'name'       => 'required|string|max:255',
            'key'        => ['nullable', 'string', 'max:255', Rule::unique('categories', 'key')->ignore($category->id)],
            'icon'       => 'nullable|string|max:255',
            'badge_text' => 'nullable|string|max:50',
            'is_badge'   => 'nullable|boolean',
        ]);

        $validated['key'] = $validated['key'] ?? Str::slug($validated['name']);
        $validated['is_badge'] = $request->boolean('is_badge');

        $category->update($validated);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Category updated successfully.',
                'data'    => $category,
            ]);
        }

        return redirect()->route('categories.index')
            ->with('success', 'Category updated successfully.');
    }

    /**
     * Remove the specified category from storage.
     */
    public function destroy(Request $request, BookingCategory $category)
    {
        // Prevent deletion if category still has associated venues
        if ($category->venues()->exists()) {
            $errorMsg = 'Cannot delete category because it has active venues assigned to it.';

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => $errorMsg,
                ], 422);
            }

            return redirect()->back()->with('error', $errorMsg);
        }

        $category->delete();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Category deleted successfully.',
            ]);
        }

        return redirect()->route('categories.index')
            ->with('success', 'Category deleted successfully.');
    }
}
