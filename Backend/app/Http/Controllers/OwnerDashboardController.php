<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Billboard;
use App\Models\Booking;

class OwnerDashboardController extends Controller
{
    public function dashboard(Request $request)
    {
        $user = $request->user();

        $billboards = Billboard::where('owner_id', $user->id)->count();

        $bookings = Booking::whereHas('billboard', function ($q) use ($user) {
            $q->where('owner_id', $user->id);
        })->count();

        return response()->json([
            'total_billboards' => $billboards,
            'total_bookings' => $bookings,
        ]);
    }
}