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
    'type',
    'category', // ✅ ADD THIS
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