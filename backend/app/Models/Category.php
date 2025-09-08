<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the products for the category.
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Get the active products for the category.
     */
    public function activeProducts(): HasMany
    {
        return $this->hasMany(Product::class)->where('enabled', true);
    }

    /**
     * Get the products count for the category.
     */
    public function getProductsCountAttribute(): int
    {
        return $this->products()->count();
    }

    /**
     * Get the active products count for the category.
     */
    public function getActiveProductsCountAttribute(): int
    {
        return $this->activeProducts()->count();
    }

    /**
     * Scope a query to order categories by name.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('name');
    }

    /**
     * Scope a query to search categories by name.
     */
    public function scopeSearch($query, $term)
    {
        return $query->where('name', 'like', "%{$term}%");
    }

    /**
     * Get categories with products count.
     */
    public function scopeWithProductsCount($query)
    {
        return $query->withCount('products');
    }

    /**
     * Get categories with active products count.
     */
    public function scopeWithActiveProductsCount($query)
    {
        return $query->withCount(['products as active_products_count' => function ($query) {
            $query->where('enabled', true);
        }]);
    }
}
