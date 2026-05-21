<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;

class NotificationController extends Controller
{
    // ✅ GET OWNER NOTIFICATIONS
    public function index(Request $request)
    {
        $ownerId = $request->user()->id;

        return response()->json(
            Notification::where('owner_id', $ownerId)
                ->latest()
                ->get()
        );
    }
}
