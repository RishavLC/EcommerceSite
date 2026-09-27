<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Services\Auth\AuthService;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(protected AuthService $authService) {}

    public function register(RegisterRequest $request)
    {
        $user = $this->authService->register($request->validated());

        return $this->success($user->load('roles'), 'Registration successful.', 201);
    }

    public function login(LoginRequest $request)
    {
        $user = $this->authService->login($request->validated());

        return $this->success($user->load('roles'), 'Login successful.');
    }

    public function logout()
    {
        $this->authService->logout();

        return $this->success(null, 'Logged out.');
    }

    public function me(Request $request)
    {
        return $this->success($request->user()->load('roles'));
    }
}
