<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ChangePasswordRequest;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class PasswordController extends Controller
{
    public function forgot(ForgotPasswordRequest $request)
    {
        $status = Password::sendResetLink($request->only('email'));

        return $status === Password::RESET_LINK_SENT
            ? $this->success(null, 'Password reset link sent.')
            : $this->error('Unable to send reset link.', 422);
    }

    public function reset(ResetPasswordRequest $request)
    {
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user) use ($request) {
                $user->forceFill(['password' => $request->password])->save();
            }
        );

        return $status === Password::PASSWORD_RESET
            ? $this->success(null, 'Password reset successfully.')
            : $this->error('Unable to reset password. The token may be invalid or expired.', 422);
    }

    public function change(ChangePasswordRequest $request)
    {
        $request->user()->forceFill(['password' => $request->password])->save();

        return $this->success(null, 'Password changed successfully.');
    }
}
