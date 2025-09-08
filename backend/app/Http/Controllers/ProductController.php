<?php

namespace App\Http\Controllers;

use App\Exports\ProductsExport;
use App\Http\Requests\ProductFormRequest;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Facades\Excel;

class ProductController extends Controller
{
    public function getProduct($name)
    {
        // Retrieve the selected product
        $selectedProduct = Product::where('name', $name)->first();
        if (!$selectedProduct) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        // Return the result
        return $selectedProduct;
    }

    public function getProductList(Request $request)
    {
        $category_id = $request->category_id ?? null;
        $enabled = $request->enabled;
        $page = $request->page ?? 1;
        $perPage = $request->per_page ?? 10;

        // Build query with filters
        $query = Product::query()->with('category')->when(isset($category_id), function ($q) use ($category_id) {
            $q->where('category_id', $category_id);
        })->when(isset($enabled), function ($q) use ($enabled) {
            $q->where('enabled', (boolval($enabled == 'true')));
        });

        // Get paginated results
        $products = $query->paginate($perPage, ['*'], 'page', $page);

        $products->getCollection()->transform(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'category_id' => $product->category_id,
                'category_name' => $product->category ? $product->category->name : null,
                'description' => $product->description,
                'price' => $product->price,
                'stock' => $product->stock,
                'enabled' => $product->enabled,
                'created_at' => $product->created_at,
                'updated_at' => $product->updated_at,
            ];
        });

        return response()->json($products);
    }

    public function insertProduct(ProductFormRequest $request)
    {
        // Check if user is authenticated
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // For now, just check if user is authenticated (we can add more specific permissions later)
        if (!Auth::user()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        // Create a new product instance
        $product = new Product();
        $product->name = $request->name;
        $product->category_id = $request->category_id ?? null;
        $product->description = $request->description ?? '';
        $product->price = $request->price ?? 0;
        $product->stock = $request->stock ?? 0;
        $product->enabled = $request->enabled ?? 1;

        // Save the product record
        $product->save();

        // Return a response
        return response()->json(['message' => 'Product created successfully', 'data' => $product], 201);
    }


    public function updateProduct(Request $request)
    {
        // Find the product by ID
        $product = Product::find($request->id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        // Update product fields
        $product->name = $request->name;
        $product->category_id = $request->category_id ?? $product->category_id;
        $product->description = $request->description ?? $product->description;
        $product->price = $request->price ?? $product->price;
        $product->stock = $request->stock ?? $product->stock;
        $product->enabled = $request->enabled ?? $product->enabled;

        // Save changes
        $product->save();

        // Return response
        return response()->json(['message' => 'Product updated successfully', 'data' => $product], 200);
    }

    // export productlist to excel
    public function exportProductList(Request $request)
    {
        $ids = null;
        if ($request->has('ids')) {
            // Handle both string and array input
            if (is_string($request->ids)) {
                $ids = array_filter(explode(',', $request->ids), 'strlen');
            } else {
                $ids = array_filter((array)$request->ids, 'strlen');
            }
            // Convert all IDs to integers
            $ids = array_map('intval', $ids);
        }

        return Excel::download(new ProductsExport($ids), 'products.xlsx');
    }


    public function deleteProduct(Request $request)
    {
        $product_ids = $request->ids;

        // Delete the products
        $deleted = Product::when(is_array($product_ids), function ($query) use ($product_ids) {
            return $query->whereIn('id', $product_ids);
        }, function ($query) use ($product_ids) {
            return $query->where('id', $product_ids);
        })->delete();

        if ($deleted > 0) {
            return response()->json(['message' => 'Product deleted']);
        }

        return response()->json(['message' => 'Unable to delete, product not found', 'error' => true], 404);
    }
}
