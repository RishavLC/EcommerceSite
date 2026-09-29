<?php

namespace App\Http\Controllers\Api\Seller;

use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\UpdateStoreProfileRequest;
use Illuminate\Http\Request;

class StoreProfileController extends Controller
{
    public function show(Request $request)
    {
        return $this->success($request->user()->sellerProfile);
    }

    public function update(UpdateStoreProfileRequest $request)
    {
        $profile = $request->user()->sellerProfile;
        $profile->update($request->validated());

        return $this->success($profile->fresh(), 'Store profile updated.');
    }
}
