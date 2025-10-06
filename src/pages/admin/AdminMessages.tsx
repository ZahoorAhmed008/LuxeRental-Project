import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import emailjs from "emailjs-com";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  createdAt?: any;
  status?: string; // "Pending" | "Read" | "Replied"
  adminReply?: string;
  repliedBy?: string;
}

const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [replying, setReplying] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "replied">("all");
  const [search, setSearch] = useState("");
  const [viewingMessage, setViewingMessage] = useState<ContactMessage | null>(null);

  // Fetch messages in real-time
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "contacts"), (snapshot) => {
      let list: ContactMessage[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<ContactMessage, "id">),
      }));

      // Sort by createdAt (newest first)
      list = list.sort((a, b) => {
        const aTime = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
        const bTime = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
        return bTime - aTime; // newest first
      });

      setMessages(list);
    });
    return () => unsub();
  }, []);

  // Send reply
  const sendReply = async () => {
    if (!replying || !replyText.trim()) return;

    try {
      const ref = doc(db, "contacts", replying.id);
      await updateDoc(ref, {
        status: "Replied",
        adminReply: replyText,
        repliedBy: "za0389188@gmail.com",
      });

      const templateParams = {
        to_email: replying.email,
        to_name: replying.name,
        reply_message: replyText,
        from_admin: "za0389188@gmail.com",
      };

      await emailjs.send(
        "service_5ygrhdc",
        "template_ww5ae8m",
        templateParams,
        "n04UF7IbGu3RvjBYI"
      );

      alert("Reply stored and email sent ✅");
      setReplying(null);
      setReplyText("");
    } catch (err) {
      console.error("Error replying:", err);
      alert("Failed ❌");
    }
  };

  // Mark as read when viewing
  const handleViewMessage = async (msg: ContactMessage) => {
    setViewingMessage(msg);
    if (!msg.status || msg.status === "Pending") {
      try {
        const ref = doc(db, "contacts", msg.id);
        await updateDoc(ref, { status: "Read" });
      } catch (err) {
        console.error("Error marking as read:", err);
      }
    }
  };

  // Filtering + Searching
  const filteredMessages = messages.filter((msg) => {
    const matchFilter =
      filter === "all"
        ? true
        : filter === "pending"
        ? !msg.status || msg.status === "Pending" || msg.status === "Read"
        : msg.status === "Replied";

    const matchSearch = msg.email
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchFilter && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
        User Messages
      </h1>

      {/* Filter + Search */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {["all", "pending", "replied"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type as any)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filter === type
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}

        <input
          type="text"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Messages Table */}
      <div className="bg-white shadow-lg rounded-lg p-6 overflow-x-auto">
        {filteredMessages.length === 0 ? (
          <p className="text-gray-500">No messages found.</p>
        ) : (
          <table className="w-full border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-700 text-sm">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Message</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.map((msg) => {
                const isUnread = !msg.status || msg.status === "Pending";
                return (
                  <tr
                    key={msg.id}
                    className={`border-t hover:bg-gray-50 transition ${
                      isUnread ? "bg-blue-50 font-semibold" : ""
                    }`}
                  >
                    <td className="p-3">{msg.name}</td>
                    <td className="p-3">{msg.email}</td>
                    <td className="p-3">{msg.subject}</td>
                    <td className="p-3 max-w-xs">
                      <p className="truncate max-w-[200px]">{msg.message}</p>
                      <button
                        onClick={() => handleViewMessage(msg)}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        View
                      </button>
                    </td>
                    <td className="p-3">
                      {msg.createdAt?.toDate
                        ? msg.createdAt.toDate().toLocaleString()
                        : "—"}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          msg.status === "Replied"
                            ? "bg-green-100 text-green-700"
                            : msg.status === "Read"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {msg.status || "Pending"}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => setReplying(msg)}
                        className="px-4 py-1 text-sm font-medium rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-md transition"
                      >
                        Reply
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* View Message Modal */}
      {viewingMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[500px] max-h-[80vh] overflow-y-auto p-6 animate-fadeIn">
            <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Message from {viewingMessage.name}
            </h2>
            <p className="text-gray-600 mb-2">
              <strong>Email:</strong> {viewingMessage.email}
            </p>
            <p className="text-gray-800 whitespace-pre-line leading-relaxed">
              {viewingMessage.message}
            </p>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setViewingMessage(null)}
                className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {replying && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[500px] p-6 animate-fadeIn">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Reply to {replying.name}
            </h2>
            <textarea
              className="w-full border rounded-lg p-3 mb-4 focus:ring-2 focus:ring-blue-500"
              rows={5}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply here..."
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setReplying(null)}
                className="px-5 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={sendReply}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg"
              >
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
