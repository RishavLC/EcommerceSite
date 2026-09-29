<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RejectSellerRequest;
use App\Models\SellerProfile;
use App\Services\Admin\SellerService;
use Illuminate\Validation\ValidationException;

class SellerController extends Controller
{
    public function __construct(protected SellerService $sellerService) {}

    public function index(\Illuminate\Http\Request $request)
    {
        return $this->paginated($this->sellerService->list($request->only('status', 'search', 'per_page')));
    }

    public function show(SellerProfile $seller)
    {
        return $this->success($seller->load('user'));
    }

    public function approve(SellerProfile $seller)
    {
        try {
            return $this->success($this->sellerService->approve($seller), 'Seller approved.');
        } catch (ValidationException $e) {
            return $this->error(collect($e->errors())->flatten()->first(), 422, $e->errors());
        }
    }

    public function reject(RejectSellerRequest $request, SellerProfile $seller)
    {
        try {
            $result = $this->sellerService->reject($seller, $request->validated()['rejection_reason']);

            return $this->success($result, 'Seller application rejected.');
        } catch (ValidationException $e) {
            return $this->error(collect($e->errors())->flatten()->first(), 422, $e->errors());
        }
    }

    public function suspend(SellerProfile $seller)
    {
        try {
            return $this->success($this->sellerService->suspend($seller), 'Seller suspended.');
        } catch (ValidationException $e) {
            return $this->error(collect($e->errors())->flatten()->first(), 422, $e->errors());
        }
    }

    public function activate(SellerProfile $seller)
    {
        try {
            return $this->success($this->sellerService->activate($seller), 'Seller reactivated.');
        } catch (ValidationException $e) {
            return $this->error(collect($e->errors())->flatten()->first(), 422, $e->errors());
        }
    }
}
