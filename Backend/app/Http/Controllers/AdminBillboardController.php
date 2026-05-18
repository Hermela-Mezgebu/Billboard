<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Billboard;
use App\Models\Notification;

class AdminBillboardController extends Controller
{
    /**
     * ✅ APPROVE BILLBOARD
     */
    public function approve($id)
    {
        $billboard = Billboard::findOrFail($id);

        // ✅ Update status
        $billboard->status = 'approved';
        $billboard->save();

        // ✅ Notify owner (if exists)
        if ($billboard->owner_id) {
            Notification::create([
                'owner_id' => $billboard->owner_id,
                'message' => 'Your billboard has been approved',
                'type' => 'admin'
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Billboard approved successfully'
        ]);
    }


    /**
     * ❌ REJECT BILLBOARD
     */
    public function reject(Request $request, $id)
    {
        $billboard = Billboard::findOrFail($id);

        $reason = $request->input('message', 'Your billboard was rejected');

        $billboard->status = 'rejected';
        $billboard->rejection_reason = $reason;
        $billboard->save();

        if ($billboard->owner_id) {
            Notification::create([
                'owner_id' => $billboard->owner_id,
                'message' => $reason,
                'type' => 'admin',
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Billboard rejected successfully',
        ]);
    }


    /**
     * ⏳ GET PENDING BILLBOARDS
     */
    public function pending()
    {
        return response()->json(
            Billboard::where('status', 'pending')->latest()->get()
        );
    }
}