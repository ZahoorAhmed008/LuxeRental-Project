import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, MessageCircle, Send, ChevronDown } from "lucide-react";

// 🔹 Firestore imports
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase"; // make sure firebase.ts is already configured

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  // 🔹 Updated handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "contacts"), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      alert("✅ Your message has been sent!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("❌ Failed to send message. Please try again.");
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      content: "luxerental08@gmail.com",
      description: "Send us an email anytime!",
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+923010822243",
      description: "Mon-Fri 9AM-6PM",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      content: "123 MUET, Software Department",
      description: "Our showroom & office",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      content: "Chat with our team",
      description: "Available 24/7",
    },
  ];

  const faqs = [
    {
      question: "How far in advance should I book?",
      answer:
        "We recommend booking at least 1-2 weeks in advance for popular items, especially during peak seasons like weddings or holidays.",
    },
    {
      question: "What if the outfit doesn't fit?",
      answer:
        "We offer free size exchanges if the item doesn’t fit properly. Contact us immediately upon delivery for a quick replacement.",
    },
    {
      question: "How do you ensure cleanliness?",
      answer:
        "Every item is professionally cleaned and inspected between rentals. We use eco-friendly cleaning methods and maintain the highest hygiene standards.",
    },
    {
      question: "What happens if I damage the item?",
      answer:
        "Minor wear and tear is expected and covered. For significant damage, repair costs will be deducted from your security deposit.",
    },
  ];

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
         <motion.h1 
                              className="text-4xl md:text-6xl font-bold text-white mb-6"
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.8 }}
                            >
                              Get in <span className="text-amber-400">Touch</span>
                            </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Have questions about rentals, sizing, or need style advice? We’re
            here to make your special occasion perfect.
          </motion.p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              className="p-6 rounded-2xl bg-white/70 backdrop-blur-lg border border-gray-200 shadow-md hover:shadow-xl text-center transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <info.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {info.title}
              </h3>
              <p className="text-blue-700 font-medium">{info.content}</p>
              <p className="text-gray-500 text-sm mt-1">{info.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Send us <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Message</span>
          </h2>
            <p className="text-lg text-gray-600">
              Fill out the form below and we’ll get back to you within 24 hours
            </p>
          </motion.div>

          <motion.div
            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-gray-200"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <input
                type="text"
                placeholder="Subject"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
              />

              <textarea
                rows={6}
                placeholder="Tell us more about your inquiry..."
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              ></textarea>

              <div className="text-center">
                <button
                  type="submit"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl  hover:opacity-90 text-white font-semibold rounded-xl shadow-md transition duration-200"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Send Message
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
           <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
           Frequently <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Asked Questions</span>
          </h2>
            <p className="text-lg text-gray-600">
              Quick answers to common questions
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-xl p-6 shadow-md cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                onClick={() =>
                  setOpenFAQ(openFAQ === index ? null : index)
                }
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-500 transform transition-transform ${
                      openFAQ === index ? "rotate-180" : ""
                    }`}
                  />
                </div>
                {openFAQ === index && (
                  <p className="mt-3 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
