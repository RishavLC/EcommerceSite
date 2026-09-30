<?php

namespace App\Http\Requests\Seller;

use Illuminate\Foundation\Http\FormRequest;

class AdjustStockRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'delta' => ['required', 'integer', 'not_in:0'],
            'note' => ['required', 'string', 'max:255'],
            'variant_id' => ['nullable', 'exists:product_variants,id'],
        ];
    }
}
