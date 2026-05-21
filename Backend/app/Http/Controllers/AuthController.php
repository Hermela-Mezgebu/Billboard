<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    // ✅ REGISTER
    public function register(Request $request)
    {
        $role = $request->input('role', 'client');

        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'role' => 'required',
        ]);

        // 🔥 AUTO GENERATE LICENSE FOR OWNER
        $licenseNumber = null;
        $licenseStatus = null;

        if ($role === 'owner') {
            $licenseNumber = 'LIC-' . strtoupper(Str::random(8));
            $licenseStatus = 'pending';
        }

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'role' => $role,
            'license_number' => $licenseNumber,
            'license_status' => $licenseStatus,
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

        $user = User::where('email', $request->email)->first();

        // ❌ INVALID LOGIN
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        // 🚫 BLOCK OWNER IF LICENSE NOT APPROVED
        if ($user->role === 'owner' && $user->license_status !== 'approved') {
            return response()->json([
                'message' => 'Your license is not approved yet. Please wait for admin approval.'
            ], 403);
        }

        // ✅ DELETE OLD TOKENS
        $user->tokens()->delete();

        // ✅ CREATE NEW TOKEN
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => $user
        ], 200);
    }

    // ✅ LOGOUT
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }
}