<?php

namespace App\Http\Requests\Seller;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'exists:categories,id'],
            'subcategory_id' => ['nullable', 'exists:subcategories,id'],
            'brand_id' => ['nullable', 'exists:brands,id'],
            'description' => ['nullable', 'string'],
            'sku' => ['nullable', 'string', 'max:100', 'unique:products,sku'],
            'price' => ['required', 'numeric', 'min:0'],
            'discount_price' => ['nullable', 'numeric', 'min:0', 'lt:price'],
            'stock' => ['required', 'integer', 'min:0'],
            'weight' => ['nullable', 'numeric', 'min:0'],
            'dimensions' => ['nullable', 'string', 'max:100'],

            'images' => ['sometimes', 'array', 'max:8'],
            'images.*' => ['image', 'max:2048'],

            'variants' => ['sometimes', 'array'],
            'variants.*.sku' => ['required', 'string', 'max:100', 'distinct'],
            'variants.*.attributes' => ['required', 'array', 'min:1'],
            'variants.*.price' => ['nullable', 'numeric', 'min:0'],
            'variants.*.stock' => ['required', 'integer', 'min:0'],

            'attributes' => ['sometimes', 'array'],
            'attributes.*.name' => ['required', 'string', 'max:100'],
            'attributes.*.value' => ['required', 'string', 'max:255'],
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $subcategoryId = $this->input('subcategory_id');
            $categoryId = $this->input('category_id');

            if ($subcategoryId && $categoryId) {
                $belongs = \App\Models\Subcategory::where('id', $subcategoryId)
                    ->where('category_id', $categoryId)->exists();

                if (! $belongs) {
                    $validator->errors()->add('subcategory_id', 'The subcategory does not belong to the selected category.');
                }
            }
        });
    }
}
