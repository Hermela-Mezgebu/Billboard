<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Broadcast; // ✅ IMPORTANT FIX

class BroadcastServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // ✅ Register broadcasting routes
        Broadcast::routes(['middleware' => ['auth:sanctum']]);

        // ✅ Load channels
        require base_path('routes/channels.php');
    }
}