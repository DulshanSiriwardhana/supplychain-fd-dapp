import React, { useState } from "react";
import { getSupplyChainContract } from "../contracts/utils/contract";
import SHA256 from "crypto-js/sha256";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const RegisterProductModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [serialHash, setSerialHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

const generateMetadataHash = (metadata: object): string => {
  const metadataString = JSON.stringify(metadata);
  return SHA256(metadataString).toString();
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      if (!name.trim() || !description.trim() || !serialHash.trim()) {
        throw new Error("All fields are required");
      }

      const metadata = {
        name: name.trim(),
        description: description.trim(),
        serialHash: serialHash.trim(),
        timestamp: Date.now(),
      };

      const metadataHash = generateMetadataHash(metadata);

      const contract = await getSupplyChainContract();
      const tx = await contract.registerProduct(serialHash.trim(), metadataHash);
      const receipt = await tx.wait();
      
      setTxHash(receipt.transactionHash);
      setSuccess(true);
      setName("");
      setDescription("");
      setSerialHash("");

      // Auto-close after 3 seconds
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setTxHash("");
      }, 3000);
    } catch (err) {
      console.error("Error registering product:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
          disabled={loading}
        >
          ×
        </button>
        
        <h2 className="text-xl font-semibold mb-4">Register Product</h2>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
            Product registered successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              id="name"
              type="text"
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              placeholder="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              placeholder="Product Description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div>
            <label htmlFor="serialHash" className="block text-sm font-medium text-gray-700 mb-1">
              Serial Hash
            </label>
            <input
              id="serialHash"
              type="text"
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              placeholder="Unique Serial Hash"
              value={serialHash}
              onChange={(e) => setSerialHash(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Register Product"
            )}
          </button>
        </form>

        {txHash && (
          <div className="mt-4 p-2 bg-blue-50 text-blue-700 rounded text-sm">
            Transaction submitted! View on:{" "}
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-800"
            >
              Etherscan
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterProductModal;