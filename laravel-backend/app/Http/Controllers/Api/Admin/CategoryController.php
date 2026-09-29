<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CategoryRequest;
use App\Models\Category;
use App\Services\Admin\CategoryService;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function __construct(protected CategoryService $categoryService) {}

    public function index(Request $request)
    {
        return $this->paginated($this->categoryService->list($request->only('search', 'status', 'per_page')));
    }

    public function store(CategoryRequest $request)
    {
        return $this->success($this->categoryService->create($request->validated()), 'Category created.', 201);
    }

    public function show(Category $category)
    {
        return $this->success($category->load('subcategories'));
    }

    public function update(CategoryRequest $request, Category $category)
    {
        return $this->success($this->categoryService->update($category, $request->validated()), 'Category updated.');
    }

    public function destroy(Category $category)
    {
        $this->categoryService->delete($category);

        return $this->success(null, 'Category deleted.');
    }

    public function toggleActive(Category $category)
    {
        return $this->success($this->categoryService->toggleActive($category), 'Status updated.');
    }
}
