<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ProductControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $category;
    protected $product;

    protected function setUp(): void
    {
        parent::setUp();

        // Create a test user
        $this->user = User::factory()->create();

        // Create a test category
        $this->category = Category::create([
            'name' => 'Test Category'
        ]);

        // Create a test product
        $this->product = Product::create([
            'name' => 'Test Product',
            'category_id' => $this->category->id,
            'description' => 'Test Description',
            'price' => 99.99,
            'stock' => 100,
            'enabled' => true
        ]);
    }

    /** @test */
    public function guest_cannot_access_product_endpoints()
    {
        $response = $this->getJson('/api/products');
        $response->assertStatus(401);

        $response = $this->postJson('/api/products', []);
        $response->assertStatus(401);

        $response = $this->deleteJson('/api/products', ['ids' => 1]);
        $response->assertStatus(401);
    }

    /** @test */
    public function authenticated_user_can_get_product_list()
    {
        $response = $this->actingAs($this->user, 'api')
            ->getJson('/api/products');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'category_id',
                        'category_name',
                        'description',
                        'price',
                        'stock',
                        'enabled'
                    ]
                ],
                'current_page',
                'total'
            ]);
    }

    /** @test */
    public function authenticated_user_can_create_product()
    {
        $productData = [
            'name' => 'New Product',
            'category_id' => $this->category->id,
            'description' => 'New Description',
            'price' => 149.99,
            'stock' => 50,
            'enabled' => true
        ];

        $response = $this->actingAs($this->user, 'api')
            ->postJson('/api/products', $productData);

        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Product created successfully'
            ]);

        $this->assertDatabaseHas('products', [
            'name' => 'New Product',
            'price' => 149.99
        ]);
    }

    /** @test */
    public function it_validates_required_fields_when_creating_product()
    {
        $response = $this->actingAs($this->user, 'api')
            ->postJson('/api/products', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'price']);
    }

    /** @test */
    public function authenticated_user_can_delete_product()
    {
        $response = $this->actingAs($this->user, 'api')
            ->deleteJson('/api/products', [
                'ids' => [$this->product->id]
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Product deleted'
            ]);

        $this->assertSoftDeleted('products', [
            'id' => $this->product->id
        ]);
    }

    /** @test */
    public function it_can_filter_products_by_category()
    {
        $response = $this->actingAs($this->user, 'api')
            ->getJson("/api/products?category_id={$this->category->id}");

        $response->assertStatus(200)
            ->assertJsonFragment([
                'category_id' => $this->category->id
            ]);
    }

    /** @test */
    public function it_can_filter_products_by_enabled_status()
    {
        $response = $this->actingAs($this->user, 'api')
            ->getJson('/api/products?enabled=true');

        $response->assertStatus(200)
            ->assertJsonFragment([
                'enabled' => true
            ]);
    }
}
