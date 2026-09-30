<?php

namespace App\Http\Requests\Seller;

use Illuminate\Validation\Rule;

class UpdateProductRequest extends StoreProductRequest
{
    public function rules(): array
    {
        $productId = $this->route('product')->id;

        $rules = parent::rules();
        $rules['name'] = ['sometimes', 'string', 'max:255'];
        $rules['category_id'] = ['sometimes', 'exists:categories,id'];
        $rules['price'] = ['sometimes', 'numeric', 'min:0'];
        $rules['stock'] = ['sometimes', 'integer', 'min:0'];
        $rules['sku'] = ['nullable', 'string', 'max:100', Rule::unique('products', 'sku')->ignore($productId)];

        return $rules;
    }
}
