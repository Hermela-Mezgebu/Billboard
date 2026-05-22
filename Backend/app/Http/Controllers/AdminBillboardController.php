<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Billboard;
use App\Models\Notification;
use Illuminate\Support\Facades\DB;
use Exception;

class AdminBillboardController extends Controller
{
    /**
     * ⏳ GET PENDING BILLBOARDS
     */
    public function pending()
    {
        try {
            $billboards = Billboard::where('status', 'pending')
                ->latest()
                ->get();

            return response()->json([
                'success' => true,
                'data' => $billboards
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load billboards',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ APPROVE BILLBOARD
     */
  use App\Models\Notification;
use App\Events\NewNotification;

public function approve($id)
{
    $billboard = \App\Models\Billboard::findOrFail($id);

    $billboard->update([
        'status' => 'approved'
    ]);

    // ✅ CREATE NOTIFICATION
    $notification = Notification::create([
        'owner_id' => $billboard->owner_id,
        'message' => '🎉 Your billboard has been approved!',
        'type' => 'billboard',
        'is_read' => 0,
    ]);

    // ✅ FIRE EVENT (🔥 THIS WAS MISSING)
    event(new NewNotification($notification));

    return response()->json([
        'message' => 'Billboard approved'
    ]);
}

    /**
     * ❌ REJECT BILLBOARD
     */
  public function reject(Request $request, $id)
{
    $billboard = \App\Models\Billboard::findOrFail($id);

    $billboard->update([
        'status' => 'rejected',
        'rejection_reason' => $request->message
    ]);

    // ✅ CREATE NOTIFICATION
    $notification = Notification::create([
        'owner_id' => $billboard->owner_id,
        'message' => '❌ Your billboard was rejected: ' . $request->message,
        'type' => 'billboard',
        'is_read' => 0,
    ]);

    // ✅ FIRE EVENT
    event(new NewNotification($notification));

    return response()->json([
        'message' => 'Billboard rejected'
    ]);
}

use App\Models\Notification;
use App\Events\NewNotification;
use App\Models\User;

public function store(Request $request)
{
    $billboard = Billboard::create([
        // your fields...
        'owner_id' => auth()->id(),
        'status' => 'pending',
    ]);

    // ✅ SEND TO ADMIN
    $admins = User::where('role', 'admin')->get();

    foreach ($admins as $admin) {
        $notification = Notification::create([
            'owner_id' => $admin->id,
            'message' => '📢 New billboard submitted for approval',
            'type' => 'admin',
            'is_read' => 0,
        ]);

        event(new NewNotification($notification));
    }

    return response()->json($billboard);
}
}