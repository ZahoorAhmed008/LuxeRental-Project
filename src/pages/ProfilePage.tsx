import React, { useState } from "react";
import { useOrders } from "../context/OrderContext";
import { auth } from "../firebase";
import {
  Package,
  Clock,
  DollarSign,
  CalendarDays,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";

interface Order {
  id: string;
  userId: string;
  productTitle: string;
  productImage?: string;
  productPrice: number;
  duration: string;
  rentalStartDate?: string;
  rentalEndDate?: string;
  status: string;
  fine?: number;
}

const ProfilePage: React.FC = () => {
  const { orders, updateOrderStatus } = useOrders();
  const [activeTab, setActiveTab] = useState("rentals");

  const user = auth.currentUser;
  if (!user) {
    return (
      <div className="p-6 text-center text-gray-600">
        ⚠️ Please login to view your profile.
      </div>
    );
  }

  const myOrders: Order[] = (orders as Order[]).filter(
    (o) => o.userId === user.uid
  );

  const calculateFine = (order: Order): number => {
    if (order.fine && order.fine > 0) return order.fine;
    if (
      order.status !== "Accepted" ||
      !order.rentalEndDate ||
      isNaN(new Date(order.rentalEndDate).getTime())
    )
      return 0;

    const now = new Date();
    const end = new Date(order.rentalEndDate);
    if (now <= end) return 0;

    const diffDays = Math.floor(
      (now.getTime() - end.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays <= 0) return 0;
    if (diffDays <= 2) return diffDays * 1000;
    if (diffDays > 2 && diffDays <= 14) return diffDays * 2000;
    return order.productPrice*20;
  };

  const handleReturn = async (id: string) => {
    try {
      await updateOrderStatus(id, "Return Pending");
    } catch (error) {
      console.error("Error requesting return:", error);
    }
  };

  return (
    <div className="pt-24 p-6 max-w-7xl mx-auto">
      <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl shadow-lg mb-8 flex items-center gap-6">
        <div className="w-24 h-24 bg-white/20 flex items-center justify-center rounded-full text-4xl font-bold">
          {user.displayName
            ? user.displayName[0]
            : user.email?.[0]?.toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{user.displayName || "User"}</h1>
          <p className="text-gray-100">{user.email}</p>
          <p className="text-sm text-gray-300">UID: {user.uid}</p>
        </div>
      </div>

      <div className="mb-6 flex gap-3">
        <button
          onClick={() => setActiveTab("rentals")}
          className={`px-6 py-2 rounded-lg font-medium transition ${
            activeTab === "rentals"
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          My Rentals
        </button>
      </div>

      {activeTab === "rentals" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {myOrders.length === 0 ? (
            <p className="text-gray-500 text-center py-10 col-span-full">
              📦 You haven’t rented anything yet.
            </p>
          ) : (
            myOrders.map((order) => {
              const fine = calculateFine(order);
              return (
                <div
                  key={order.id}
                  className="rounded-2xl p-[2px] bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg hover:shadow-xl transition duration-300"
                >
                  <div className="bg-white rounded-2xl overflow-hidden flex flex-col h-full">
                    {order.productImage && (
                      <div className="relative">
                        <img
                          src={order.productImage}
                          alt={order.productTitle}
                          className="w-full h-56 object-cover object-top hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium bg-white/90 shadow">
                          {order.status}
                        </span>
                      </div>
                    )}

                    <div className="p-5 flex flex-col flex-grow">
                      <h2 className="text-lg font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent line-clamp-1 flex items-center gap-2">
                        <Package className="w-5 h-5 text-blue-600" />{" "}
                        {order.productTitle}
                      </h2>

                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <p className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" /> Duration:{" "}
                          {order.duration}
                        </p>
                        <p className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-600" /> Rs.{" "}
                          {order.productPrice}
                        </p>
                        <p className="flex items-center gap-2">
                          <CalendarDays className="w-4 h-4 text-blue-600" />{" "}
                          Start: {order.rentalStartDate || "Not set"}
                        </p>
                        <p className="flex items-center gap-2">
                          <CalendarDays className="w-4 h-4 text-purple-600" />{" "}
                          End: {order.rentalEndDate || "Not set"}
                        </p>

                        {fine > 0 && (
                          <p className="flex items-center gap-2 text-red-600 font-semibold mt-2 bg-red-50 px-3 py-1 rounded-md">
                            <AlertTriangle className="w-4 h-4" /> Fine: Rs.{" "}
                            {fine}
                          </p>
                        )}
                      </div>

                      {order.status === "Accepted" && (
                        <button
                          onClick={() => handleReturn(order.id)}
                          className="mt-auto px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition flex items-center gap-2 text-sm"
                        >
                          <RotateCcw className="w-4 h-4" /> Request Return
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
