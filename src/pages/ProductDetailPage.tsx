import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useWishlist } from "../context/WishlistContext";
import { Heart, Truck, Shield, RotateCcw } from "lucide-react";

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string;
  images?: string[];
  description?: string;
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [product, setProduct] = useState<Product | null>(null);

  // ✅ gallery with main + extra
  const [allImages, setAllImages] = useState<string[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);

  useEffect(() => {
    if (!id) return;

    const unsub = onSnapshot(doc(db, "products", id), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as Product;
        const fetchedProduct = {
          ...data,
          id: docSnap.id,
        };
        setProduct(fetchedProduct);

        // ✅ make image array [main + extras]
        const imgs = [fetchedProduct.image, ...(fetchedProduct.images ?? [])];
        setAllImages(imgs);
        setMainImageIndex(0);
      } else {
        setProduct(null);
      }
    });

    return () => unsub();
  }, [id]);

  if (!product) {
    return (
      <div className="pt-16 text-center text-red-600 text-xl font-semibold">
        Product not found
      </div>
    );
  }

  // ✅ check if already in wishlist
  const isInWishlist = wishlist.some((p: { id: string; }) => p.id === product.id);

  // ✅ handlers
  const handlePrev = () => {
    setMainImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setMainImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const handleImageClick = (i: number) => {
    setMainImageIndex(i);
  };

  return (
    <div className="pt-20 max-w-6xl mx-auto px-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Product Image + Gallery */}
        <div className="space-y-4 relative">
          {/* Main image with toggle */}
          <div className="relative">
            <img
              src={allImages[mainImageIndex]}
              alt={product.title}
              className="w-full h-96 object-contain rounded-2xl shadow-lg bg-gray-100"
            />

            {/* Left toggle */}
            {allImages.length > 1 && (
              <button
                onClick={handlePrev}
                className="absolute top-1/2 left-3 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-full shadow-md hover:scale-105 transition"
              >
                ‹
              </button>
            )}

            {/* Right toggle */}
            {allImages.length > 1 && (
              <button
                onClick={handleNext}
                className="absolute top-1/2 right-3 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-full shadow-md hover:scale-105 transition"
              >
                ›
              </button>
            )}
          </div>

          {/* Gallery Thumbnails */}
          {allImages.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {allImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${product.title} ${i + 1}`}
                  onClick={() => handleImageClick(i)}
                  className={`w-full h-24 object-contain rounded-xl border cursor-pointer transition 
                    ${
                      mainImageIndex === i
                        ? "ring-2 ring-purple-600"
                        : "hover:scale-105"
                    }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {product.title}
          </h1>
          <p className="text-2xl font-bold text-purple-700 mb-2">
            Rs. {product.price}
          </p>
          <span className="inline-block bg-purple-500 text-white text-sm px-3 py-1 rounded-full mb-6">
            {product.category}
          </span>

          <p className="text-gray-600 mb-6 leading-relaxed">
            {product.description
              ? product.description
              : `A stylish ${product.category.toLowerCase()} perfect for any occasion.`}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={() => navigate(`/rent/${product.id}`)}
              className="flex-1 bg-gradient-to-r from-blue-700 to-purple-600 text-white text-center py-3 rounded-xl font-semibold hover:from-blue-800 hover:to-purple-700 transition"
            >
              Rent Now
            </button>

            <button
              onClick={() =>
                isInWishlist
                  ? removeFromWishlist(product.id)
                  : addToWishlist(product)
              }
              className={`flex-1 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 border-2 ${
                isInWishlist
                  ? "bg-red-500 border-red-500 text-white hover:bg-red-600"
                  : "border-blue-600 text-blue-600 hover:bg-blue-50"
              }`}
            >
              <Heart
                className={`w-5 h-5 ${
                  isInWishlist ? "fill-current text-white" : ""
                }`}
              />
              {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl text-center shadow-sm">
              <Truck className="mx-auto text-blue-600 mb-2" />
              <p className="text-sm font-medium text-gray-700">Free Delivery</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl text-center shadow-sm">
              <RotateCcw className="mx-auto text-blue-600 mb-2" />
              <p className="text-sm font-medium text-gray-700">Easy Returns</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl text-center shadow-sm">
              <Shield className="mx-auto text-blue-600 mb-2" />
              <p className="text-sm font-medium text-gray-700">Secure Rental</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
