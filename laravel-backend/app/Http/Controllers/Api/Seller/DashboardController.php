<?php

namespace App\Http\Controllers\Api\Seller;

use App\Http\Controllers\Controller;
use App\Services\Seller\DashboardService;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(protected DashboardService $dashboardService) {}

    public function stats(Request $request)
    {
        return $this->success($this->dashboardService->stats($request->user()->id));
    }
}
