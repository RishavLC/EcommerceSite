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
         <div class="modal fade" id="myModal">

            <div class="modal-dialog">

                <div class="modal-content">

                    <div class="modal-header">
                        <h5 class="modal-title">My Modal</h5>
                        <button class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    
                    <div class="modal-body">
                        hii
                    </div>
                </div>
            </div>
        </div>
            

    </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
