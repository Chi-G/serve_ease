<?php

namespace App\Http\Controllers;

use App\Models\PendingOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Session;

class PaymentController extends Controller
{
    public function initialize(Request $request)
    {
        $validated = $request->validate([
            'table_id' => 'required',
            'email' => 'required|email',
            'items' => 'required|array',
            'total_price' => 'required|numeric',
            'method' => 'required|string',
            'queue_number' => 'required|string',
        ]);

        $response = Http::withToken(config('services.paystack.secret_key'))
            ->post('https://api.paystack.co/transaction/initialize', [
                'email' => $validated['email'],
                'amount' => $validated['total_price'] * 100,
                'callback_url' => route('payment.callback'),
                'metadata' => [
                    'queue_number' => $validated['queue_number'],
                ],
            ]);

        if ($response->successful()) {
            $data = $response->json()['data'];
            
            // Store order data in DATABASE linked to reference for absolute persistence
            PendingOrder::create([
                'reference' => $data['reference'],
                'order_data' => $validated,
                'expires_at' => now()->addHours(2), // Optional: auto-cleanup later
            ]);

            return response()->json([
                'authorization_url' => $data['authorization_url']
            ]);
        }

        return response()->json(['error' => 'Payment initialization failed'], 400);
    }

    public function callback(Request $request)
    {
        $reference = $request->get('reference');

        if (!$reference) {
            return redirect()->route('checkout.index')->with('error', 'Payment reference missing');
        }

        $response = Http::withToken(config('services.paystack.secret_key'))
            ->get("https://api.paystack.co/transaction/verify/{$reference}");

        if ($response->successful() && $response->json()['data']['status'] === 'success') {
            // Retrieve from database, not session
            $pending = PendingOrder::where('reference', $reference)->first();

            if (!$pending) {
                return redirect()->route('menu.index')->with('error', 'Order details not found. Please contact support with reference: ' . $reference);
            }

            try {
                $response = app(OrderController::class)->createFromValidatedData($pending->order_data);
                
                // Cleanup the pending order record
                $pending->delete();
                
                return $response;
            } catch (\Exception $e) {
                return redirect()->route('menu.index')->with('error', $e->getMessage());
            }
        }

        return redirect()->route('checkout.index')->with('error', 'Payment verification failed');
    }
}
