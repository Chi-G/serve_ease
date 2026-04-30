<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Table;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Events\OrderStatusUpdated;

class PosController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard', [
            'products' => Product::where('stock_status', 'instock')->get(),
            'categories' => Product::distinct()->pluck('category'),
            'tables' => Table::all(),
            'waiters' => User::where('role', 'waiter')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'table_id' => 'required|exists:tables,id',
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'customer_name' => 'nullable|string',
            'order_type' => 'required|in:dine_in,take_away,delivery',
        ]);

        return DB::transaction(function () use ($validated) {
            $totalAmount = 0;
            foreach ($validated['items'] as $item) {
                $product = Product::find($item['id']);
                $totalAmount += $product->price * $item['quantity'];
            }

            $order = Order::create([
                'order_number' => 'POS-' . strtoupper(uniqid()),
                'queue_number' => 'P-' . rand(100, 999),
                'table_id' => $validated['table_id'],
                'customer_name' => $validated['customer_name'] ?? 'Guest',
                'status' => 'pending',
                'total_price' => $totalAmount,
                'payment_status' => 'paid', // POS orders are usually paid immediately
                'order_type' => $validated['order_type'],
            ]);

            foreach ($validated['items'] as $item) {
                $product = Product::find($item['id']);
                
                // Deduct stock
                $product->decrement('stock_count', $item['quantity']);
                if ($product->stock_count <= 0) {
                    $product->update(['stock_status' => 'outofstock']);
                }

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                    'customer_name' => $validated['customer_name'] ?? 'Guest',
                ]);
            }

            // Broadcast for KDS
            event(new OrderStatusUpdated($order->load(['items.product', 'table'])));

            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully',
                'order' => $order
            ]);
        });
    }
}
