// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductList from "./pages/ProductList";
import HomePage from "./pages/RegisterProduct";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductList />} />
      </Routes>
    </Router>
  );
};

export default App;
