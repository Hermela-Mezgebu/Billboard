<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Billboard;
use App\Models\Notification;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Events\BookingCreated;

class BookingController extends Controller
{
    /* ================= DATES ================= */
    public function dates($id)
    {
        return Booking::where('billboard_id', $id)
            ->get(['start_date', 'end_date']);
    }

    /* ================= CREATE BOOKING ================= */
    public function store(Request $req, $id)
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        try {
            $req->validate([
                'amount' => 'required|numeric|min:1',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after:start_date',
            ]);

            $billboard = Billboard::findOrFail($id);
            $owner = $billboard->owner;

            if (!$owner) {
                return response()->json([
                    'message' => 'Billboard owner not found'
                ], 400);
            }

            $tx_ref = "tx_" . time() . "_" . auth()->id();

            /* ================= PAYMENT ================= */
            $response = Http::timeout(30)
                ->withHeaders([
                    'Authorization' => 'Bearer ' . env('CHAPA_SECRET'),
                    'Content-Type' => 'application/json'
                ])
                ->post('https://api.chapa.co/v1/transaction/initialize', [
                    "amount" => (string)$req->amount,
                    "currency" => "ETB",
                    "email" => auth()->user()->email,
                    "first_name" => auth()->user()->name,
                    "tx_ref" => $tx_ref,
                    "callback_url" => url('/api/payment/callback'),
                    "return_url" => "http://localhost:3000/success"
                ]);

            $data = $response->json();

            if (!$response->successful() || !isset($data['data']['checkout_url'])) {
                return response()->json([
                    'message' => 'Chapa failed',
                    'error' => $data
                ], 500);
            }

            /* ================= CREATE BOOKING ================= */
            $booking = Booking::create([
                'billboard_id' => $id,
                'owner_id' => $owner->id,
                'user_id' => auth()->id(),
                'start_date' => $req->start_date,
                'end_date' => $req->end_date,
                'total_price' => $req->amount,
                'status' => 'pending'
            ]);

            /* ================= REALTIME ================= */
            broadcast(new BookingCreated($booking))->toOthers();

            /* ================= NOTIFICATION (OWNER) ================= */
            Notification::create([
                'owner_id' => $owner->id,
                'message' => '📢 New booking request received',
                'is_read' => false,
            ]);

            /* ================= EMAIL ================= */
            Mail::raw(
                "New booking request from {$booking->user->name}",
                function ($msg) use ($owner) {
                    $msg->to($owner->email)
                        ->subject("New Booking Request");
                }
            );

            return response()->json([
                'checkout_url' => $data['data']['checkout_url'],
                'booking' => $booking,
                'message' => 'Booking created successfully'
            ]);

        } catch (\Exception $e) {
            Log::error("BOOKING ERROR: " . $e->getMessage());

            return response()->json([
                'message' => 'Server error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /* ================= OWNER APPROVE ================= */
    public function approve($id)
    {
        $booking = Booking::findOrFail($id);

        // ✅ SECURITY
        if ($booking->owner_id !== auth()->id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // ❗ prevent double action
        if ($booking->status !== 'pending') {
            return response()->json([
                'message' => 'Booking already processed'
            ], 400);
        }

        $booking->status = 'approved';
        $booking->save();

        /* ================= NOTIFY CLIENT ================= */
        Notification::create([
            'owner_id' => $booking->user_id, // 👈 client
            'message' => '🎉 Your booking has been approved!',
            'is_read' => false,
        ]);

        /* ================= OPTIONAL: EMAIL CLIENT ================= */
        Mail::raw(
            "Your booking has been approved 🎉",
            function ($msg) use ($booking) {
                $msg->to($booking->user->email)
                    ->subject("Booking Approved");
            }
        );

        return response()->json([
            'message' => 'Booking approved successfully'
        ]);
    }

    /* ================= OWNER REJECT ================= */
    public function reject($id)
    {
        $booking = Booking::findOrFail($id);

        if ($booking->owner_id !== auth()->id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        if ($booking->status !== 'pending') {
            return response()->json([
                'message' => 'Booking already processed'
            ], 400);
        }

        $booking->status = 'rejected';
        $booking->save();

        Notification::create([
            'owner_id' => $booking->user_id,
            'message' => '❌ Your booking was rejected',
            'is_read' => false,
        ]);

        return response()->json([
            'message' => 'Booking rejected successfully'
        ]);
    }

    /* ================= ADMIN ================= */
    public function index()
    {
        return Booking::latest()->get();
    }

    /* ================= CLIENT BOOKINGS ================= */
    public function myBookings(Request $request)
    {
        return Booking::with('billboard:id,title,location,image,status')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();
    }

    /* ================= OWNER BOOKINGS ================= */
    public function ownerBookings(Request $request)
    {
        return Booking::with([
                'billboard:id,title,location,image',
                'user:id,name,email'
            ])
            ->where('owner_id', $request->user()->id)
            ->latest()
            ->get();
    }
}