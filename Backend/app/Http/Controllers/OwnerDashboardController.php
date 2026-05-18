<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Billboard;
use App\Models\Order;
use App\Models\Lead;
use App\Models\Notification;
use Carbon\Carbon;

class OwnerDashboardController extends Controller
{
    public function index(Request $request)
    {
        $ownerId = $request->user()->id;

        // ✅ TOTAL REACH (views)
        $reach = Billboard::where('owner_id', $ownerId)->sum('views');

        // ✅ LEADS
        $leads = Lead::where('owner_id', $ownerId)->count();

        // ✅ PAYOUTS
        $payouts = Order::where('owner_id', $ownerId)
            ->where('status', 'completed')
            ->sum('total_price');

        // ✅ BOOKINGS (days of current month)
        $orders = Order::where('owner_id', $ownerId)->get();

        $bookings = $orders->map(function ($o) {
            return Carbon::parse($o->start_date)->day;
        });

        // ✅ NEXT VACANCY (latest billboard)
        $billboard = Billboard::where('owner_id', $ownerId)->latest()->first();

        // ✅ INTERACTIONS
        $notifications = Notification::where('owner_id', $ownerId)
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'reach' => $reach,
            'leads' => $leads,
            'payouts' => $payouts,
            'rank' => 4, // you can improve later
            'bookings' => $bookings,
            'nextVacancy' => $billboard ? [
                'location' => $billboard->location,
                'date' => now()->addDays(7)->format('M d')
            ] : null,
            'interactions' => $notifications->map(function ($n) {
                return [
                    'user' => $n->sender ?? 'System',
                    'msg' => $n->message,
                    'time' => $this->timeAgo($n->created_at)
                ];
            })
        ]);
    }

    private function timeAgo($date)
    {
        $diff = Carbon::now()->diffInMinutes($date);

        if ($diff < 60) return $diff . 'm';
        if ($diff < 1440) return floor($diff / 60) . 'h';
        return floor($diff / 1440) . 'd';
    }
}