<x-mail::message>
# Order Receipt

Thank you for dining with ServeEase! Your order has been successfully placed.

**Queue Number: {{ $order->queue_number }}**  
**Table: {{ $order->table->table_num ?? 'N/A' }}**

<x-mail::table>
| Item | Qty | Price | Subtotal |
| :--- | :---: | :---: | :---: |
@foreach($order->items as $item)
| {{ $item->product->name ?? 'Item' }} | {{ $item->quantity }} | ₦{{ number_format($item->price, 2) }} | ₦{{ number_format($item->price * $item->quantity, 2) }} |
@endforeach
| **Total** | | | **₦{{ number_format($order->total_price, 2) }}** |
</x-mail::table>

Your order is currently **{{ $order->status }}**. You can track your order status live on our website.

<x-mail::button :url="config('app.url')">
View Order Status
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
