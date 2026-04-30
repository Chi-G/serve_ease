<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PendingOrder extends Model
{
    protected $fillable = ['reference', 'order_data', 'expires_at'];

    protected $casts = [
        'order_data' => 'array',
        'expires_at' => 'datetime',
    ];
}
