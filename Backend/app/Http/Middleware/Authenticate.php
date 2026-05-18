<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AuthenticateMiddleware
{

protected function redirectTo($request)
{
    return null; // 🔥 STOP Laravel from redirecting
}

}