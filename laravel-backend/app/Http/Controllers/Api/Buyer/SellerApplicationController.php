<?php

namespace App\Http\Controllers\Api\Buyer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Buyer\ApplySellerRequest;
use App\Services\Seller\SellerApplicationService;
use Illuminate\Http\Request;

class SellerApplicationController extends Controller
{
    public function __construct(protected SellerApplicationService $applicationService) {}

    public function store(ApplySellerRequest $request)
    {
        $profile = $this->applicationService->apply($request->user(), $request->validated());

        return $this->success($profile, 'Seller application submitted.', 201);
    }

    public function show(Request $request)
    {
        return $this->success($request->user()->sellerProfile);
    }
}
