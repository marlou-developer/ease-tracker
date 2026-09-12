<?php

// use App\Http\Controllers\Admin\AdminCategoryController;
// use App\Http\Controllers\Admin\AdminDashboardController;
// use App\Http\Controllers\Admin\AdminOrderController;
// use App\Http\Controllers\Admin\AdminVenueController;
// use App\Http\Controllers\Booker\BookerDashboardController;
// use App\Http\Controllers\Booker\BookerReservationController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('home/page');
});

Route::get('/administrator/dashboard', function () {
    return Inertia::render('administrator/page');
});

/*
|--------------------------------------------------------------------------
| Profile Routes (Authenticated Users)
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/*
|--------------------------------------------------------------------------
| Admin Portal Routes
|--------------------------------------------------------------------------
*/
// Route::middleware(['auth', 'verified', 'role:admin'])
//     ->prefix('admin')
//     ->name('admin.')
//     ->group(function () {
//         Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

//         // Admin Management Resources
//         Route::resource('categories', AdminCategoryController::class);
//         Route::resource('venues', AdminVenueController::class);
//         Route::resource('orders', AdminOrderController::class)->only(['index', 'show', 'update', 'destroy']);
//     });

/*
|--------------------------------------------------------------------------
| Subscriber / Booker Portal Routes
|--------------------------------------------------------------------------
*/
// Route::middleware(['auth', 'verified', 'role:subscriber,booker'])
//     ->prefix('portal')
//     ->name('booker.')
//     ->group(function () {
//         Route::get('/dashboard', [BookerDashboardController::class, 'index'])->name('dashboard');
//         Route::get('/reservations/{id}', [BookerReservationController::class, 'show'])->name('reservations.show');
//         Route::post('/reservations/{id}/cancel', [BookerReservationController::class, 'cancel'])->name('reservations.cancel');
//     });

/*
|--------------------------------------------------------------------------
| Dynamic Role Dashboard Redirect
|--------------------------------------------------------------------------
*/
// Route::get('/dashboard', function () {
//     $user = auth()->user();

//     if ($user->role === 'admin') {
//         return redirect()->route('admin.dashboard');
//     }

//     return redirect()->route('booker.dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

require __DIR__ . '/auth.php';


Route::get('/sw.js', function () {
    $swContent = "
        self.addEventListener('install', (e) => self.skipWaiting());
        self.addEventListener('activate', (e) => e.waitUntil(clients.claim()));
        self.addEventListener('fetch', (e) => {
            e.respondWith(fetch(e.request));
        });
    ";

    return response($swContent, 200)
        ->header('Content-Type', 'application/javascript')
        ->header('Service-Worker-Allowed', '/');
});


Route::get('/manifest.json', function () {
    return response()->json([
        'name' => 'Ease Reservation',
        'short_name' => 'EaseRes',
        'start_url' => '/',
        'scope' => '/',
        'id' => '/',
        'background_color' => '#ffffff',
        'theme_color' => '#0f172a',
        'display' => 'standalone',
        'orientation' => 'portrait',
        'icons' => [
            [
                'src' => url('/images/logo.png'),
                'sizes' => '192x192',
                'type' => 'image/png',
                'purpose' => 'any maskable'
            ],
            [
                'src' => url('/images/logo.png'),
                'sizes' => '512x512',
                'type' => 'image/png',
                'purpose' => 'any maskable'
            ]
        ]
    ]);
});
