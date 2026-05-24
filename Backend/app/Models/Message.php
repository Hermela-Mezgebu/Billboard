<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
   public function approve($id)
{
    $billboard = Billboard::findOrFail($id);

    $billboard->status = 'approved';
    $billboard->save();

    // ✅ SEND MESSAGE (THIS IS WHAT YOU ARE MISSING)
    Message::create([
        'title' => 'Billboard Approved',
        'content' => 'Your billboard "' . $billboard->title . '" has been approved.',
        'user_id' => $billboard->user_id, // owner
    ]);

    return response()->json([
        'message' => 'Billboard approved successfully'
    ]);
}
}
