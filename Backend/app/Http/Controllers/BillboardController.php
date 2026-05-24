<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Billboard;
use App\Models\Notification;
use App\Events\NewNotification;

class BillboardController extends Controller
{
  public function index(Request $request)
    {
        $user = $request->user('sanctum');

        $query = Billboard::query();

        // ✅ OWNER: only their billboards
        if ($user && $user->role === 'owner' && $request->query('mine') === '1') {
            $query->where('owner_id', $user->id);
        }

        // ✅ FILTER BY STATUS (admin OR general use)
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // ✅ DEFAULT: if NO filters → only approved (public view)
        if (!$request->has('status') && $request->query('mine') !== '1') {
            $query->where('status', 'approved');
        }

        return $query->latest()->get();
    }

    /**
     * GET /api/admin/billboards
     * (Optional: full admin access)
     */
    public function adminIndex(Request $request)
    {
        $user = $request->user('sanctum');

        // 🔒 SECURITY: only admin allowed
        if (!$user || $user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return Billboard::latest()->get();
    }

    public function show(Request $request, $id)
    {
        $billboard = Billboard::with('owner:id,name,email')->findOrFail($id);
        $user = $request->user('sanctum');

        if ($billboard->status !== 'approved') {
            $allowed = $user && (
                $user->role === 'admin' ||
                $user->id == $billboard->owner_id
            );

            if (!$allowed) {
                abort(404);
            }
        }

        return $billboard;
    }

public function store(Request $request)
{
    $request->validate([
        'title' => 'required',
        'location' => 'required',
        'description' => 'required',
        'type' => 'required',
        'screen_size' => 'required',
        'price' => 'required',
        'media' => 'required|image'
    ]);

    $path = $request->file('media')->store('billboards', 'public');

    $billboard = Billboard::create([
        'title' => $request->title,
        'location' => $request->location,
        'description' => $request->description,
        'type' => $request->type,
        'screen_size' => $request->screen_size,
        'price' => $request->price,
        'status' => 'pending',
        'image' => $path,
        'owner_id' => $request->user()->id,
    ]);

    // 🔥 ✅ SEND NOTIFICATION TO ADMIN
    $admins = \App\Models\User::where('role', 'admin')->get();

    foreach ($admins as $admin) {
        $notification = Notification::create([
            'owner_id' => $admin->id, // admin receives it
            'message' => '📢 New billboard submitted: ' . $billboard->title,
            'type' => 'submission',
        ]);

        event(new NewNotification($notification));
    }

    return response()->json($billboard);
}

    public function update(Request $request, $id)
    {
        $billboard = Billboard::findOrFail($id);

        if (
            $request->user()->id !== $billboard->owner_id &&
            $request->user()->role !== 'admin'
        ) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $billboard->update([
            ...$request->except(['owner_id', 'status']),
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Updated and sent for approval',
            'data' => $billboard,
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $billboard = Billboard::findOrFail($id);

        if (
            $request->user()->id !== $billboard->owner_id &&
            $request->user()->role !== 'admin'
        ) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $billboard->delete();

        return response()->json([
            'message' => 'Deleted successfully',
        ]);
    }

    /**
     * ✅ APPROVE (FIXED)
     */
  public function approve($id)
{
    $billboard = Billboard::findOrFail($id);

    $billboard->update([
        'status' => 'approved',
    ]);

    // 🔥 DEBUG (optional - you can remove later)
    if (!$billboard->owner_id) {
        return response()->json([
            'error' => 'owner_id is NULL — cannot send notification'
        ], 500);
    }

    // ✅ ALWAYS CREATE NOTIFICATION
    $notification = Notification::create([
        'owner_id' => $billboard->owner_id,
        'message' => '✅ Your billboard "' . $billboard->title . '" has been approved',
        'type' => 'approval',
    ]);

    event(new NewNotification($notification));

    return response()->json([
        'message' => 'Billboard approved + notification sent',
    ]);
}

    /**
     * ✅ REJECT (FIXED)
     */
public function reject(Request $request, $id)
{
    $billboard = Billboard::findOrFail($id);

    $message = $request->input('message', 'Your billboard was rejected');

    $billboard->update([
        'status' => 'rejected',
        'rejection_reason' => $message,
    ]);

    if (!$billboard->owner_id) {
        return response()->json([
            'error' => 'owner_id is NULL — cannot send notification'
        ], 500);
    }

    $notification = Notification::create([
        'owner_id' => $billboard->owner_id,
        'message' => '❌ ' . $message,
        'type' => 'rejection',
    ]);

    event(new NewNotification($notification));

    return response()->json([
        'message' => 'Billboard rejected + notification sent',
    ]);
}

    public function pending()
    {
        return Billboard::where('status', 'pending')->latest()->get();
    }
}