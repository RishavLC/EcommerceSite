<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\DashboardService;

class DashboardController extends Controller
{
    public function __construct(protected DashboardService $dashboardService) {}

    public function stats()
    {
        return $this->success($this->dashboardService->stats());
    }

    public function charts()
    {
        return $this->success($this->dashboardService->charts());
    }
}
