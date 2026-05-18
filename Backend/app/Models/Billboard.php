<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Billboard extends Model
{
protected $fillable = [
    'owner_id',
    'title',
    'location',
    'description',
    'image',
    'screen_size',
    'duration',
    'price',
    'type',
    'status',
    'rejection_reason'
];

    protected $casts = [
        'is_available' => 'boolean',
    ];

    // ✅ RELATIONSHIPS

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function images()
    {
        return $this->hasMany(BillboardImage::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}