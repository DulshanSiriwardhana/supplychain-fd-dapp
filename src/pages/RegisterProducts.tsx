// src/pages/RegisterProduct.tsx
import React, { useState } from "react";
import { getSupplyChainContract } from "../contracts/utils/contract";

const RegisterProduct: React.FC = () => {
  const [serialHash, setSerialHash] = useState("");
  const [metadataURI, setMetadataURI] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const contract = await getSupplyChainContract();
      const tx = await contract.registerProduct(serialHash, metadataURI);
      const receipt = await tx.wait();
      setTxHash(receipt?.hash);
      setSerialHash("");
      setMetadataURI("");
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Register Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Serial Hash</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={serialHash}
            onChange={(e) => setSerialHash(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Metadata URI (e.g., IPFS)</label>
          <input
            type="url"
            className="w-full p-2 border rounded"
            value={metadataURI}
            onChange={(e) => setMetadataURI(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register Product"}
        </button>
      </form>
      {txHash && (
        <p className="mt-4 text-green-600">
          Product registered! Tx:{" "}
          <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer">
            {txHash}
          </a>
        </p>
      )}
    </div>
  );
};

export default RegisterProduct;
