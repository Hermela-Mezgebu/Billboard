<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // ✅ REGISTER
  public function register(Request $request)
{
    $role = $request->input('role', 'client');

    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|min:6',
        'role' => 'nullable|string|in:client,owner',
        'license_number' => 'nullable|string|max:255', // ✅ FIXED
    ]);

    // ✅ EXTRA SAFETY CHECK
    if ($role === 'owner' && !$request->license_number) {
        return response()->json([
            'message' => 'License number is required for owners'
        ], 422);
    }

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'role' => in_array($role, ['client', 'owner']) ? $role : 'client',
        'license_number' => $role === 'owner' ? $request->license_number : null,
    ]);

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'message' => 'User registered successfully',
        'token' => $token,
        'user' => $user
    ], 201);
}

    // ✅ LOGIN
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // ✅ FIND USER
        $user = User::where('email', $request->email)->first();

        // ❌ INVALID LOGIN
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        // ✅ DELETE OLD TOKENS (clean sessions)
        $user->tokens()->delete();

        // ✅ CREATE NEW TOKEN
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => $user
        ], 200);
    }

    // ✅ LOGOUT (VERY IMPORTANT)
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }
}