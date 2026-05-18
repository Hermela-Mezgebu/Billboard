<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
 protected $fillable = [
    'billboard_id',
    'user_id',
    'start_date',
    'end_date',
    'total_price',
    'seconds_per_day',
    'status'
];

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function billboard()
    {
        return $this->belongsTo(\App\Models\Billboard::class);
    }
}