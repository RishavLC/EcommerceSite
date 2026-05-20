import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from './pages/Home';
import Products from "./pages/Products";
import Login from "./pages/Login";
import Register from "./pages/Register";
import './App.css'

function App() {

  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>

      </Routes>
    </BrowserRouter>

  )
}

export default App
