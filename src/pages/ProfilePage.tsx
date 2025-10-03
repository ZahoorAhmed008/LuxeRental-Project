import React, { useState } from "react";
import { useOrders } from "../context/OrderContext";
import { auth } from "../firebase";
import {
  Package,
  Clock,
  DollarSign,
  CalendarDays,
  RotateCcw,
} from "lucide-react";

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

  const myOrders = orders.filter((o) => o.userId === user.uid);

  // Handle Return Request
  const handleReturn = async (id: string) => {
    await updateOrderStatus(id, "Return Pending");
  };

  return (
    <div className="pt-24 p-6 max-w-7xl mx-auto">
      {/* ✅ Profile Header */}
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

      {/* Tabs */}
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

      {/* Rentals with ShopPage Style */}
      {activeTab === "rentals" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {myOrders.length === 0 ? (
            <p className="text-gray-500 text-center py-10 col-span-full">
              📦 You haven’t rented anything yet.
            </p>
          ) : (
            myOrders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl p-[2px] bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg hover:shadow-xl transition duration-300"
              >
                <div className="bg-white rounded-2xl overflow-hidden flex flex-col h-full">
                  {/* Product Image */}
                  {order.productImage && (
                    <div className="relative">
                      <img
                        src={order.productImage}
                        alt={order.productTitle}
                        className="w-full h-56 object-cover object-top hover:scale-105 transition-transform duration-500"
                      />
                      {/* Status Badge */}
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium bg-white/90 shadow">
                        {order.status}
                      </span>
                    </div>
                  )}

                  {/* Card Content */}
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
                        <CalendarDays className="w-4 h-4 text-blue-600" /> Start:{" "}
                        {order.rentalStartDate
                          ? order.rentalStartDate
                          : "Not set"}
                      </p>
                      <p className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-purple-600" /> End:{" "}
                        {order.rentalEndDate ? order.rentalEndDate : "Not set"}
                      </p>
                    </div>

                    {/* Return Button */}
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
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
