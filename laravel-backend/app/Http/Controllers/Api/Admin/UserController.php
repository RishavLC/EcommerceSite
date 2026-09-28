<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Models\Order;
use App\Models\User;
use App\Services\Admin\UserService;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct(protected UserService $userService) {}

    public function index(Request $request)
    {
        return $this->paginated(
            $this->userService->list($request->only('search', 'role', 'status', 'per_page'))
        );
    }

    public function store(StoreUserRequest $request)
    {
        return $this->success($this->userService->create($request->validated()), 'User created.', 201);
    }

    public function show(User $user)
    {
        $user->load('roles')->loadCount('orders');

        return $this->success($user);
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        $data = $request->validated();

        // An admin must not be able to lock themselves out or strip their own admin role.
        if ($user->id === $request->user()->id) {
            if (isset($data['status']) && $data['status'] !== 'active') {
                return $this->error('You cannot deactivate your own account.', 422);
            }
            if (isset($data['roles']) && ! in_array('admin', $data['roles'])) {
                return $this->error('You cannot remove your own admin role.', 422);
            }
        }

        return $this->success($this->userService->update($user, $data), 'User updated.');
    }

    public function activate(User $user)
    {
        return $this->success($this->userService->setStatus($user, 'active'), 'User activated.');
    }

    public function deactivate(Request $request, User $user)
    {
        if ($user->id === $request->user()->id) {
            return $this->error('You cannot deactivate your own account.', 422);
        }

        return $this->success($this->userService->setStatus($user, 'inactive'), 'User deactivated.');
    }

    public function orders(User $user)
    {
        return $this->paginated(
            Order::where('buyer_id', $user->id)->withCount('items')->latest()->paginate(10)
        );
    }
}
