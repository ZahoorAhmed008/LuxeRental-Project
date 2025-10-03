import React from "react";
import { useWishlist } from "../context/WishlistContext";
import { Link } from "react-router-dom";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-12 text-center text-white shadow">
      
         <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Your <span className="text-amber-400">Wishlist 💖</span>
          </h2>
        <p className="mt-2 text-blue-100">
          You have{" "}
          <span className="font-bold text-white">{wishlist.length}</span>{" "}
          {wishlist.length === 1 ? "item" : "items"} saved for later
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {wishlist.length === 0 ? (
          <div className="text-center bg-white rounded-xl shadow-md p-10">
            <p className="text-gray-600 text-lg">
              😢 No products in your wishlist yet.
            </p>
            <p className="text-gray-400 mt-2">
              Start exploring and add items you love!
            </p>
            <Link
              to="/shop"
              className="mt-6 inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow hover:shadow-lg transition"
            >
              Browse Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="rounded-xl p-[2px] bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg hover:shadow-xl transition"
              >
                <div className="bg-white rounded-xl overflow-hidden flex flex-col h-full">
                  {/* Product Image */}
               <img
  src={product.image}
  alt={product.title}
  className="w-full max-h-64 object-contain bg-gray-100"
/>


                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h2 className="text-lg font-semibold text-gray-900 truncate">
                      {product.title}
                    </h2>
                    <p className="font-bold mt-2 text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Rs. {product.price}
                    </p>

                    {/* Actions */}
                    <div className="flex justify-between items-center mt-auto pt-5 gap-2">
                      {/* ✅ View → ProductDetailPage.tsx */}
                      <Link
                        to={`/product/${product.id}`}
                        className="flex-1 text-center px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                      >
                        View
                      </Link>

                      {/* ✅ Rent Now → RentConfirmationPage.jsx */}
                      <Link
                        to={`/rent/${product.id}`}
                        className="flex-1 text-center px-4 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                      >
                        Rent Now
                      </Link>

                      {/* Remove from wishlist */}
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="px-4 py-2 text-sm font-medium rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
