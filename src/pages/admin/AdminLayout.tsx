import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Manage Products", path: "/admin/products", icon: <Package className="w-5 h-5" /> },
    { name: "Manage Orders", path: "/admin/orders", icon: <ShoppingCart className="w-5 h-5" /> },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // redirect user to login page
    } catch (error) {
      console.error("❌ Error logging out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar - Fixed */}
      <aside className="fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-blue-800 via-blue-700 to-purple-700 text-white flex flex-col">
        <div className="p-6 border-b border-white/20">
          <h2 className="text-2xl font-bold tracking-wide">👑 Admin Panel</h2>
        </div>

        <nav className="flex-1 p-6 space-y-3 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                location.pathname === item.path
                  ? "bg-white text-blue-800 shadow-md"
                  : "hover:bg-white/10"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-white/20">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-72 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-16 bg-white shadow flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
          <span className="text-gray-500">Welcome, Admin 👋</span>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
