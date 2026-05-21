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
    public function approve($id)
    {
        DB::beginTransaction();

        try {
            $billboard = Billboard::findOrFail($id);

            $billboard->status = 'approved';
            $billboard->save();

            // 🔔 NOTIFICATION
            if ($billboard->owner_id) {
                Notification::create([
                    'owner_id' => $billboard->owner_id,
                    'message' => '✅ Your billboard has been approved',
                    'type' => 'approval',
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Billboard approved successfully',
                'data' => $billboard
            ]);
        } catch (Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Approval failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * ❌ REJECT BILLBOARD
     */
    public function reject(Request $request, $id)
    {
        DB::beginTransaction();

        try {
            $request->validate([
                'message' => 'nullable|string|max:255',
            ]);

            $billboard = Billboard::findOrFail($id);

            $reason = $request->message ?? '❌ Your billboard was rejected';

            $billboard->status = 'rejected';
            $billboard->rejection_reason = $reason;
            $billboard->save();

            // 🔔 NOTIFICATION
            if ($billboard->owner_id) {
                Notification::create([
                    'owner_id' => $billboard->owner_id,
                    'message' => $reason,
                    'type' => 'rejection',
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Billboard rejected successfully',
                'data' => $billboard
            ]);
        } catch (Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Rejection failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}