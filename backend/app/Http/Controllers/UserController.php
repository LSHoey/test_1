<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;

class UserController extends Controller
{
    // login
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');
        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized', 'message' => 'Invalid email or password'], 401);
        }
        return response()->json(['token' => $token], 200);
    }
    // register
    public function register(Request $request)
    {
        $data = $request->only('name', 'email', 'password');
        $data['password'] = Hash::make($data['password']);
        // check if user with email already exists
        if (User::where('email', $data['email'])->exists()) {
            return response()->json(['error' => 'User already exists', 'message' => 'User with this email already exists'], 400);
        }
        $user = User::create($data);
        $token = JWTAuth::fromUser($user);
        return response()->json(['token' => $token], 201);
    }
}
