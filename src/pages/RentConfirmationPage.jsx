import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useOrders } from "../context/OrderContext";

const RentConfirmationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addOrder } = useOrders();

  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    city: "",
    postal: "",
    address: "",
    days: "",
    payment: "",
    rentalStartDate: "",
    agree: false,
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [rentalEndDate, setRentalEndDate] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [daysError, setDaysError] = useState("");

  // ✅ Fetch Product from Firestore
  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      const ref = doc(db, "products", id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setProduct({ id: snap.id, ...snap.data() });
      } else {
        setProduct(null);
      }
    };
    fetchProduct();
  }, [id]);

  // ✅ Auto-fill user info
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.displayName || "",
        email: user.email || "",
      }));
    }
  }, []);

  // ✅ Price + End Date
  useEffect(() => {
    if (!product) return;
    const days = Number(formData.days) || 0;

    if (days > 14) {
      setDaysError("❌ You cannot rent for more than 14 days.");
    } else {
      setDaysError("");
    }

    setTotalPrice(product.price * days);

    if (formData.rentalStartDate && days > 0 && days <= 14) {
      const startDate = new Date(formData.rentalStartDate);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + days);
      setRentalEndDate(endDate.toISOString().split("T")[0]);
    } else {
      setRentalEndDate("");
    }
  }, [formData.days, formData.rentalStartDate, product]);

  if (!product) {
    return (
      <div className="pt-16 text-center text-red-600 text-lg">
        Product not found
      </div>
    );
  }

  // ✅ Handle Form Inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleScreenshotChange = (e) => {
    if (e.target.files[0]) {
      setScreenshot(e.target.files[0]);
    }
  };

  // ✅ Convert file to Base64
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // ✅ Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      alert("Please login to continue.");
      return;
    }

    if (Number(formData.days) > 14) {
      alert("You cannot rent for more than 14 days.");
      return;
    }

    if (!formData.agree) {
      alert("You must agree to the rental policies before proceeding.");
      return;
    }

    try {
      let screenshotBase64 = null;

      if (formData.payment === "Card") {
        if (!screenshot) {
          alert("Please upload a payment screenshot for card payments.");
          return;
        }

        screenshotBase64 = await getBase64(screenshot);
        if (!screenshotBase64) {
          alert("Error reading screenshot. Please re-upload.");
          return;
        }
      }

      const orderData = {
        userId: user.uid,
        customer: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        city: formData.city,
        postal: formData.postal,
        address: formData.address,
        duration: `${formData.days} Days`,
        rentalStartDate: formData.rentalStartDate,
        rentalEndDate,
        status: "Pending",
        productId: product.id,
        productTitle: product.title,
        productPrice: totalPrice,
        productImage: product.image || "",
        paymentMethod: formData.payment,
        paymentScreenshot: screenshotBase64 || null,
        createdAt: new Date().toISOString(),
      };

      await addOrder(orderData);

      alert("✅ Rental request sent! Waiting for admin approval.");
      navigate("/profile");
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("❌ Something went wrong while submitting your order.");
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 pb-12 space-y-8">
        <h1 className="text-3xl font-bold mb-4">Confirm Your Rental</h1>

        <div className="bg-white p-6 rounded-xl shadow">
          {/* 🔹 Product Preview */}
          {product.image && (
            <div className="mb-6">
              <div className="relative w-full h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl flex items-center justify-center overflow-hidden shadow">
                <img
                  src={product.image}
                  alt={product.title}
                  className="max-h-56 object-contain transition-transform duration-300 hover:scale-105"
                />
              </div>
            </div>
          )}

          {/* 🔹 Product Info */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {product.title}
            </h2>
            <p className="text-gray-600 mt-2">
              Price per day:{" "}
              <span className="font-bold text-blue-600">
                Rs. {product.price}
                
              </span>
            </p>
            <p className="text-lg text-gray-900 font-semibold mt-1">
              Total Price:{" "}
              <span className="text-green-600">Rs. {totalPrice}</span>
            </p>
          </div>

          {/* 🔹 Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded bg-gray-100"
              readOnly
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded bg-gray-100"
              readOnly
            />

            <input
              type="tel"
              name="mobile"
              placeholder="Mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded"
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded"
            />
            <input
              type="text"
              name="postal"
              placeholder="Postal Code"
              value={formData.postal}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded"
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded"
            />

            <input
              type="number"
              name="days"
              placeholder="Number of Days"
              value={formData.days}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded"
              min="1"
              max="14"
            />
            {daysError && (
              <p className="text-red-500 text-sm mt-1">{daysError}</p>
            )}

            <input
              type="date"
              name="rentalStartDate"
              value={formData.rentalStartDate}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded"
            />

            {rentalEndDate && (
              <input
                type="text"
                value={`End Date: ${rentalEndDate}`}
                readOnly
                className="w-full border p-3 rounded bg-gray-100 font-medium text-gray-700"
              />
            )}

            <select
              name="payment"
              value={formData.payment}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded"
            >
              <option value="">Select payment</option>
              <option>Cash</option>
              <option>Card</option>
            </select>

            {formData.payment === "Card" && (
              <div>
                <label className="block mb-2 font-medium">
                  Upload Payment Screenshot
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshotChange}
                  className="w-full border p-3 rounded"
                />
              </div>
            )}

            <div className="bg-gray-100 p-4 rounded border">
              <h3 className="font-semibold mb-2">Rental Policy</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Grace period: 4 hours past scheduled return time</li>
                <li>Late fee: Rs. 1000 per day for the first 2 days.</li>
                <li>After 3 days: Rs. 2000 per day until item is returned</li>
                <li>
                  Items not returned within 14 days will be charged full retail value
                </li>
                <li>Customers are not required to wash the clothes before returning</li>
              </ul>

              <label className="flex items-center mt-3">
                <input
                  type="checkbox"
                  checked={formData.agree}
                  onChange={(e) =>
                    setFormData({ ...formData, agree: e.target.checked })
                  }
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">
                  I have read and agree to the rental policies.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={!formData.agree || !!daysError}
              className={`w-full p-3 rounded-lg text-white ${
                formData.agree && !daysError
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Confirm Rental
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RentConfirmationPage;
