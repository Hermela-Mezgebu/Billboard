<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class BookingController extends Controller
{
    public function dates($id)
    {
        return Booking::where('billboard_id', $id)
            ->get(['start_date', 'end_date']);
    }

   public function store(Request $req, $id)
{
    if (!auth()->check()) {
        return response()->json([
            'message' => 'Unauthenticated'
        ], 401);
    }

    try {
        $chapaSecret = config('services.chapa.secret');

        if (!$chapaSecret) {
            return response()->json([
                'message' => 'Chapa secret key missing'
            ], 500);
        }

      $response = Http::withHeaders([
    'Authorization' => 'Bearer ' . env('CHAPA_SECRET'),
    'Content-Type' => 'application/json'
])->post('https://api.chapa.co/v1/transaction/initialize', [
    "amount" => (string) $req->amount,
    "currency" => "ETB",
    "email" => auth()->user()->email,
    "first_name" => auth()->user()->name,
    "last_name" => "User",
    "phone_number" => "0912345678",
    "tx_ref" => uniqid('tx_'),
    "callback_url" => "http://127.0.0.1:8000/api/payment/callback",
    "return_url" => "http://localhost:3000/success",
]);

       

      \Log::info('CHAPA RAW:', [
    'status' => $response->status(),
    'body' => $response->body()
]);
 $data = $response->json();
        // 🔴 IMPORTANT: check status
        if (!$response->successful() || !isset($data['data']['checkout_url'])) {
            return response()->json([
                'message' => 'Chapa failed',
                'error' => $data
            ], 500);
        }

        Booking::create([
            'billboard_id' => $id,
            'user_id' => auth()->id(),
            'start_date' => $req->start_date,
            'end_date' => $req->end_date,
            'seconds_per_day' => $req->seconds_per_day,
            'total_price' => $req->amount,
            'status' => 'pending'
        ]);

        return response()->json([
            'checkout_url' => $data['data']['checkout_url']
        ]);

    } catch (\Exception $e) {
        Log::error("BOOKING ERROR: " . $e->getMessage());

        return response()->json([
            'message' => 'Server error',
            'error' => $e->getMessage()
        ], 500);
    }
}
    public function index()
    {
        return Booking::latest()->get();
    }

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