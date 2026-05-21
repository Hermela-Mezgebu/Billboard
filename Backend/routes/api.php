<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;

use App\Models\Booking;
use App\Models\Billboard;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BillboardController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\OwnerDashboardController;
use App\Http\Controllers\AdminBillboardController;

/*
|--------------------------------------------------------------------------
| AUTH ROUTES
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/

// Billboards
Route::get('/billboards', [BillboardController::class, 'index']);
Route::get('/billboards/{id}', [BillboardController::class, 'show'])->whereNumber('id');

// Booked dates
Route::get('/billboards/{id}/schedule-screen', function ($id) {
    return Booking::where('billboard_id', $id)->pluck('start_date');
});

/*
|--------------------------------------------------------------------------
| PROTECTED ROUTES (SANCTUM)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // ✅ CURRENT USER
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    /*
    |--------------------------------------------------------------------------
    | OWNER ROUTES
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:owner')->group(function () {
        Route::post('/billboards', [BillboardController::class, 'store']);
        Route::put('/billboards/{id}', [BillboardController::class, 'update']);
        Route::delete('/billboards/{id}', [BillboardController::class, 'destroy']);
        Route::get('/owner/dashboard', [OwnerDashboardController::class, 'dashboard']);
        Route::get('/owner/bookings', [BookingController::class, 'ownerBookings']);
    });

    /*
    |--------------------------------------------------------------------------
    | ADMIN ROUTES
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/billboards/pending', [AdminBillboardController::class, 'pending']);
        Route::post('/admin/billboards/{id}/approve', [AdminBillboardController::class, 'approve']);
        Route::post('/admin/billboards/{id}/reject', [AdminBillboardController::class, 'reject']);

        Route::get('/admin/bookings', [BookingController::class, 'index']);
        Route::post('/admin/bookings/{id}/approve', [BookingController::class, 'approve']);
    });

    /*
    |--------------------------------------------------------------------------
    | CLIENT ROUTES
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:client')->group(function () {
        Route::post('/bookings/{id}', [BookingController::class, 'store']);
        Route::get('/my-bookings', [BookingController::class, 'myBookings']);
    });

    Route::post('/user/update', function (Request $req) {
    $user = $req->user();

    $req->validate([
        'name' => 'required|string',
        'email' => 'required|email',
        'password' => 'nullable|min:6',
        'image' => 'nullable|image'
    ]);

    if ($req->hasFile('image')) {
        $path = $req->file('image')->store('profiles', 'public');
        $user->image = $path;
    }

    $user->name = $req->name;
    $user->email = $req->email;

    if ($req->password) {
        $user->password = bcrypt($req->password);
    }

    $user->save();

    return response()->json([
        'user' => $user
    ]);
});

});