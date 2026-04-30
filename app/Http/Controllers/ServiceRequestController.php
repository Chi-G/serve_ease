<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\ServiceRequest;
use App\Events\CallWaiterReceived;

class ServiceRequestController extends Controller
{
    public function index()
    {
        return inertia('Waiter/Dashboard', [
            'requests' => ServiceRequest::where('status', '!=', 'resolved')
                ->latest()
                ->get(),
            'readyOrders' => \App\Models\Order::where('status', 'ready')
                ->with(['items.product', 'table'])
                ->latest()
                ->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'table_id' => 'required',
            'customer_name' => 'nullable|string',
            'request_type' => 'required|string',
            'message' => 'nullable|string',
        ]);

        $serviceRequest = ServiceRequest::create([
            'table_id' => $validated['table_id'],
            'customer_name' => $validated['customer_name'] ?? 'Guest',
            'request_type' => $validated['request_type'],
            'message' => $validated['message'],
            'status' => 'pending',
        ]);

        broadcast(new CallWaiterReceived($serviceRequest))->toOthers();

        return back()->with('success', 'Waiter called successfully');
    }

    public function update(Request $request, ServiceRequest $serviceRequest)
    {
        $serviceRequest->update([
            'status' => $request->input('status', 'resolved')
        ]);

        broadcast(new \App\Events\CallWaiterReceived($serviceRequest))->toOthers();

        return back()->with('success', 'Request updated');
    }
}
