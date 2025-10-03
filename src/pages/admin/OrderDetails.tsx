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
} from "lucide-react";

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      const ref = doc(db, "orders", id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setOrder({ id: snap.id, ...snap.data() });
      }
    };
    fetchOrder();
  }, [id]);

  if (!order) {
    return <div className="p-6 text-red-600">Loading order...</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Order Card */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden p-6">
        {/* Product Image with Gradient Border */}
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

        {/* Product Title with Gradient Text */}
        <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {order.productTitle}
        </h2>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
          <DetailItem icon={<User className="w-4 h-4" />} label="Customer" value={order.customer} />
          <DetailItem icon={<Mail className="w-4 h-4" />} label="Email" value={order.email} />
          <DetailItem icon={<Phone className="w-4 h-4" />} label="Mobile" value={order.mobile} />
          <DetailItem icon={<MapPin className="w-4 h-4" />} label="City" value={order.city} />
          <DetailItem icon={<Home className="w-4 h-4" />} label="Postal" value={order.postal} />
          <DetailItem icon={<Home className="w-4 h-4" />} label="Address" value={order.address} />

          {order.rentalStartDate && (
            <DetailItem
              icon={<CalendarDays className="w-4 h-4 text-blue-600" />}
              label="Rental Start"
              value={order.rentalStartDate}
            />
          )}

          {order.rentalEndDate && (
            <DetailItem
              icon={<CalendarDays className="w-4 h-4 text-purple-600" />}
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
                    : order.status === "Shipped"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {order.status}
              </span>
            }
          />
          <DetailItem label="Payment" value={order.paymentMethod} />
          <DetailItem
            label="Total Price"
            value={<span className="font-bold text-green-600">Rs. {order.productPrice}</span>}
          />
        </div>

        {/* Payment Screenshot with Gradient Border */}
        {order.paymentScreenshot && (
          <div className="mt-6 text-center">
            <h3 className="text-gray-700 font-semibold mb-2">Payment Screenshot</h3>
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

      {/* Fullscreen Modal for Image */}
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

// Reusable Detail Item
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
