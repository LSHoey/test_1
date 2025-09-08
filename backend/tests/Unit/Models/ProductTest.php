<?php

namespace Tests\Unit\Models;

use App\Models\Product;
use App\Models\Category;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    protected $category;

    protected function setUp(): void
    {
        parent::setUp();

        // Create a test category for products
        $this->category = Category::create([
            'name' => 'Test Category'
        ]);
    }

    /** @test */
    public function it_can_create_a_product()
    {
        $productData = [
            'name' => 'Test Product',
            'category_id' => $this->category->id,
            'description' => 'Test Description',
            'price' => 99.99,
            'stock' => 100,
            'enabled' => true
        ];

        $product = Product::create($productData);

        $this->assertInstanceOf(Product::class, $product);
        $this->assertEquals($productData['name'], $product->name);
        $this->assertEquals($productData['price'], $product->price);
        $this->assertEquals($productData['stock'], $product->stock);
    }

    /** @test */
    public function it_belongs_to_a_category()
    {
        $product = Product::create([
            'name' => 'Test Product',
            'category_id' => $this->category->id,
            'price' => 99.99,
            'stock' => 100
        ]);

        $this->assertInstanceOf(Category::class, $product->category);
        $this->assertEquals($this->category->id, $product->category->id);
    }

    /** @test */
    public function it_can_be_enabled_and_disabled()
    {
        $product = Product::create([
            'name' => 'Test Product',
            'category_id' => $this->category->id,
            'price' => 99.99,
            'stock' => 100,
            'enabled' => true
        ]);

        $this->assertTrue($product->enabled);

        $product->enabled = false;
        $product->save();

        $this->assertFalse($product->fresh()->enabled);
    }

    /** @test */
    public function it_can_update_stock()
    {
        $product = Product::create([
            'name' => 'Test Product',
            'category_id' => $this->category->id,
            'price' => 99.99,
            'stock' => 100
        ]);

        $newStock = 50;
        $product->stock = $newStock;
        $product->save();

        $this->assertEquals($newStock, $product->fresh()->stock);
    }
}
