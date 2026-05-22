<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;

class NotificationController extends Controller
{
    // ✅ GET ALL
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'admin') {
            return Notification::latest()->get();
        }

        return Notification::where('owner_id', $user->id)
            ->latest()
            ->get();
    }

    // ✅ UNREAD COUNT
    public function unreadCount(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'admin') {
            return [
                'count' => Notification::where('is_read', false)->count()
            ];
        }

        return [
            'count' => Notification::where('owner_id', $user->id)
                ->where('is_read', false)
                ->count()
        ];
    }

    // ✅ MARK ONE AS READ
    public function markAsRead($id)
    {
        $notification = Notification::findOrFail($id);
        $notification->update(['is_read' => true]);

        return response()->json(['message' => 'Marked as read']);
    }

    // ✅ MARK ALL AS READ
    public function markAll(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'admin') {
            Notification::where('is_read', false)->update(['is_read' => true]);
        } else {
            Notification::where('owner_id', $user->id)
                ->where('is_read', false)
                ->update(['is_read' => true]);
        }

        return response()->json(['message' => 'All marked as read']);
    }
}