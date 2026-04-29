<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ecommerce</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .card:hover{
            transform: scale(1.05);
            box-shadow: 0px 10px 20px rgba(0,0,0,0.12), 0px 4px 8px rgba(0,0,0,0.8);
        }
    </style>
</head>
<body>
    <div class="main-container">
        <nav class="navbar bg-secondary navbar-expand-lg navbar-dark">
            <div class="container">
                <div class="navbar-brand text-danger">Ecommerce</div>
                <button class="navbar-toggler "type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item">
                            <a href="" class="nav-link"> Home </a>
                        </li>
                        <li class="nav-item">
                            <a href="" class="nav-link">About Us</a>
                        </li>
                        <li class="nav-item">
                            <a href="" class="nav-link">Contact Us</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
<div class="container-fluid mt-1">

  <div id="carouselExample" class="carousel slide" data-bs-ride="carousel">

    <!-- Indicators -->
    <div class="carousel-indicators">
      <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="0" class="active"></button>
      <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="1"></button>
      <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="2"></button>
    </div>

    <!-- Slides -->
    <div class="carousel-inner">

      <div class="carousel-item active">
        <img src="https://picsum.photos/1200/400?random=1" class="d-block w-100" alt="slide1">
      </div>

      <div class="carousel-item">
        <img src="https://picsum.photos/1200/400?random=2" class="d-block w-100" alt="slide2">
      </div>

      <div class="carousel-item">
        <img src="https://picsum.photos/1200/400?random=3" class="d-block w-100" alt="slide3">
      </div>

    </div>

    <!-- Controls -->
    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
      <span class="carousel-control-prev-icon"></span>
    </button>

    <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
      <span class="carousel-control-next-icon"></span>
    </button>

  </div>

</div>

    <div class="container-fluid mt-1">
        <div class="row">
            <div class="col-4 mt-3">
                <div class="card" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#myModal">
                    <div class="card-body">
                        <div class="card-title">Item1</div>
                        <div class="card-text"> 
                            <img src="https://picsum.photos/1200/400?random=14" class="d-block w-100">
                        </div>
                        <div class="card-text"> description</div>
                        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#myModal">Details</button>
                    </div>
                </div>
            </div>
            <div class="col-4 mt-3">
                <div class="card">
                    <div class="card-body">
                        <div class="card-title">Item2</div>
                        <div class="card-text"> 
                            <img src="https://picsum.photos/1200/400?random=12" class="d-block w-100">
                        </div>
                        <div class="card-text"> description</div>
                        <button class="btn btn-primary" >Add to Cart</button>
                    </div>
                </div>
            </div>
            <div class="col-4 mt-3">
                <div class="card">
                    <div class="card-body">
                        <div class="card-title">Item3</div>
                        <div class="card-text"> 
                            <img src="https://picsum.photos/1200/400?random=11" class="d-block w-100">
                        </div>
                        <div class="card-text"> description</div>
                        <button class="btn btn-primary" >Add to Cart</button>
                    </div>
                </div>
            </div>
            <div class="col-4 mt-3">
                <div class="card">
                    <div class="card-body">
                        <div class="card-title">Item4</div>
                        <div class="card-text"> 
                            <img src="https://picsum.photos/1200/400?random=17" class="d-block w-100">
                        </div>
                        <div class="card-text"> description</div>
                        <button class="btn btn-primary" >Add to Cart</button>
                    </div>
                </div>
            </div>
            <div class="col-4 mt-3">
                <div class="card">
                    <div class="card-body">
                        <div class="card-title">Item5</div>
                        <div class="card-text"> 
                            <img src="https://picsum.photos/1200/400?random=19" class="d-block w-100">
                        </div>
                        <div class="card-text"> description</div>
                        <button class="btn btn-primary" >Add to Cart</button>
                    </div>
                </div>
            </div>
            <div class="col-4 mt-3">
                <div class="card">
                    <div class="card-body">
                        <div class="card-title">Item6</div>
                        <div class="card-text"> 
                            <img src="https://picsum.photos/1200/400?random=14" class="d-block w-100">
                        </div>
                        <div class="card-text"> description</div>
                        <button class="btn btn-primary" >Add to Cart</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- modal -->
         <d<!-- Modal -->
<div class="modal fade" id="myModal" tabindex="-1">
  <div class="modal-dialog modal-lg modal-dialog-centered">
    <div class="modal-content">

      <!-- Header -->
      <div class="modal-header">
        <h5 class="modal-title">Premium Sneakers</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>

      <!-- Body -->
      <div class="modal-body bg-light">

        <div class="row">

          <!-- Left: Image -->
          <div class="col-md-6 text-center">
            <img src="https://picsum.photos/500/400?random=14" 
                 class="img-fluid rounded shadow-sm">
          </div>

          <!-- Right: Details -->
          <div class="col-md-6">

            <h4 class="text-dark">$100</h4>
            <p class="text-success fw-bold">In Stock ✔</p>

            <!-- Rating -->
            <p class="text-warning">
              ⭐⭐⭐⭐☆ (4.0)
            </p>

            <!-- Description -->
            <p class="text-muted">
              Comfortable and stylish sneakers perfect for daily wear.
              Lightweight design with premium material.
            </p>

            <!-- Size -->
            <label class="fw-bold">Select Size:</label>
            <select class="form-select mb-3">
              <option>7</option>
              <option>8</option>
              <option>9</option>
              <option>10</option>
            </select>

            <!-- Quantity -->
            <label class="fw-bold">Quantity:</label>
            <input type="number" class="form-control mb-3" value="1" min="1">

            <!-- Buttons -->
            <div class="d-flex gap-2">
              <button class="btn btn-warning w-50">Add to Cart</button>
              <button class="btn btn-dark w-50">Buy Now</button>
            </div>

          </div>

        </div>

      </div>

      <!-- Footer -->
      <div class="modal-footer">
        <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>

    </div>
  </div>
</div>
    </div>
    </div>
    <footer class="bg-secondary text-light pt-4 pb-2 mt-5">
  <div class="container">
    <div class="row">

      <!-- About -->
      <div class="col-md-4 mb-3">
        <h5 class="text-uppercase">ecommerce</h5>
        <p>
          buying and selling of goods online
        </p>
      </div>

      <!-- Links -->
      <div class="col-md-4 mb-3">
        <h5 class="text-uppercase">Quick Links</h5>
        <ul class="list-unstyled">
          <li><a href="#" class="text-light text-decoration-none">Home</a></li>
          <li><a href="#" class="text-light text-decoration-none">Dashboard</a></li>
          <li><a href="#" class="text-light text-decoration-none">About</a></li>
          <li><a href="#" class="text-light text-decoration-none">Contact</a></li>
        </ul>
      </div>

      <!-- Contact -->
      <div class="col-md-4 mb-3">
        <h5 class="text-uppercase">Contact</h5>
        <p>Email: support@ecommerce.com</p>
        <p>Phone: +977-9800000000</p>
      </div>

    </div>

    <hr class="bg-light">

    <div class="text-center">
      <p class="mb-0">&copy; 2026 e-commerce. All rights reserved.</p>
    </div>
  </div>
</footer>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
