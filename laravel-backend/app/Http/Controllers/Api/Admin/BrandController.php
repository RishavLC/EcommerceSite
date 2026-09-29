<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\BrandRequest;
use App\Models\Brand;
use App\Services\Admin\BrandService;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    public function __construct(protected BrandService $brandService) {}

    public function index(Request $request)
    {
        return $this->paginated($this->brandService->list($request->only('search', 'status', 'per_page')));
    }

    public function store(BrandRequest $request)
    {
        return $this->success($this->brandService->create($request->validated()), 'Brand created.', 201);
    }

    public function show(Brand $brand)
    {
        return $this->success($brand);
    }

    public function update(BrandRequest $request, Brand $brand)
    {
        return $this->success($this->brandService->update($brand, $request->validated()), 'Brand updated.');
    }

    public function destroy(Brand $brand)
    {
        $this->brandService->delete($brand);

        return $this->success(null, 'Brand deleted.');
    }

    public function toggleActive(Brand $brand)
    {
        return $this->success($this->brandService->toggleActive($brand), 'Status updated.');
    }
}
