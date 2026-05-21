<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'owner_id',
        'message',
        'type',
        'is_read',
    ];
}
