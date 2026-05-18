<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel;
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
     * ✅ CHANNEL (VERY IMPORTANT)
     */
    public function broadcastOn(): array
    {
        return [
            // each owner listens to their own notifications
            new PrivateChannel('notifications.' . $this->notification->owner_id),
        ];
    }

    /**
     * ✅ EVENT NAME (clean for frontend)
     */
    public function broadcastAs()
    {
        return 'notification.new';
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
            'time' => $this->notification->created_at->diffForHumans(),
        ];
    }
}