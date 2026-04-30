<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/service-requests', [\App\Http\Controllers\ServiceRequestController::class, 'store']);

Route::post('/products/{product}/toggle-showglass', [\App\Http\Controllers\ProductController::class, 'toggleShowGlass']);
Route::post('/products/{product}/toggle-stock', [\App\Http\Controllers\ProductController::class, 'toggleStock']);
Route::get('/products/recommendations', [\App\Http\Controllers\ProductController::class, 'recommendations']);



