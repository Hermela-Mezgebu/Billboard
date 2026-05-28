<?php

use Illuminate\Support\Facades\Password;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class PasswordController extends Controller
{
    // ✅ SEND EMAIL
    public function forgot(Request $request)
    {
        $status = Password::sendResetLink(
            $request->only('email')
        );

        return response()->json(['status' => $status]);
    }

    // ✅ RESET PASSWORD
    public function reset(Request $request)
    {
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user) use ($request) {
                $user->password = Hash::make($request->password);
                $user->save();
            }
        );

        return response()->json(['status' => $status]);
    }
}