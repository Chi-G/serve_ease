<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\Table;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SuperAdminController extends Controller
{
    public function index()
    {
        // 1. Financials & Overview
        $revenueToday = Order::whereDate('created_at', today())->sum('total_price');
        $revenueMonth = Order::whereMonth('created_at', now()->month)->sum('total_price');
        $activeOrders = Order::whereIn('status', ['pending', 'preparing', 'ready'])->count();
        $totalOrdersToday = Order::whereDate('created_at', today())->count();

        // 2. Staffing
        $users = User::all();

        // 3. Menu Engineering
        $products = Product::all();
        $categories = Product::distinct()->pluck('category')->filter()->values();

        // 4. Table Configuration
        $tables = Table::all();

        return Inertia::render('Admin/SuperDashboard', [
            'stats' => [
                'revenue_today' => (float)$revenueToday,
                'revenue_month' => (float)$revenueMonth,
                'active_orders' => $activeOrders,
                'total_orders_today' => $totalOrdersToday,
                'staff_count' => $users->count(),
                'table_count' => $tables->count(),
            ],
            'users' => $users,
            'products' => $products,
            'categories' => $categories,
            'tables' => $tables,
        ]);
    }

    public function storeUser(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:admin,manager,waiter,kitchen,chef',
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        return back()->with('success', 'Staff member added successfully.');
    }

    public function deleteUser(User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot delete yourself.');
        }
        
        $user->delete();
        return back()->with('success', 'Staff member removed.');
    }

    public function storeTable(Request $request)
    {
        $validated = $request->validate([
            'table_num' => 'required|string|unique:tables',
        ]);

        Table::create([
            'table_num' => $validated['table_num'],
            'uuid' => (string) Str::uuid(),
            'status' => 'available',
        ]);

        return back()->with('success', 'Table added successfully.');
    }

    public function deleteTable(Table $table)
    {
        $table->delete();
        return back()->with('success', 'Table removed.');
    }

    public function updateProduct(Product $product, Request $request)
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'price' => 'numeric|min:0',
            'category' => 'string|max:255',
            'stock_status' => 'string|in:instock,oos',
        ]);

        $product->update($validated);

        return back()->with('success', 'Product updated.');
    }
}
