<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                'unique:products,name'
            ],
            'category_id' => [
                'required',
                'integer',
                'exists:categories,id'
            ],
            'description' => [
                'nullable',
                'string',
                'max:5000'
            ],
            'price' => [
                'required',
                'numeric',
                'min:0',
                'max:999999.99'
            ],
            'stock' => [
                'required',
                'integer',
                'min:0',
                'max:999999'
            ],
            'enabled' => [
                'sometimes',
                'boolean'
            ]
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'name' => 'product name',
            'category_id' => 'category',
            'description' => 'product description',
            'price' => 'product price',
            'stock' => 'stock quantity',
            'enabled' => 'product status'
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'The product name is required.',
            'name.unique' => 'A product with this name already exists.',
            'category_id.required' => 'Please select a category.',
            'category_id.exists' => 'The selected category does not exist.',
            'price.required' => 'The product price is required.',
            'price.min' => 'The product price must be at least $0.00.',
            'price.max' => 'The product price cannot exceed $999,999.99.',
            'stock.required' => 'The stock quantity is required.',
            'stock.min' => 'The stock quantity cannot be negative.',
            'stock.max' => 'The stock quantity cannot exceed 999,999.',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            // Additional custom validation logic can be added here
            if ($this->price && $this->price < 0.01) {
                $validator->errors()->add('price', 'Product price must be at least $0.01');
            }
        });
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        $productId = $this->route('product');
        
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('products', 'name')->ignore($productId)
            ],
            'category_id' => [
                'required',
                'integer',
                'exists:categories,id'
            ],
            'description' => [
                'nullable',
                'string',
                'max:5000'
            ],
            'price' => [
                'required',
                'numeric',
                'min:0',
                'max:999999.99'
            ],
            'stock' => [
                'required',
                'integer',
                'min:0',
                'max:999999'
            ],
            'enabled' => [
                'sometimes',
                'boolean'
            ]
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'name' => 'product name',
            'category_id' => 'category',
            'description' => 'product description',
            'price' => 'product price',
            'stock' => 'stock quantity',
            'enabled' => 'product status'
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'The product name is required.',
            'name.unique' => 'A product with this name already exists.',
            'category_id.required' => 'Please select a category.',
            'category_id.exists' => 'The selected category does not exist.',
            'price.required' => 'The product price is required.',
            'price.min' => 'The product price must be at least $0.00.',
            'price.max' => 'The product price cannot exceed $999,999.99.',
            'stock.required' => 'The stock quantity is required.',
            'stock.min' => 'The stock quantity cannot be negative.',
            'stock.max' => 'The stock quantity cannot exceed 999,999.',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            // Additional custom validation logic can be added here
            if ($this->price && $this->price < 0.01) {
                $validator->errors()->add('price',