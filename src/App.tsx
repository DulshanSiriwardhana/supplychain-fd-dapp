// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterProduct from "./pages/RegisterProducts";
import ProductList from "./pages/ProductList";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegisterProduct />} />
        <Route path="/products" element={<ProductList />} />
      </Routes>
    </Router>
  );
};

export default App;
