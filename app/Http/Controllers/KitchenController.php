<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KitchenController extends Controller
{
    public function index()
    {
        return Inertia::render('KDS/Index', [
            'orders' => Order::with(['items.product', 'table', 'customer'])
                ->whereNotIn('status', ['completed', 'cancelled'])
                ->orderBy('created_at', 'asc')
                ->get(),
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,in-kitchen,ready,served,completed,cancelled',
        ]);

        $order->update([
            'status' => $validated['status'],
        ]);

        // Broadcast the update for real-time customer feedback
        event(new \App\Events\OrderStatusUpdated($order));

        return redirect()->back()->with('success', "Order #{$order->queue_number} updated to {$validated['status']}");
    }
}
