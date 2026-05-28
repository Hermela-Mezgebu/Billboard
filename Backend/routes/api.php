<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

use App\Models\Booking;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BillboardController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\OwnerDashboardController;
use App\Http\Controllers\AdminBillboardController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\NotificationController;


use App\Http\Controllers\PasswordController;
/*
|--------------------------------------------------------------------------
| AUTH ROUTES
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [PasswordController::class, 'forgot']);
Route::post('/reset-password', [PasswordController::class, 'reset']);
Route::post('/bookings', [BookingController::class, 'store']);
Route::middleware('auth:api')->get('/me', [AuthController::class, 'me']);
Route::get('/blogs/{id}', function ($id) {
    return \App\Models\Blog::findOrFail($id);
});
/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/
Route::get('/billboards', [BillboardController::class, 'index']);
Route::get('/billboards/{id}', [BillboardController::class, 'show'])->whereNumber('id');

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
    | 🔔 NOTIFICATIONS (FIXED)
    |--------------------------------------------------------------------------
    */
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);

    Route::post('/notifications/{id}/read', function ($id) {
        $notification = \App\Models\Notification::findOrFail($id);
        $notification->update(['is_read' => true]);

        return response()->json(['message' => 'Marked as read']);
    });

    Route::post('/notifications/read-all', [NotificationController::class, 'markAll']);

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

        // ✅ DASHBOARD (🔥 FIXED - IMPORTANT)
        Route::get('/admin/dashboard', function () {
            return response()->json([
                'users' => \App\Models\User::count(),
                'billboards' => \App\Models\Billboard::count(),
                'bookings' => \App\Models\Booking::count(),
                'pending_billboards' => \App\Models\Billboard::where('status', 'pending')->count(),
            ]);
        });

        // Billboards
        Route::get('/admin/billboards/pending', [AdminBillboardController::class, 'pending']);
        Route::post('/admin/billboards/{id}/approve', [AdminBillboardController::class, 'approve']);
        Route::post('/admin/billboards/{id}/reject', [AdminBillboardController::class, 'reject']);

        // Bookings
        Route::get('/admin/bookings', [BookingController::class, 'index']);
        Route::post('/admin/bookings/{id}/approve', [BookingController::class, 'approve']);

        // Admin Users
        Route::get('/admins', [AdminController::class, 'index']);
        Route::post('/admins', [AdminController::class, 'store']);
        Route::delete('/admins/{id}', [AdminController::class, 'destroy']);
        Route::patch('/admins/toggle/{id}', [AdminController::class, 'toggle']);
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

    /*
    |--------------------------------------------------------------------------
    | PROFILE UPDATE
    |--------------------------------------------------------------------------
    */
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