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

        Route::post('/bookings/{id}', function (Request $req, $id) {

            // ✅ VALIDATION
            $req->validate([
                'start_date' => 'required|date',
                'end_date' => 'required|date|after_or_equal:start_date',
                'amount' => 'required|numeric|min:1',
            ]);

            // ✅ GET BILLBOARD
            $billboard = Billboard::findOrFail($id);

            // ✅ CALCULATE DAYS
            $start = Carbon::parse($req->start_date);
            $end = Carbon::parse($req->end_date);
            $days = $start->diffInDays($end) + 1;

            // ✅ CALCULATE PRICE (SERVER-SIDE SAFE)
            $total_price = $days * $billboard->price;

            // ✅ CREATE BOOKING
            $booking = Booking::create([
                'billboard_id' => $id,
                'user_id' => $req->user()->id,
                'start_date' => $start,
                'end_date' => $end,
                'total_price' => $total_price,
                'status' => 'pending',
            ]);

            // ✅ PAYMENT
            $tx_ref = uniqid('tx_');

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . env('CHAPA_SECRET_KEY'),
            ])->post('https://api.chapa.co/v1/transaction/initialize', [
                "amount" => $total_price,
                "currency" => "ETB",
                "email" => $req->user()->email,
                "tx_ref" => $tx_ref,
                "callback_url" => url('/api/payment/callback'),
                "return_url" => "http://localhost:3000/payment-success",
                "customization" => [
                    "title" => "Billboard Booking",
                    "description" => "Payment for billboard booking"
                ]
            ]);

            $data = $response->json();

            return response()->json([
                'booking' => $booking,
                'checkout_url' => $data['data']['checkout_url'] ?? null
            ]);
        });

        Route::get('/my-bookings', [BookingController::class, 'myBookings']);
    });

});