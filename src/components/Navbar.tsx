import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { Heart, Menu, X, Crown, LogOut, Bell } from "lucide-react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { useOrders } from "../context/OrderContext";

type Notification = {
  message: string;
  read: boolean;
  deadline?: number; // timestamp for countdown
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { orders } = useOrders();

  const navItems = ["Home", "Shop", "About", "Policies", "Contact", "Blog"];

  // 🔐 Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // 🖱️ Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔔 Notifications for logged in user
  useEffect(() => {
    if (!currentUser) return;
    const myOrders = orders.filter((o) => o.userId === currentUser.uid);

    myOrders.forEach((order) => {
      let msg = "";
      let deadline: number | undefined;

      if (order.status === "Accepted") {
        msg = `✅ Your order "${order.productTitle}" was Accepted`;
      } else if (order.status === "Rejected") {
        msg = `❌ Your order "${order.productTitle}" was Rejected`;
      } else if (order.status === "Returned") {
        msg = `📦 Your return for "${order.productTitle}" has been Confirmed`;
      } else if (order.status === "ReturnRejected") {
        msg = `⚠️ Your return request for "${order.productTitle}" was Rejected. Please confirm within 1 day, otherwise full payment will be charged.`;
        deadline = Date.now() + 24 * 60 * 60 * 1000; // 24h deadline
      } else if (order.status === "Pending") {
        msg = `⏳ Your order "${order.productTitle}" is Pending`;
      }

      if (msg) {
        setNotifications((prev) =>
          prev.some((n) => n.message === msg)
            ? prev
            : [...prev, { message: msg, read: false, deadline }]
        );
      }
    });
  }, [orders, currentUser]);

  // ⏳ Update countdown every second
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications((prev) =>
        prev.map((n) => {
          if (!n.deadline) return n;
          const remaining = n.deadline - Date.now();
          if (remaining <= 0) {
            return {
              ...n,
              message: "⚠️ Deadline passed. Full payment will be charged.",
              deadline: undefined,
            };
          }
          return { ...n };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 🔢 Unread count
  const unreadCount = notifications.filter((n) => !n.read).length;

  // 📌 Open/close notifications & mark as read
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  };

  // 🚪 Logout
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  // ⏳ Format countdown timer
  const formatCountdown = (deadline?: number) => {
    if (!deadline) return "";
    const remaining = deadline - Date.now();
    if (remaining <= 0) return "";
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    return `⏳ ${hours}h ${minutes}m ${seconds}s left`;
  };

  // 🎭 Auth Buttons + Profile + Notifications
  const renderAuthButton = () => {
    if (location.pathname === "/login") {
      return (
        <Link
          to="/signup"
          className="bg-blue-700 text-white px-5 py-2 rounded-full font-medium shadow-md hover:bg-blue-800 transition-all duration-300 hover:scale-105"
        >
          Sign Up
        </Link>
      );
    } else if (location.pathname === "/signup") {
      return (
        <Link
          to="/login"
          className="bg-blue-700 text-white px-5 py-2 rounded-full font-medium shadow-md hover:bg-blue-800 transition-all duration-300 hover:scale-105"
        >
          Login
        </Link>
      );
    } else if (currentUser) {
      return (
        <div className="relative flex items-center gap-4" ref={dropdownRef}>
          {/* 🔔 Notification Bell */}
          <div className="relative">
            <button
              onClick={toggleNotifications}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <Bell className="h-6 w-6 text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                {notifications.length === 0 ? (
                  <p className="p-4 text-gray-500 text-sm text-center">
                    No new notifications
                  </p>
                ) : (
                  <ul className="max-h-64 overflow-y-auto">
                    {notifications.map((note, index) => (
                      <li
                        key={index}
                        className={`p-3 text-sm border-b last:border-none ${note.read ? "text-gray-500" : "font-medium text-gray-800"
                          } hover:bg-gray-50`}
                      >
                        <div>{note.message}</div>
                        {note.deadline && (
                          <div className="text-xs text-red-500 mt-1">
                            {formatCountdown(note.deadline)}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* 👤 Profile Dropdown */}
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {currentUser.displayName?.charAt(0).toUpperCase() || "U"}
            </div>
            <span className="text-sm font-medium text-gray-800">
              {currentUser.displayName || "Profile"}
            </span>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-12 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <button
                onClick={() => {
                  navigate("/profile");
                  setShowDropdown(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
              >
                View Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600 flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <Link
          to="/login"
          className="bg-blue-700 text-white px-5 py-2 rounded-full font-medium shadow-md hover:bg-blue-800 transition-all duration-300 hover:scale-105"
        >
          Login
        </Link>
      );
    }
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-md fixed w-full z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
         <Link to="/" className="flex items-center space-x-2 group">
  <Crown className="h-8 w-8 text-blue-600 group-hover:text-purple-600 transition-colors duration-300" />
  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
    LuxeRental
  </span>
</Link>


          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {navItems.map((item) => (
                <NavLink
                  key={item}
                  to={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
                  className={({ isActive }) =>
                    `relative font-medium transition-colors duration-200 group ${isActive ? "text-blue-700" : "text-gray-700 hover:text-blue-700"
                    }`
                  }
                >
                  {item}
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-700 transition-all group-hover:w-full"></span>
                </NavLink>
              ))}
            </div>
          </div>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-5">
            <Link to="/wishlist">
              <Heart className="h-6 w-6 text-gray-600 hover:text-red-500 cursor-pointer transition-colors duration-200" />
            </Link>
            {renderAuthButton()}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-700"
            >
              {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-3 pt-3 pb-6 space-y-2 bg-white/95 shadow-lg rounded-b-xl border-t border-gray-200">
              {navItems.map((item) => (
                <NavLink
                  key={item}
                  to={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg font-medium transition-colors duration-200 ${isActive
                      ? "text-blue-700 bg-blue-50"
                      : "text-gray-700 hover:text-blue-700"
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </NavLink>
              ))}

              <Link
                to="/wishlist"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-gray-700 hover:text-red-500 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Heart className="h-5 w-5" />
                <span>Wishlist</span>
              </Link>

              <div onClick={() => setIsOpen(false)}>{renderAuthButton()}</div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
