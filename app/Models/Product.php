<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'image_url',
        'price',
        'description',
        'category',
        'is_in_showglass',
        'stock_status',
        'stock_count',
        'tags',
    ];

    protected function casts(): array
    {
        return [
            'is_in_showglass' => 'boolean',
            'tags' => 'array',
            'price' => 'decimal:2',
        ];
    }
}
