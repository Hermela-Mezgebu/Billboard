<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
protected $fillable = [
    'name',
    'email',
    'password',
    'role',
    'license_number',
    'profile_image',
    'company_name',
    'description',
];

 public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

public function isAdmin()
{
    return $this->role === 'admin';
}

public function isOwner()
{
    return $this->role === 'owner';
}
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function billboards()
    {
        return $this->hasMany(Billboard::class, 'owner_id');
    }

public function bookings()
{
    return $this->hasMany(\App\Models\Booking::class);
}

public function carts()
{
    return $this->hasMany(\App\Models\Cart::class);
}

public function blogs()
{
    return $this->hasMany(\App\Models\Blog::class, 'owner_id');
}

}
