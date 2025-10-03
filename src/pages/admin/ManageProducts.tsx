import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { Product } from "../../context/ProductContext";

const ManageProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "",
    image: "",
    images: "",
    description: "",
  });

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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
        )
      );
    });
    return () => unsub();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.category || !form.image) {
      alert("⚠️ Please fill all required fields");
      return;
    }

    try {
      await addDoc(collection(db, "products"), {
        title: form.title,
        price: Number(form.price), // price per day
        category: form.category,
        image: form.image,
        images: form.images
          ? form.images.split(",").map((url) => url.trim())
          : [],
        description: form.description,
      });

      alert("✅ Product added successfully!");
      setForm({
        title: "",
        price: "",
        category: "",
        image: "",
        images: "",
        description: "",
      });
    } catch (error) {
      console.error("Error adding product:", error);
      alert("❌ Failed to add product. Check Firestore rules!");
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await deleteDoc(doc(db, "products", id));
      alert("🗑️ Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      title: product.title,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
      images: product.images?.join(", ") || "",
      description: product.description || "",
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      await updateDoc(doc(db, "products", editingProduct.id), {
        title: form.title,
        price: Number(form.price),
        category: form.category,
        image: form.image,
        images: form.images
          ? form.images.split(",").map((url) => url.trim())
          : [],
        description: form.description,
      });

      alert("✅ Product updated successfully!");
      setEditingProduct(null);
      setForm({
        title: "",
        price: "",
        category: "",
        image: "",
        images: "",
        description: "",
      });
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Products</h1>

      {/* Add Product Form */}
      {!editingProduct && (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 shadow rounded-lg mb-8"
        >
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Product Title"
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price Per Day"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="Main Image URL"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="images"
            value={form.images}
            onChange={handleChange}
            placeholder="Other Images (comma separated URLs)"
            className="border p-2 rounded md:col-span-2"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Short / Full Description"
            className="border p-2 rounded md:col-span-2"
          ></textarea>
          <button
            type="submit"
            className="md:col-span-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Add Product
          </button>
        </form>
      )}

      {/* Edit Product Form */}
      {editingProduct && (
        <form
          onSubmit={handleUpdate}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-yellow-50 p-6 shadow rounded-lg mb-8"
        >
          <h2 className="md:col-span-2 text-lg font-bold mb-2">
            ✏️ Editing: {editingProduct.title}
          </h2>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Product Title"
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price Per Day"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="Main Image URL"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="images"
            value={form.images}
            onChange={handleChange}
            placeholder="Other Images (comma separated URLs)"
            className="border p-2 rounded md:col-span-2"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Short / Full Description"
            className="border p-2 rounded md:col-span-2"
          ></textarea>
          <div className="flex gap-3 md:col-span-2">
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setEditingProduct(null)}
              className="bg-gray-300 py-2 px-4 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white shadow rounded-lg overflow-hidden"
          >
            <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div className="p-4">
             <h2 className="font-semibold">{product.title}</h2>
<p className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
  Rs. {product.price} / day
</p>

              <span className="text-gray-500 text-sm">{product.category}</span>
              <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                {product.description}
              </p>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="flex-1 bg-yellow-100 text-yellow-700 px-3 py-2 rounded hover:bg-yellow-200 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleRemove(product.id.toString())}
                  className="flex-1 bg-red-100 text-red-600 px-3 py-2 rounded hover:bg-red-200 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageProducts;
