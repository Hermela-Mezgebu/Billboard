<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Billboard;
use App\Models\Notification;
use App\Events\NewNotification;

class BillboardController extends Controller
{
    /**
     * PUBLIC / OWNER VIEW
     */
    public function index(Request $request)
    {
        $user = $request->user('sanctum');

        // Owner sees their own billboards
        if ($user && $user->role === 'owner' && $request->query('mine') === '1') {
            return Billboard::with('owner:id,name,email')
                ->where('owner_id', $user->id)
                ->latest()
                ->get();
        }

        // Public sees only approved
        return Billboard::with('owner:id,name,email')
            ->where('status', 'approved')
            ->latest()
            ->get();
    }

    /**
     * ADMIN VIEW
     */
    public function adminIndex()
    {
        return Billboard::latest()->get();
    }

    /**
     * SHOW ONE
     */
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

    /**
     * CREATE BILLBOARD (OWNER)
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'description' => 'required|string',
            'type' => 'required|string|max:64',

            // ✅ NEW CATEGORY FIELD
            'category' => 'required|in:digital,static,smart,premium',

            'price' => 'required|numeric|min:0',
            'screen_size' => 'nullable|string|max:255',
            'duration' => 'nullable|string|max:255',
            'media' => 'required|file|mimes:jpg,jpeg,png,webp,mp4|max:51200',
        ]);

        $path = $request->file('media')->store('billboards', 'public');

        $billboard = Billboard::create([
            'owner_id' => $request->user()->id, // ✅ FIXED
            'title' => $request->title,
            'location' => $request->location,
            'description' => $request->description,
            'type' => $request->type,
            'category' => $request->category, // ✅ NEW
            'price' => $request->price,
            'screen_size' => $request->screen_size,
            'duration' => $request->duration,
            'image' => asset('storage/' . $path),
            'status' => 'pending',
        ]);

        return response()->json(
            $billboard->load('owner:id,name,email'),
            201
        );
    }

    /**
     * UPDATE
     */
    public function update(Request $request, $id)
    {
        $billboard = Billboard::findOrFail($id);

        if (
            $request->user()->id !== $billboard->owner_id &&
            $request->user()->role !== 'admin'
        ) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'location' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'type' => 'sometimes|string|max:64',
            'category' => 'sometimes|in:digital,static,smart,premium',
            'price' => 'sometimes|numeric|min:0',
        ]);

        $billboard->update([
            ...$request->except(['owner_id', 'status']),
            'status' => 'pending', // 🔁 re-review
        ]);

        return response()->json([
            'message' => 'Updated and sent for approval',
            'data' => $billboard,
        ]);
    }

    /**
     * DELETE
     */
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
     * APPROVE
     */
    public function approve($id)
    {
        $billboard = Billboard::findOrFail($id);

        $billboard->update([
            'status' => 'approved',
        ]);

        if ($billboard->owner_id) {
            $notification = Notification::create([
                'owner_id' => $billboard->owner_id,
                'message' => '✅ Your billboard has been approved',
                'type' => 'approval',
            ]);

            event(new NewNotification($notification));
        }

        return response()->json([
            'message' => 'Billboard approved successfully',
        ]);
    }

    /**
     * REJECT
     */
    public function reject(Request $request, $id)
    {
        $billboard = Billboard::findOrFail($id);

        $message = $request->input('message', 'Your billboard was rejected');

        $billboard->update([
            'status' => 'rejected',
            'rejection_reason' => $message,
        ]);

        if ($billboard->owner_id) {
            $notification = Notification::create([
                'owner_id' => $billboard->owner_id,
                'message' => '❌ ' . $message,
                'type' => 'rejection',
            ]);

            event(new NewNotification($notification));
        }

        return response()->json([
            'message' => 'Billboard rejected',
        ]);
    }

    /**
     * PENDING
     */
    public function pending()
    {
        return Billboard::where('status', 'pending')->latest()->get();
    }
}