<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

// Used for reject (reason required) and suspend (reason optional).
class SellerReasonRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $required = str_ends_with($this->path(), '/reject');

        return [
            'reason' => [$required ? 'required' : 'nullable', 'string', 'max:500'],
        ];
    }
}
