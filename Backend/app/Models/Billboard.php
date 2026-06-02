<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Billboard extends Model
{
    protected $fillable = [
        'owner_id',
        'title',
        'location',
        'description',
        'type',
        'category',
        'price',
        'screen_size',
        'duration',
        'image',
        'status',
    ];

    protected $casts = [
        'is_available' => 'boolean',
        'category' => 'string',
    ];

    // ✅ OWNER RELATION (ONLY ONE — CLEAN)
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function images()
    {
        return $this->hasMany(BillboardImage::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}