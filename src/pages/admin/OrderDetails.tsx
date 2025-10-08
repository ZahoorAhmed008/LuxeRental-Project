import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import {
  ArrowLeft,
  CalendarDays,
  Mail,
  Phone,
  MapPin,
  Home,
  User,
  AlertTriangle,
} from "lucide-react";
import { Order } from "../../context/OrderContext";

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!id) return;

    const ref = doc(db, "orders", id);
    const unsubscribe = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setOrder({ id: snap.id, ...snap.data() } as Order);
      }
    });

    return () => unsubscribe();
  }, [id]);

  // ✅ Fine calculation logic (same as profile)
  const calculateFine = (order: Order): number => {
    if (
      order.status !== "Accepted" ||
      !order.rentalEndDate ||
      isNaN(new Date(order.rentalEndDate).getTime())
    ) {
      return 0;
    }

    const now = new Date();
    const end = new Date(order.rentalEndDate);
    if (now <= end) return 0;

    const diffDays = Math.floor(
      (now.getTime() - end.getTime()) / (1000 * 60 * 60 * 24)
    );

    let fine = 0;
    if (diffDays === 1 || diffDays === 2) {
      fine = diffDays * 1000;
    } else if (diffDays > 2 && diffDays <= 14) {
      fine = diffDays * 2000;
    } else if (diffDays > 14) {
      fine = order.productPrice*20;
    }

    return fine;
  };

  if (!order) {
    return (
      <div className="p-4 text-center text-gray-500 animate-pulse">
        Loading order details...
      </div>
    );
  }

  const fineAmount =
    order.fineAmount !== undefined ? order.fineAmount : calculateFine(order);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-4 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="bg-white shadow-md rounded-xl p-5">
        {order.productImage && (
          <div className="flex justify-center mb-3">
            <div className="p-[1.5px] rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
              <img
                src={order.productImage}
                alt={order.productTitle}
                className="w-40 h-52 object-contain rounded-md bg-white"
              />
            </div>
          </div>
        )}

        <h2 className="text-xl font-bold text-center mb-5 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {order.productTitle}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 text-sm">
          <DetailItem icon={<User />} label="Customer" value={order.customer} />
          <DetailItem icon={<Mail />} label="Email" value={order.email} />
          <DetailItem icon={<Phone />} label="Mobile" value={order.mobile} />
          <DetailItem icon={<MapPin />} label="City" value={order.city} />
          <DetailItem icon={<Home />} label="Postal" value={order.postal} />
          <DetailItem icon={<Home />} label="Address" value={order.address} />

          {order.rentalStartDate && (
            <DetailItem
              icon={<CalendarDays className="text-blue-600" />}
              label="Rental Start"
              value={order.rentalStartDate}
            />
          )}
          {order.rentalEndDate && (
            <DetailItem
              icon={<CalendarDays className="text-purple-600" />}
              label="Rental End"
              value={order.rentalEndDate}
            />
          )}

          <DetailItem label="Duration" value={order.duration} />

          <DetailItem
            label="Status"
            value={
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  order.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : order.status === "Accepted"
                    ? "bg-blue-100 text-blue-700"
                    : order.status.includes("Return")
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {order.status}
              </span>
            }
          />

          <DetailItem label="Payment" value={order.paymentMethod} />
          <DetailItem
            label="Total Price"
            value={
              <span className="font-semibold text-green-600">
                Rs. {order.productPrice}
              </span>
            }
          />

          {/* ✅ Fine section */}
          <DetailItem
            label="Fine"
            value={
              fineAmount > 0 ? (
                <span className="text-red-600 font-semibold flex items-center gap-1 bg-red-50 px-2 py-0.5 rounded-md">
                  <AlertTriangle className="w-4 h-4" /> Rs. {fineAmount}
                </span>
              ) : (
                <span className="text-green-600 font-semibold">No Fine</span>
              )
            }
          />
        </div>
      </div>
    </div>
  );
};

// ✅ Reusable item component (smaller, compact UI)
const DetailItem = ({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-start gap-2 bg-gray-50 px-3 py-2 rounded-lg shadow-sm">
    {icon && <span className="text-gray-600">{icon}</span>}
    <div className="flex-1">
      <p className="text-[12px] font-semibold text-gray-600">{label}</p>
      <p className="text-[13px] text-gray-800">{value}</p>
    </div>
  </div>
);

export default OrderDetails;
