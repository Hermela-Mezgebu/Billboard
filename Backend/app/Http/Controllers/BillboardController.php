<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Billboard;
use App\Models\Notification;
use App\Events\NewNotification;

class BillboardController extends Controller
{
    /**
     * Public: approved only. Owner (auth): own listings (any status).
     */
    public function index(Request $request)
    {
        $user = $request->user('sanctum');

        if ($user && $user->isOwner() && $request->query('mine') === '1') {
            return Billboard::with('owner:id,name,email')
                ->where('owner_id', $user->id)
                ->latest()
                ->get();
        }

        return Billboard::with('owner:id,name,email')
            ->where('status', 'approved')
            ->latest()
            ->get();
    }

    public function adminIndex()
    {
        return Billboard::latest()->get();
    }

    public function show(Request $request, $id)
    {
        $billboard = Billboard::with('owner:id,name,email')->findOrFail($id);
        $user = $request->user('sanctum');

        if ($billboard->status !== 'approved') {
            $allowed = $user && ($user->isAdmin() || (int) $user->id === (int) $billboard->owner_id);
            if (! $allowed) {
                abort(404);
            }
        }

        return $billboard;
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'description' => 'required|string',
            'type' => 'required|string|max:64',
            'price' => 'required|numeric|min:0',
            'screen_size' => 'nullable|string|max:255',
            'duration' => 'nullable|string|max:255',
            'media' => 'required|file|mimes:jpg,jpeg,png,webp,mp4|max:51200',
        ]);

        $path = $request->file('media')->store('billboards', 'public');

        $billboard = Billboard::create([
            'owner_id' => $request->user()->id,
            'title' => $request->title,
            'location' => $request->location,
            'description' => $request->description,
            'type' => $request->type,
            'price' => $request->price,
            'screen_size' => $request->screen_size,
            'duration' => $request->duration,
            'image' => asset('storage/' . $path),
            'status' => 'pending',
        ]);

        return response()->json($billboard->load('owner:id,name,email'), 201);
    }

    public function update(Request $request, $id)
    {
        $billboard = Billboard::findOrFail($id);

        if ($request->user()->id !== (int) $billboard->owner_id && ! $request->user()->isAdmin()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $billboard->update([
            ...$request->except(['owner_id', 'status']),
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Updated and sent for re-approval',
            'data' => $billboard,
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $billboard = Billboard::findOrFail($id);

        if ($request->user()->id !== (int) $billboard->owner_id && ! $request->user()->isAdmin()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $billboard->delete();

        return response()->json([
            'message' => 'Deleted successfully',
        ]);
    }

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

    public function pending()
    {
        return Billboard::where('status', 'pending')->latest()->get();
    }
}
