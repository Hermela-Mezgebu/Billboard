<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BillboardImage extends Model
{
    protected $fillable = [
        'billboard_id',
        'image_url'
    ];

    public function billboard()
    {
        return $this->belongsTo(Billboard::class);
    }
}