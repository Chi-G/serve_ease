<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Models\Product;
use App\Models\Order;

use App\Http\Controllers\Auth\AuthenticatedSessionController;

use App\Models\Table;

Route::get('/', function () {
    $table = Table::first();
    return redirect()->route('table.welcome', ['table' => $table->uuid]);
})->name('welcome');

Route::get('/table/{table:uuid}', function (Table $table) {
    return Inertia::render('Welcome', [
        'tableNumber' => (int)$table->table_num,
    ]);
})->name('table.welcome');

Route::post('/orders', [App\Http\Controllers\OrderController::class, 'store'])->name('orders.store');
Route::post('/orders/{order}/cancel', [App\Http\Controllers\OrderController::class, 'cancel'])->name('orders.cancel');
Route::post('/payment/initialize', [App\Http\Controllers\PaymentController::class, 'initialize'])->name('payment.initialize');
Route::get('/payment/callback', [App\Http\Controllers\PaymentController::class, 'callback'])->name('payment.callback');
Route::post('/service-requests', [App\Http\Controllers\ServiceRequestController::class, 'store'])->name('service-requests.store');

Route::middleware('guest')->group(function () {
    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
});

Route::get('/dashboard', [App\Http\Controllers\PosController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');
Route::post('/pos/orders', [App\Http\Controllers\PosController::class, 'store'])->middleware(['auth'])->name('pos.orders.store');

Route::get('/menu', function () {
    return Inertia::render('Customer/Menu', [
        'products' => Product::where('stock_status', 'instock')->get(),
        'categories' => Product::distinct()->pluck('category'),
    ]);
})->name('menu.index');

Route::get('/cart', function () {
    return Inertia::render('Customer/Cart');
})->name('cart.index');

Route::get('/checkout', function () {
    return Inertia::render('Customer/Checkout');
})->name('checkout.index');

Route::get('/tracking', function () {
    return Inertia::render('Customer/Tracking');
})->name('tracking.index');

Route::get('/kitchen', [App\Http\Controllers\KitchenController::class, 'index'])->middleware(['auth'])->name('kitchen.index');
Route::patch('/kitchen/orders/{order}', [App\Http\Controllers\KitchenController::class, 'updateStatus'])->middleware(['auth'])->name('kitchen.orders.update');

// Waiter / Service Captain Routes
Route::get('/waiter', [App\Http\Controllers\ServiceRequestController::class, 'index'])->middleware(['auth'])->name('waiter.dashboard');
Route::post('/waiter/requests/{serviceRequest}/resolve', [App\Http\Controllers\ServiceRequestController::class, 'update'])->middleware(['auth'])->name('waiter.requests.resolve');
Route::post('/waiter/orders/{order}/serve', [App\Http\Controllers\KitchenController::class, 'updateStatus'])->middleware(['auth'])->name('waiter.orders.serve');

Route::get('/inventory', [App\Http\Controllers\ProductController::class, 'index'])->middleware(['auth'])->name('manager.inventory');

// Super Admin Executive Suite Routes
Route::prefix('admin')->middleware(['auth'])->group(function () {
    Route::get('/', [App\Http\Controllers\SuperAdminController::class, 'index'])->name('admin.dashboard');
    Route::post('/users', [App\Http\Controllers\SuperAdminController::class, 'storeUser'])->name('admin.users.store');
    Route::delete('/users/{user}', [App\Http\Controllers\SuperAdminController::class, 'deleteUser'])->name('admin.users.destroy');
    Route::post('/tables', [App\Http\Controllers\SuperAdminController::class, 'storeTable'])->name('admin.tables.store');
    Route::delete('/tables/{table}', [App\Http\Controllers\SuperAdminController::class, 'deleteTable'])->name('admin.tables.destroy');
    Route::patch('/products/{product}', [App\Http\Controllers\SuperAdminController::class, 'updateProduct'])->name('admin.products.update');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
