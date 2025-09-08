<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Allow unauthenticated access to category list
Route::get('categories', [CategoryController::class, 'getCategoryList']);

// Auth routes
Route::post('login', [App\Http\Controllers\UserController::class, 'login']);
Route::post('register', [App\Http\Controllers\UserController::class, 'register']);

Route::middleware('auth:api')->group(function () {
    // Product routes
    Route::get('products', [ProductController::class, 'getProductList']);
    Route::get('products/{name}', [ProductController::class, 'getProduct']);
    Route::post('products', [ProductController::class, 'insertProduct']);
    Route::put('products/{id}', [ProductController::class, 'updateProduct']);
    Route::delete('products', [ProductController::class, 'deleteProduct']);
    Route::get('products-export', [ProductController::class, 'exportProductList']);
    // Category routes
    Route::get('categories/{id}', [CategoryController::class, 'getCategory']);
    Route::post('categories', [CategoryController::class, 'addCategory']);
});
