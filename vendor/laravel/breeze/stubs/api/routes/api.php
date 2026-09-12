<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Booker\BookerDashboardController;
use App\Http\Controllers\Booker\BookerReservationController;
use App\Http\Controllers\Reservation\ApiReservationController;
use App\Http\Controllers\Reservation\CategoryController;
use App\Http\Controllers\Reservation\OrderController;
use App\Http\Controllers\Reservation\ReservationController;
use App\Http\Controllers\Reservation\VenueController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Authenticated User Route
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

/*
|--------------------------------------------------------------------------
| Public API Endpoints (v1)
|--------------------------------------------------------------------------
*/
Route::prefix('v1')->group(function () {

    // 1. Categories & Venues
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/venues', [VenueController::class, 'index']);
    Route::get('/venues/{venue}', [VenueController::class, 'show']);

    // 2. Availability & Checkout
    Route::get('/venues/{venue}/availability', [ApiReservationController::class, 'checkAvailability']);
    Route::post('/checkout', [OrderController::class, 'store']);

    // 3. Guest Lookups
    Route::get('/orders/{order_code}', [ApiReservationController::class, 'trackOrder']);
});

/*
|--------------------------------------------------------------------------
| Booker / Subscriber Portal API Endpoints
|--------------------------------------------------------------------------
*/
Route::prefix('v1/booker')
    ->middleware(['auth:sanctum', 'role:subscriber,booker'])
    ->group(function () {
        Route::get('/dashboard', [BookerDashboardController::class, 'index']);
        Route::get('/reservations/{id}', [BookerReservationController::class, 'show']);
        Route::post('/reservations/{id}/cancel', [BookerReservationController::class, 'cancel']);
    });

/*
|--------------------------------------------------------------------------
| Admin / Management API Endpoints
|--------------------------------------------------------------------------
*/
Route::prefix('v1/admin')
    ->middleware(['auth:sanctum', 'role:admin'])
    ->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index']);

        // Admin CRUD API Resources
        Route::apiResource('categories', CategoryController::class);
        Route::apiResource('venues', VenueController::class);
        Route::apiResource('orders', OrderController::class);
        Route::apiResource('reservations', ReservationController::class);
    });
