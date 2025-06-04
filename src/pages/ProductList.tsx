import { useEffect, useState } from "react";
import { getSupplyChainContract } from "../contracts/utils/contract";

const ProductList = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const contract = await getSupplyChainContract();
        if (!contract) return;
        //alert(JSON.stringify(contract));

        const ids: bigint[] = await contract.getAllProductIds();

        const productDetails = await Promise.all(
          ids.map((id) => contract.getProduct(id))
        );

        setProducts(productDetails);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">📦 Registered Products</h1>

      {loading ? (
        <p className="text-gray-600">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-red-500">No products found.</p>
      ) : (
        products.map((product, index) => (
          <div key={index} className="bg-white rounded-xl shadow p-4 mb-4 border">
            <p><span className="font-semibold">Serial Hash:</span> {product.serialHash}</p>
            <p><span className="font-semibold">Metadata URI:</span> {product.metadataURI}</p>
            <p><span className="font-semibold">Current Owner:</span> {product.currentOwner}</p>
            <p><span className="font-semibold">Flagged:</span> {product.isFlagged ? "✅ Yes" : "❌ No"}</p>
            {product.isFlagged && (
              <>
                <p><span className="font-semibold">Flag Reason:</span> {product.flagReason}</p>
                <p><span className="font-semibold">Flagged By:</span> {product.flaggedBy}</p>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ProductList;
