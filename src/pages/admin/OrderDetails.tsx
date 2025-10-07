import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  ArrowLeft,
  CalendarDays,
  Mail,
  Phone,
  MapPin,
  Home,
  User,
  X,
  AlertTriangle,
} from "lucide-react";
import { Order } from "../../context/OrderContext";

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        const ref = doc(db, "orders", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setOrder({ id: snap.id, ...snap.data() } as Order);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    fetchOrder();
  }, [id]);

  if (!order) {
    return <div className="p-6 text-red-600">Loading order...</div>;
  }

  // ✅ Fine Calculation
  const calculateFine = (): number => {
    if (
      order.status !== "Accepted" ||
      !order.rentalEndDate ||
      isNaN(new Date(order.rentalEndDate).getTime())
    ) {
      return 0;
    }

    const today = new Date();
    const end = new Date(order.rentalEndDate);
    if (today > end) {
      const diffDays = Math.floor(
        (today.getTime() - end.getTime()) / (1000 * 60 * 60 * 24)
      );
      return diffDays * 500;
    }
    return 0;
  };

  const fine = calculateFine();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden p-6">
        {order.productImage && (
          <div className="flex justify-center mb-4">
            <div className="p-[2px] rounded-xl bg-gradient-to-r from-blue-600 to-purple-600">
              <img
                src={order.productImage}
                alt={order.productTitle}
                className="w-52 h-64 object-contain rounded-lg shadow bg-white"
              />
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {order.productTitle}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
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
                className={`px-3 py-1 rounded-full text-sm font-medium ${
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
              <span className="font-bold text-green-600">
                Rs. {order.productPrice}
              </span>
            }
          />

          {/* ✅ Fine Section */}
          {fine > 0 && (
            <DetailItem
              label="Fine"
              value={
                <span className="text-red-600 font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Rs. {fine}
                </span>
              }
            />
          )}
        </div>

        {order.paymentScreenshot && (
          <div className="mt-6 text-center">
            <h3 className="text-gray-700 font-semibold mb-2">
              Payment Screenshot
            </h3>
            <div className="p-[2px] rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 inline-block">
              <img
                src={order.paymentScreenshot}
                alt="Payment Screenshot"
                onClick={() => setShowImage(true)}
                className="w-full sm:w-80 h-60 object-contain rounded-lg shadow bg-white cursor-pointer hover:scale-105 transition"
              />
            </div>
          </div>
        )}
      </div>

      {showImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <button
            onClick={() => setShowImage(false)}
            className="absolute top-6 right-6 text-white text-3xl"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={order.paymentScreenshot}
            alt="Full Screenshot"
            className="max-w-full max-h-[90vh] rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
};

const DetailItem = ({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-start gap-2 bg-gray-50 px-4 py-3 rounded-lg shadow-sm">
    {icon && <span className="text-gray-600">{icon}</span>}
    <div>
      <p className="text-sm font-semibold text-gray-600">{label}</p>
      <p className="text-gray-800">{value}</p>
    </div>
  </div>
);

export default OrderDetails;
