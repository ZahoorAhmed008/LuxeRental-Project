import React, { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

// =======================
// 🔹 Status Types
// =======================
export type OrderStatus =
  | "Pending"
  | "Accepted"
  | "Shipped"
  | "Completed"
  | "Cancelled"
  | "Return Pending"
  | "Return Accepted"
  | "Return Rejected";

export type FineStatus = "none" | "unpaid" | "paid";

// =======================
// 🔹 Order Interface
// =======================
export interface Order {
  id: string;
  userId: string;
  customer: string;
  email: string;
  mobile: string;
  city: string;
  postal: string;
  address: string;
  duration: string;
  status: OrderStatus;
  paymentMethod: string;
  productTitle: string;
  productPrice: number;
  productImage?: string;
  paymentScreenshot?: string;
  createdAt: number;

  rentalStartDate?: string;
  rentalEndDate?: string;

  fineAmount?: number;
  fineProof?: string;
  fineStatus?: "unpaid" | "pending" | "paid" | "none";
}

// =======================
// 🔹 Context Type
// =======================
interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "createdAt" | "status">) => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  updateFineStatus: (id: string, fineStatus: FineStatus, fineProof?: string) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// =======================
// 🔹 Fine Calculation Helper
// =======================
const calculateFine = (order: Order): { fineAmount: number; fineStatus: FineStatus } => {
  if (order.status !== "Accepted" || !order.rentalEndDate) {
    return { fineAmount: 0, fineStatus: "none" };
  }

  const now = new Date();
  const endDate = new Date(order.rentalEndDate);
  const graceEnd = new Date(endDate.getTime() + 4 * 60 * 60 * 1000);

  if (now <= graceEnd) return { fineAmount: 0, fineStatus: "none" };

  const diffDays = Math.floor((now.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24));

  let fine = 0;
  if (diffDays === 1 || diffDays === 2) fine = diffDays * 1000;
  else if (diffDays > 2 && diffDays <= 14) fine = 2000 * diffDays;
  else if (diffDays > 14) fine = order.productPrice;

  return { fineAmount: fine, fineStatus: fine > 0 ? "unpaid" : "none" };
};

// =======================
// 🔹 Provider
// =======================
export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, async (snapshot) => {
      const list: Order[] = [];

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data() as Order;
        const fineResult = calculateFine(data);

        // 🧩 If fine changed -> update Firestore
        if (
          (fineResult.fineAmount || fineResult.fineStatus !== "none") &&
          (data.fineAmount !== fineResult.fineAmount ||
            data.fineStatus !== fineResult.fineStatus)
        ) {
          const ref = doc(db, "orders", docSnap.id);
          await updateDoc(ref, {
            fineAmount: fineResult.fineAmount,
            fineStatus: fineResult.fineStatus,
          });
        }

        list.push({
          ...data,
          id: docSnap.id,
          fineAmount: fineResult.fineAmount,
          fineStatus: fineResult.fineStatus,
        });
      }

      setOrders(list);
    });

    return () => unsub();
  }, []);

  // =======================
  // 🔹 Add new order
  // =======================
  const addOrder = async (order: Omit<Order, "id" | "createdAt" | "status">) => {
    try {
      await addDoc(collection(db, "orders"), {
        ...order,
        status: "Pending",
        fineAmount: 0,
        fineStatus: "none",
        createdAt: Date.now(),
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("❌ Error adding order:", error);
    }
  };

  // =======================
  // 🔹 Update order status
  // =======================
  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    try {
      const ref = doc(db, "orders", id);
      await updateDoc(ref, { status });
    } catch (error) {
      console.error("❌ Error updating status:", error);
    }
  };

  // =======================
  // 🔹 Update fine status (with proof)
  // =======================
  const updateFineStatus = async (id: string, fineStatus: FineStatus, fineProof?: string) => {
    try {
      const ref = doc(db, "orders", id);
      await updateDoc(ref, { fineStatus, fineProof });
    } catch (error) {
      console.error("❌ Error updating fine status:", error);
    }
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, updateFineStatus }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrders must be used inside OrderProvider");
  return context;
};
