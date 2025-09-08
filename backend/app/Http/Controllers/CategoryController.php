<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function getCategoryList()
    {
        $categories = Category::all();
        return response()->json($categories);
    }

    // get category
    public function getCategory($id)
    {
        $category = Category::find($id);
        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }
        return response()->json($category);
    }

    // add category
    public function addCategory(Request $request)
    {
        $category = new Category();
        $category->name = $request->name;
        $category->save();

        return response()->json(['message' => 'Category created successfully', 'category' => $category], 201);
    }
}
