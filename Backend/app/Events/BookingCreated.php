<?php

namespace App\Events;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class BookingCreated implements ShouldBroadcast
{
    public $booking;

    public function __construct($booking)
    {
        $this->booking = $booking;
    }

    public function broadcastOn()
    {
        return new Channel('owner.' . $this->booking->billboard->owner_id);
    }
}