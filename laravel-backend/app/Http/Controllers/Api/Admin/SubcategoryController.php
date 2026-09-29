<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SubcategoryRequest;
use App\Models\Subcategory;
use App\Services\Admin\SubcategoryService;
use Illuminate\Http\Request;

class SubcategoryController extends Controller
{
    public function __construct(protected SubcategoryService $subcategoryService) {}

    public function index(Request $request)
    {
        return $this->paginated($this->subcategoryService->list($request->only('search', 'status', 'category_id', 'per_page')));
    }

    public function store(SubcategoryRequest $request)
    {
        return $this->success($this->subcategoryService->create($request->validated()), 'Subcategory created.', 201);
    }

    public function show(Subcategory $subcategory)
    {
        return $this->success($subcategory->load('category'));
    }

    public function update(SubcategoryRequest $request, Subcategory $subcategory)
    {
        return $this->success($this->subcategoryService->update($subcategory, $request->validated()), 'Subcategory updated.');
    }

    public function destroy(Subcategory $subcategory)
    {
        $this->subcategoryService->delete($subcategory);

        return $this->success(null, 'Subcategory deleted.');
    }

    public function toggleActive(Subcategory $subcategory)
    {
        return $this->success($this->subcategoryService->toggleActive($subcategory), 'Status updated.');
    }
}
