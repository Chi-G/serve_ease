<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Table;
use App\Models\Product;
use App\Models\Customer;
use App\Mail\OrderReceipt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Session;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'table_id' => 'required',
            'email' => 'required|email',
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.customer_name' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric',
            'items.*.serving_style' => 'required|string',
            'items.*.notes' => 'nullable|string',
            'total_price' => 'required|numeric',
            'method' => 'required|string',
            'queue_number' => 'required|string',
        ]);

        try {
            return $this->createFromValidatedData($validated);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function createFromValidatedData(array $data)
    {
        return DB::transaction(function () use ($data) {
            // Find table by table_num
            $table = Table::where('table_num', (string)$data['table_id'])->first();

            // Find or create customer based on email
            $customer = null;
            if (isset($data['email'])) {
                $customer = Customer::updateOrCreate(
                    ['email' => $data['email']],
                    ['name' => $data['items'][0]['customer_name'] ?? 'Guest']
                );
            }

            $order = Order::create([
                'session_id' => Str::random(40),
                'customer_id' => $customer ? $customer->id : null,
                'table_id' => $table ? $table->id : null,
                'total_price' => $data['total_price'],
                'customer_email' => $data['email'] ?? null,
                'status' => $data['method'] === 'card' ? 'in-kitchen' : 'pending',
                'queue_number' => $data['queue_number'],
            ]);

            foreach ($data['items'] as $item) {
                // Lock the product row to prevent race conditions during checkout
                $product = Product::where('id', $item['product_id'])->lockForUpdate()->first();

                if (!$product) {
                    throw new \Exception("One of your selected products is no longer available.");
                }

                if ($product->stock_count < $item['quantity']) {
                    throw new \Exception("Sorry, only {$product->stock_count} units of {$product->name} are left.");
                }

                // Atomic stock deduction
                $product->decrement('stock_count', $item['quantity']);

                // Auto-update status if empty
                if ($product->stock_count <= 0) {
                    $product->update(['stock_status' => 'outofstock']);
                }

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'customer_name' => $item['customer_name'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'serving_style' => $item['serving_style'],
                    'notes' => $item['notes'] ?? null,
                ]);
            }

            // Send email to the restaurant AND the guest
            try {
                $mail = Mail::to(config('mail.from.address'));
                
                if ($order->customer_email) {
                    $mail->cc($order->customer_email);
                }

                $mail->send(new OrderReceipt($order->load(['items.product', 'table'])));
            } catch (\Exception $e) {
                \Log::error('Failed to send order receipt email: ' . $e->getMessage());
            }

            if (request()->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'order' => $order->load(['items.product', 'table']),
                ]);
            }

            // For redirect flows, we might want to store the order in session for the tracking page
            Session::put('currentOrder', $order->load(['items.product', 'table']));
            return redirect()->route('tracking.index')->with('success', 'Order placed successfully!');
        });
    }

    public function cancel(Order $order)
    {
        // Clear from session immediately to ensure UI is clean
        session()->forget('currentOrder');

        // Only allow status update if order is in a cancellable state
        if (in_array($order->status, ['pending', 'paid', 'in-kitchen', 'cancelled'])) {
            if ($order->status !== 'cancelled') {
                $order->update(['status' => 'cancelled']);
                // Broadcast the update so kitchen is notified
                event(new \App\Events\OrderStatusUpdated($order));
            }

            return redirect()->route('menu.index')->with('success', 'Order cleared and cancelled.');
        }

        return redirect()->route('menu.index')->with('error', 'This order is already being prepared and cannot be cancelled, but we have cleared it from your screen.');
    }
}
