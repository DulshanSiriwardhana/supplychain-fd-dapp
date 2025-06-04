import { useState } from "react";
import RegisterProductModal from "../components/RegisterProductsModal";

const HomePage = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-6">
      <button
        className="bg-green-600 text-white px-4 py-2 rounded"
        onClick={() => setIsOpen(true)}
      >
        + Register Product
      </button>

      <RegisterProductModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default HomePage;
