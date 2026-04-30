<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Table;
use App\Models\Product;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ServiceRequest;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class MockDataSeeder extends Seeder
{
    public function run(): void
    {
        // 0. Clear previous data
        ServiceRequest::truncate();
        OrderItem::truncate();
        Order::truncate();
        Customer::truncate();
        Product::truncate();
        Table::truncate();

        // 1. Users
        User::updateOrCreate(['email' => 'admin@serveease.com'], [
            'name' => 'Super Admin',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        User::updateOrCreate(['email' => 'waiter@serveease.com'], [
            'name' => 'John Waiter',
            'password' => bcrypt('password'),
            'role' => 'waiter',
        ]);

        User::updateOrCreate(['email' => 'chef@serveease.com'], [
            'name' => 'Sara Chef',
            'password' => bcrypt('password'),
            'role' => 'chef',
        ]);

        // 2. Tables (1-20)
        for ($i = 1; $i <= 20; $i++) {
            Table::create([
                'table_num' => (string)$i,
                'uuid' => (string) Str::uuid(),
                'status' => 'vacant',
            ]);
        }

        // 3. Products (20 Items)
        $products = [
            // Burgers
            [
                'name' => 'Classic Cheeseburger',
                'price' => 2500,
                'category' => 'Burger',
                'image_url' => 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
                'description' => 'Juicy beef patty with cheddar cheese, lettuce, and our secret sauce.',
                'tags' => ['popular', 'classic']
            ],
            [
                'name' => 'Spicy Zinger Burger',
                'price' => 2800,
                'category' => 'Burger',
                'image_url' => 'https://images.unsplash.com/photo-1521305916504-4a1121188589?w=800&q=80',
                'description' => 'Crispy chicken fillet with spicy mayo and fresh slaw.',
                'tags' => ['spicy', 'chicken']
            ],
            // Pizzas
            [
                'name' => 'Margherita Pizza',
                'price' => 3500,
                'category' => 'Pizza',
                'image_url' => 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&q=80',
                'description' => 'Fresh mozzarella, basil, and tomato sauce on a thin crust.',
                'tags' => ['vegetarian', 'popular']
            ],
            [
                'name' => 'Pepperoni Feast',
                'price' => 4500,
                'category' => 'Pizza',
                'image_url' => 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80',
                'description' => 'Loaded with premium pepperoni and extra mozzarella.',
                'tags' => ['meat', 'best-seller']
            ],
            // Main Courses
            [
                'name' => 'Grilled Salmon',
                'price' => 5500,
                'category' => 'Main Course',
                'image_url' => 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=800&q=80',
                'description' => 'Perfectly grilled salmon fillet served with lemon butter sauce.',
                'tags' => ['healthy', 'chef-special']
            ],
            [
                'name' => 'Ribeye Steak',
                'price' => 7500,
                'category' => 'Main Course',
                'image_url' => 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80',
                'description' => '300g premium ribeye steak with mashed potatoes and gravy.',
                'tags' => ['meat', 'premium']
            ],
            [
                'name' => 'Creamy Alfredo Pasta',
                'price' => 3200,
                'category' => 'Main Course',
                'image_url' => 'https://images.unsplash.com/photo-1645112481338-3564e9a11704?w=800&q=80',
                'description' => 'Fettuccine pasta in rich white cream sauce with mushrooms.',
                'tags' => ['vegetarian', 'pasta']
            ],
            [
                'name' => 'Jollof Rice Special',
                'price' => 2500,
                'category' => 'Main Course',
                'image_url' => 'https://images.unsplash.com/photo-1628294895950-9805252327bc?w=800&q=80',
                'description' => 'Authentic smoky jollof rice served with fried plantain.',
                'tags' => ['local', 'popular']
            ],
            // Salads
            [
                'name' => 'Caesar Salad',
                'price' => 2200,
                'category' => 'Salad',
                'image_url' => 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800&q=80',
                'description' => 'Crispy romaine lettuce, croutons, and parmesan with Caesar dressing.',
                'tags' => ['healthy', 'vegetarian']
            ],
            [
                'name' => 'Greek Salad',
                'price' => 2400,
                'category' => 'Salad',
                'image_url' => 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80',
                'description' => 'Fresh cucumbers, tomatoes, olives, and feta cheese.',
                'tags' => ['healthy', 'fresh']
            ],
            // Appetizers/Sides
            [
                'name' => 'Chicken Wings',
                'price' => 2200,
                'category' => 'Appetizers',
                'image_url' => 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800&q=80',
                'description' => 'Crispy wings with spicy buffalo sauce.',
                'tags' => ['spicy', 'appetizer']
            ],
            [
                'name' => 'Spring Rolls',
                'price' => 1200,
                'category' => 'Appetizers',
                'image_url' => 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
                'description' => 'Crispy vegetable spring rolls with sweet chili sauce.',
                'tags' => ['vegetarian', 'appetizer']
            ],
            [
                'name' => 'French Fries',
                'price' => 1000,
                'category' => 'Sides',
                'image_url' => 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80',
                'description' => 'Double-fried golden potato strips with sea salt.',
                'tags' => ['side', 'popular']
            ],
            // Desserts
            [
                'name' => 'Chocolate Brownie',
                'price' => 1800,
                'category' => 'Dessert',
                'image_url' => 'https://images.unsplash.com/photo-1461023058943-07fcaf1835e7?w=800&q=80',
                'description' => 'Fudgy brownie served warm with vanilla ice cream.',
                'tags' => ['sweet', 'dessert']
            ],
            [
                'name' => 'Cheesecake',
                'price' => 2000,
                'category' => 'Dessert',
                'image_url' => 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&q=80',
                'description' => 'Creamy New York style cheesecake with berry compote.',
                'tags' => ['sweet', 'classic']
            ],
            [
                'name' => 'Ice Cream Trio',
                'price' => 1200,
                'category' => 'Dessert',
                'image_url' => 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=800&q=80',
                'description' => 'Three scoops of premium vanilla, chocolate, and strawberry.',
                'tags' => ['sweet', 'kids']
            ],
            // Drinks
            [
                'name' => 'Iced Coffee',
                'price' => 1500,
                'category' => 'Drinks',
                'image_url' => 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800&q=80',
                'description' => 'Cold brew coffee with milk and vanilla syrup.',
                'tags' => ['caffeine', 'cold']
            ],
            [
                'name' => 'Fresh Orange Juice',
                'price' => 1200,
                'category' => 'Drinks',
                'image_url' => 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800&q=80',
                'description' => '100% freshly squeezed oranges.',
                'tags' => ['healthy', 'fresh']
            ],
            [
                'name' => 'Mocktail Breeze',
                'price' => 1800,
                'category' => 'Drinks',
                'image_url' => 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=80',
                'description' => 'Fruity non-alcoholic cocktail with pineapple and mint.',
                'tags' => ['refreshing', 'cold']
            ],
            [
                'name' => 'Red Wine Glass',
                'price' => 2500,
                'category' => 'Drinks',
                'image_url' => 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80',
                'description' => 'Premium Cabernet Sauvignon.',
                'tags' => ['alcohol', 'premium']
            ],
        ];

        foreach ($products as $p) {
            Product::create([
                'name' => $p['name'],
                'price' => $p['price'],
                'category' => $p['category'],
                'image_url' => $p['image_url'],
                'description' => $p['description'],
                'is_in_showglass' => true,
                'stock_status' => 'instock',
                'tags' => $p['tags'],
            ]);
        }
    }
}
