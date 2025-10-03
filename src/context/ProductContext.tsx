import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  onSnapshot,
  doc,
} from "firebase/firestore";

// 🔹 Product interface
export interface Product {
  id: string; // Firestore document ID
  title: string;
  price: number;
  category: string;
  image: string; // main image
  images?: string[]; // optional gallery images
  description?: string; // optional short/full description
  gender?: string; // ✅ added gender field (Male/Female)
}

// 🔹 Context type
interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
}

// 🔹 Create Context
const ProductContext = createContext<ProductContextType | undefined>(undefined);

// 🔹 Provider component
export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>([]);

  // ✅ Realtime products fetch
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

  // ✅ Add product
  const addProduct = async (product: Omit<Product, "id">) => {
    await addDoc(collection(db, "products"), product);
  };

  // ✅ Remove product
  const removeProduct = async (id: string) => {
    await deleteDoc(doc(db, "products", id));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, removeProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

// 🔹 Custom hook
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used inside ProductProvider");
  }
  return context;
};
