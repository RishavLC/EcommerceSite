<?php

namespace App\Http\Requests\Seller;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStoreProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'business_name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'phone' => ['sometimes', 'string', 'max:30'],
            'description' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'address_line' => ['sometimes', 'string', 'max:255'],
            'city' => ['sometimes', 'string', 'max:100'],
            'province' => ['sometimes', 'string', 'max:100'],
            'postal_code' => ['sometimes', 'nullable', 'string', 'max:20'],
            'bank_account_name' => ['sometimes', 'string', 'max:255'],
            'bank_account_number' => ['sometimes', 'string', 'max:50'],
            'bank_name' => ['sometimes', 'string', 'max:255'],
        ];
    }
}
