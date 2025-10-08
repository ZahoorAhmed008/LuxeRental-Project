import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Product } from "../context/ProductContext";
import { useWishlist } from "../context/WishlistContext";
import { Heart, ArrowRight, Search } from "lucide-react";

const ShopPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedGender, setSelectedGender] = useState("All"); // ✅ gender filter

  // ✅ Realtime listener for products
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snapshot) => {
      setProducts(
        snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Product)
      ));
    });
    return () => unsub();
  }, []);

  const isInWishlist = (id: string | number) =>
    wishlist.some((p: Product) => p.id === id);

  // ✅ Get all unique categories
  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  // ✅ Gender options
  const genders = ["All", "Male", "Female"];

  // ✅ Apply search + category + gender filter
  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()));

    const matchCategory =
      selectedCategory === "All" ? true : p.category === selectedCategory;

    const matchGender =
      selectedGender === "All" ? true : p.gender === selectedGender;

    return matchSearch && matchCategory && matchGender;
  });

  return (
    <div className="pt-20 max-w-7xl mx-auto px-6 mb-20">
      <h1 className="text-4xl font-extrabold mb-12 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        ✨ Our Collection
      </h1>

      {/* 🔍 Search + Gender Dropdown in Same Line */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Search Bar */}
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search outfits, dresses, styles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

       {/* Gender Dropdown */}
<div className="relative w-full md:w-auto">
  <select
    value={selectedGender}
    onChange={(e) => setSelectedGender(e.target.value)}
    className="w-full md:w-auto px-5 py-3 pr-12 rounded-full font-medium text-white shadow-lg 
               bg-gradient-to-r from-blue-600 to-purple-600 
               focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-200
               appearance-none cursor-pointer"
  >
    {genders.map((g) => (
      <option key={g} value={g} className="text-gray-800">
        {g}
      </option>
    ))}
  </select>

  {/* Custom dropdown arrow */}
  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
    <svg
      className="w-5 h-5 text-white opacity-80"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
    </svg>
  </div>
</div>

      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
              selectedCategory === cat
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {filteredProducts.map((product) => {
          const inWishlist = isInWishlist(product.id);

          return (
            <div
              key={product.id}
              className="rounded-2xl p-[2px] bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg hover:shadow-xl transition duration-300"
            >
              <div className="bg-white rounded-2xl overflow-hidden flex flex-col h-full">
                <Link to={`/product/${product.id}`} className="flex flex-col h-full">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-64 object-cover object-top hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow">
                      {product.category}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        inWishlist
                          ? removeFromWishlist(product.id)
                          : addToWishlist(product);
                      }}
                      className={`absolute top-3 right-3 p-2 rounded-full shadow transition ${
                        inWishlist
                          ? "bg-red-500 text-white animate-pulse"
                          : "bg-white text-gray-600 hover:text-red-500"
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${inWishlist ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <h2 className="text-lg font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent line-clamp-1">
                      {product.title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.description
                        ? product.description
                        : `Perfect ${product.category.toLowerCase()} for your style.`}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <p className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Rs. {product.price} 
                          <span className="text-sm font-medium"> /day</span>
                      </p>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:underline">
                        View Details
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShopPage;
