<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Product;
use App\Models\Order;
use App\Events\ProductVisibilityChanged;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('category')->get();
        $showglassCount = Product::where('is_in_showglass', true)->count();
        $oosCount = Product::where('stock_status', 'oos')->count();
        $totalCount = Product::count();
        
        // Command Center Stats
        $revenueToday = Order::whereDate('created_at', today())->sum('total_price');
        $activeOrders = Order::whereIn('status', ['pending', 'preparing', 'ready'])->count();

        return \Inertia\Inertia::render('Manager/Inventory', [
            'products' => $products,
            'stats' => [
                'showglass' => $showglassCount,
                'oos' => $oosCount,
                'total' => $totalCount,
                'revenue_today' => (float)$revenueToday,
                'active_orders' => $activeOrders
            ]
        ]);
    }

    public function toggleShowGlass(Product $product)
    {
        $product->update([
            'is_in_showglass' => !$product->is_in_showglass
        ]);

        broadcast(new ProductVisibilityChanged($product))->toOthers();

        return response()->json([
            'message' => 'Product visibility updated',
            'product' => $product
        ]);
    }

    public function toggleStock(Product $product)
    {
        $newStatus = $product->stock_status === 'instock' ? 'oos' : 'instock';
        
        $product->update([
            'stock_status' => $newStatus
        ]);

        broadcast(new ProductVisibilityChanged($product))->toOthers();

        return response()->json([
            'message' => 'Product stock status updated',
            'product' => $product
        ]);
    }

    public function recommendations(Request $request)
    {
        $productIds = $request->input('product_ids', []);
        
        // Basic AI Nudge logic: return 3 popular/alternative items
        $recommendations = Product::whereNotIn('id', $productIds)
            ->where('is_in_showglass', true)
            ->where('stock_status', 'instock')
            ->inRandomOrder()
            ->limit(3)
            ->get();
            
        return response()->json([
            'recommendations' => $recommendations
        ]);
    }
}
