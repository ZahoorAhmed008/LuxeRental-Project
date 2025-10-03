// src/pages/admin/ManageOrders.tsx

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "../../firebase";
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";

interface Order {
  id: string;
  customer: string;
  email: string;
  duration: string;
  status: string;
  productTitle: string;
  productPrice: number;
  productImage: string;
}

const ManageOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Get status filter from query params
  const queryParams = new URLSearchParams(location.search);
  const statusFilter = queryParams.get("status");

  const fetchOrders = async () => {
    const querySnap = await getDocs(collection(db, "orders"));
    let list: Order[] = querySnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Order[];

    // ✅ Apply filter based on query param
    if (statusFilter) {
      list = list.filter((order) => {
        const status = order.status.toLowerCase();
        if (statusFilter === "pending") return status === "pending";
        if (statusFilter === "accepted") return status === "accepted";
        if (statusFilter === "return_pending") return status === "return pending";
        if (statusFilter === "returned") return status === "return confirmed" || status === "returned";
        return true;
      });
    }

    setOrders(list);
  };

  const updateStatus = async (id: string, status: string) => {
    const ref = doc(db, "orders", id);
    await updateDoc(ref, { status });
    fetchOrders();
    setOpenMenuId(null);
  };

  const removeOrder = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      await deleteDoc(doc(db, "orders", id));
      fetchOrders();
    }
    setOpenMenuId(null);
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]); // ✅ Refetch when query param changes

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Accepted":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      case "Return Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Return Confirmed":
        return "bg-green-100 text-green-700";
      case "Return Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Manage Orders{" "}
        {statusFilter && (
          <span className="text-gray-600 text-lg">
            ({statusFilter.replace("_", " ")})
          </span>
        )}
      </h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Image</th>
            <th className="p-2 border">Product</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Customer</th>
            <th className="p-2 border">Duration</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border relative">
              <td className="p-2 text-center">
                {order.productImage ? (
                  <img
                    src={order.productImage}
                    alt={order.productTitle}
                    className="w-16 h-16 object-cover rounded mx-auto"
                  />
                ) : (
                  "No Image"
                )}
              </td>
              <td className="p-2">{order.productTitle}</td>
              <td className="p-2">Rs. {order.productPrice}</td>

              {/* 👇 Customer clickable */}
              <td
                className="p-2 text-blue-600 underline cursor-pointer"
                onClick={() => navigate(`/admin/order/${order.id}`)}
              >
                {order.customer}
              </td>

              <td className="p-2">{order.duration}</td>
              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded text-sm font-medium ${getStatusClass(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </td>
              <td className="p-2 text-center relative">
                <button
                  onClick={() =>
                    setOpenMenuId(openMenuId === order.id ? null : order.id)
                  }
                  className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-800"
                >
                  Actions ▾
                </button>

                {openMenuId === order.id && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-10">
                    {order.status === "Pending" && (
                      <>
                        <button
                          onClick={() => updateStatus(order.id, "Accepted")}
                          className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateStatus(order.id, "Rejected")}
                          className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {order.status === "Accepted" && (
                      <button
                        onClick={() => updateStatus(order.id, "Return Pending")}
                        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                      >
                        Awaiting Return
                      </button>
                    )}
                    {order.status === "Return Pending" && (
                      <>
                        <button
                          onClick={() =>
                            updateStatus(order.id, "Return Confirmed")
                          }
                          className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                        >
                          Accept Return
                        </button>
                        <button
                          onClick={() =>
                            updateStatus(order.id, "Return Rejected")
                          }
                          className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                        >
                          Reject Return
                        </button>
                      </>
                    )}
                    {(order.status === "Rejected" ||
                      order.status === "Return Confirmed" ||
                      order.status === "Return Rejected") && (
                      <p className="px-4 py-2 text-gray-500 text-sm">
                        Already {order.status}
                      </p>
                    )}
                    <button
                      onClick={() => removeOrder(order.id)}
                      className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}

          {orders.length === 0 && (
            <tr>
              <td colSpan={7} className="p-4 text-center text-gray-500">
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageOrders;
