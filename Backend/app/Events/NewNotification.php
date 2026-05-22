<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewNotification implements ShouldBroadcast
{
    use Dispatchable, SerializesModels;

    public $notification;

    /**
     * Create a new event instance.
     */
    public function __construct($notification)
    {
        $this->notification = $notification;
    }

    /**
     * ✅ PUBLIC CHANNEL (FIXED)
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('notifications'), // 🔥 simple & matches frontend
        ];
    }

    /**
     * ✅ EVENT NAME (MATCH FRONTEND)
     */
    public function broadcastAs()
    {
        return 'new.notification';
    }

    /**
     * ✅ DATA SENT TO FRONTEND
     */
    public function broadcastWith()
    {
        return [
            'id' => $this->notification->id,
            'message' => $this->notification->message,
            'type' => $this->notification->type,
            'is_read' => $this->notification->is_read,
            'created_at' => $this->notification->created_at,
        ];
    }
}