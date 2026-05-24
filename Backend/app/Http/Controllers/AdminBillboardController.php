<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Billboard;
use App\Models\Notification;
use App\Events\NewNotification;
use App\Models\User;
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
    public function approve($id)
    {
        $billboard = Billboard::findOrFail($id);

        $billboard->update([
            'status' => 'approved'
        ]);

        // ✅ NOTIFY OWNER
        $notification = Notification::create([
            'owner_id' => $billboard->owner_id,
            'message' => '🎉 Your billboard has been approved!',
            'type' => 'billboard',
            'is_read' => 0,
        ]);

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
        $billboard = Billboard::findOrFail($id);

        $billboard->update([
            'status' => 'rejected',
            'rejection_reason' => $request->message
        ]);

        // ✅ NOTIFY OWNER
        $notification = Notification::create([
            'owner_id' => $billboard->owner_id,
            'message' => '❌ Your billboard was rejected: ' . $request->message,
            'type' => 'billboard',
            'is_read' => 0,
        ]);

        event(new NewNotification($notification));

        return response()->json([
            'message' => 'Billboard rejected'
        ]);
    }

    /**
     * 📢 SEND TO ADMIN (OPTIONAL HERE)
     */
    public function store(Request $request)
    {
        $billboard = Billboard::create([
            'owner_id' => auth()->id(),
            'status' => 'pending',
        ]);

        // ✅ NOTIFY ADMINS
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