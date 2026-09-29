<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SubcategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $creating = $this->isMethod('POST');
        $id = $this->route('subcategory')?->id;

        return [
            'category_id' => [$creating ? 'required' : 'sometimes', 'exists:categories,id'],
            'name' => [$creating ? 'required' : 'sometimes', 'string', 'max:255'],
            'image' => ['sometimes', 'nullable', 'string', 'max:255'],
            'is_active' => ['sometimes', 'boolean'],
            'slug' => ['sometimes', 'string', 'max:255', Rule::unique('subcategories', 'slug')->ignore($id)],
        ];
    }
}
