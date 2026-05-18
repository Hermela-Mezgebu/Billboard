<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;

class BookingController extends Controller
{
    // 🔥 GET BOOKED DATES
    public function dates($id)
    {
        return \App\Models\Booking::where('billboard_id', $id)
    ->get(['start_date', 'end_date']);
    }

    // 🔥 CREATE BOOKING + CHAPA
    public function store(Request $req, $id)
    {
        $booking = Booking::create([
            'billboard_id' => $id,
            'user_id' => auth()->id(),
            'start_date' => $req->start_date,
            'end_date' => $req->end_date,
            'seconds_per_day' => $req->seconds_per_day, // ✅ NEW
    'total_price' => $req->amount, // ✅ NEW
    'status' => 'pending'
        ]);

        // 🔥 CHAPA API
      $response = Http::withHeaders([
    'Authorization' => 'Bearer ' . env('CHAPA_SECRET'),
])->post('https://api.chapa.co/v1/transaction/initialize', [
    "amount" => $req->amount,
    "currency" => "ETB",
    "email" => auth()->user()->email,
    "first_name" => auth()->user()->name,
    "tx_ref" => uniqid(),
    "callback_url" => "http://localhost:8000/api/payment/callback",
    "return_url" => "http://localhost:3000/success",
]);

        return response()->json([
            'checkout_url' => $response['data']['checkout_url']
        ]);
    }

    // 🔥 ADMIN VIEW
    public function index()
    {
        return Booking::latest()->get();
    }

    // 🔥 APPROVE BOOKING + EMAIL
    public function approve($id)
    {
        $booking = Booking::findOrFail($id);
        $booking->status = 'approved';
        $booking->save();

        Mail::raw("Your booking is approved!", function ($msg) use ($booking) {
            $msg->to($booking->user->email)
                ->subject("Booking Approved");
        });

        return response()->json(['message' => 'Approved']);
    }

    public function myBookings(Request $request)
    {
        return Booking::with('billboard:id,title,location,image,status')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();
    }

    public function ownerBookings(Request $request)
    {
        return Booking::query()
            ->whereHas('billboard', function ($q) use ($request) {
                $q->where('owner_id', $request->user()->id);
            })
            ->with(['billboard:id,title,location,image', 'user:id,name,email'])
            ->latest()
            ->get();
    }
}