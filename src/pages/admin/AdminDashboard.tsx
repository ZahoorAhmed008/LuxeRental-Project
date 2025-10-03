import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import {
  ShoppingCart,
  Package,
  Mail,
  Users,
  ClipboardList,
  RefreshCcw,
  CheckCircle,
  XCircle,
} from "lucide-react";

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    pending: 0,
    accepted: 0,
    returned: 0,
    returnPending: 0,
    totalMessages: 0,
  });

  useEffect(() => {
    const unsubProducts = onSnapshot(collection(db, "products"), (snapshot) => {
      setStats((prev) => ({ ...prev, totalProducts: snapshot.size }));
    });

    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      setStats((prev) => ({ ...prev, totalUsers: snapshot.size }));
    });

    const unsubOrders = onSnapshot(collection(db, "orders"), (snapshot) => {
      let pending = 0,
        accepted = 0,
        returned = 0,
        returnPending = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        const status = (data.status || "").toLowerCase();

        if (status === "pending") pending++;
        else if (status === "accepted") accepted++;
        else if (status === "returned" || status === "return confirmed")
          returned++;
        else if (status === "return_pending" || status === "return pending")
          returnPending++;
      });

      setStats((prev) => ({
        ...prev,
        totalOrders: snapshot.size,
        pending,
        accepted,
        returned,
        returnPending,
      }));
    });

    const unsubMessages = onSnapshot(collection(db, "contacts"), (snapshot) => {
      setStats((prev) => ({ ...prev, totalMessages: snapshot.size }));
    });

    return () => {
      unsubProducts();
      unsubUsers();
      unsubOrders();
      unsubMessages();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white">
      <div className="w-full py-12 px-6 max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-10 text-center">
          📊 Admin Dashboard
        </h1>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          <Link
            to="/admin/products"
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center text-center"
          >
            <Package size={36} className="mb-3 text-yellow-400" />
            <h2 className="text-lg font-semibold">Products</h2>
            <p className="text-3xl font-bold">{stats.totalProducts}</p>
          </Link>

          <Link
            to="/admin/orders"
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center text-center"
          >
            <ClipboardList size={36} className="mb-3 text-green-400" />
            <h2 className="text-lg font-semibold">Orders</h2>
            <p className="text-3xl font-bold">{stats.totalOrders}</p>
          </Link>

          <Link
            to="/admin/users"
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center text-center"
          >
            <Users size={36} className="mb-3 text-purple-400" />
            <h2 className="text-lg font-semibold">Users</h2>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
          </Link>

          <Link
            to="/admin/messages"
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center text-center"
          >
            <Mail size={36} className="mb-3 text-pink-400" />
            <h2 className="text-lg font-semibold">Messages</h2>
            <p className="text-3xl font-bold">{stats.totalMessages}</p>
          </Link>
        </div>

        {/* Order Status Breakdown */}
        <h2 className="text-2xl font-bold mb-6">📦 Order Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          <Link
            to="/admin/orders?status=pending"
            className="bg-yellow-500/90 rounded-xl p-5 text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <RefreshCcw className="mx-auto mb-2" size={28} />
            <h3 className="font-semibold">Pending</h3>
            <p className="text-2xl font-bold">{stats.pending}</p>
          </Link>

          <Link
            to="/admin/orders?status=accepted"
            className="bg-green-600/90 rounded-xl p-5 text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <CheckCircle className="mx-auto mb-2" size={28} />
            <h3 className="font-semibold">Accepted</h3>
            <p className="text-2xl font-bold">{stats.accepted}</p>
          </Link>

          <Link
            to="/admin/orders?status=returned"
            className="bg-blue-600/90 rounded-xl p-5 text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <ShoppingCart className="mx-auto mb-2" size={28} />
            <h3 className="font-semibold">Returned</h3>
            <p className="text-2xl font-bold">{stats.returned}</p>
          </Link>

          <Link
            to="/admin/orders?status=return_pending"
            className="bg-red-600/90 rounded-xl p-5 text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <XCircle className="mx-auto mb-2" size={28} />
            <h3 className="font-semibold">Return Pending</h3>
            <p className="text-2xl font-bold">{stats.returnPending}</p>
          </Link>
        </div>

        {/* Manage Section */}
        <h2 className="text-2xl font-bold mb-6">⚙️ Manage</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/admin/orders"
            className="flex items-center justify-between bg-gradient-to-r from-blue-700 to-blue-800 p-6 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all"
          >
            <div>
              <h3 className="text-lg font-semibold">Manage Orders</h3>
              <p className="text-sm text-gray-200">
                View & update customer orders
              </p>
            </div>
            <ShoppingCart size={40} className="text-white" />
          </Link>

          <Link
            to="/admin/products"
            className="flex items-center justify-between bg-gradient-to-r from-green-700 to-green-800 p-6 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all"
          >
            <div>
              <h3 className="text-lg font-semibold">Add Product</h3>
              <p className="text-sm text-gray-200">
                Add new items to the store
              </p>
            </div>
            <Package size={40} className="text-white" />
          </Link>

          <Link
            to="/admin/messages"
            className="flex items-center justify-between bg-gradient-to-r from-pink-700 to-pink-800 p-6 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all"
          >
            <div>
              <h3 className="text-lg font-semibold">Manage Messages</h3>
              <p className="text-sm text-gray-200">
                Read contact form submissions
              </p>
            </div>
            <Mail size={40} className="text-white" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
