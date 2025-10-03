import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { Trash2 } from "lucide-react";

interface UserData {
  uid: string;
  email: string;
  name?: string;
  phone?: string;
  city?: string;
  address?: string;
  postalCode?: string;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      const userList = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as UserData;
        return {
          uid: docSnap.id,
          email: data.email || "N/A",
          name: data.name || "N/A",
          phone: data.phone || "N/A",
          city: data.city || "N/A",
          address: data.address || "N/A",
          postalCode: data.postalCode || "N/A",
        };
      });
      setUsers(userList);
    });

    return () => unsub();
  }, []);

  // ✅ Delete user from Firestore
  const handleDelete = async (uid: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteDoc(doc(db, "users", uid));
        alert("✅ User deleted successfully!");
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("❌ Failed to delete user.");
      }
    }
  };

  // ✅ Filter users by name or email
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">All Users</h1>

      {/* 🔎 Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <thead className="bg-blue-700 text-white">
          <tr>
            <th className="py-3 px-4 text-left">Name</th>
            <th className="py-3 px-4 text-left">Email</th>
            <th className="py-3 px-4 text-left">Phone</th>
            <th className="py-3 px-4 text-left">City</th>
            <th className="py-3 px-4 text-left">Postal Code</th>
            <th className="py-3 px-4 text-center w-20">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr
              key={user.uid}
              className="border-b hover:bg-gray-50 transition"
            >
              <td className="py-2 px-4">{user.name}</td>
              <td className="py-2 px-4">{user.email}</td>
              <td className="py-2 px-4">{user.phone}</td>
              <td className="py-2 px-4">{user.city}</td>
              <td className="py-2 px-4">{user.postalCode}</td>
              <td className="py-2 px-4 text-center">
                <button
                  onClick={() => handleDelete(user.uid)}
                  className="text-red-600 hover:text-red-800 transition"
                  title="Delete User"
                >
                  <Trash2 className="h-5 w-5 inline" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
