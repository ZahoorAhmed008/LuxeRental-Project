import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, DollarSign, Package } from 'lucide-react';

const PoliciesPage = () => {
  const policies = [
    {
      icon: DollarSign,
      title: 'Rental Pricing',
      content: [
        'Daily rental rates vary by item and designer brand',
        'Extended rentals (5+ days) receive progressive discounts',
        'Security deposits are fully refundable upon item return',
        'All prices include professional cleaning and maintenance'
      ]
    },
    {
      icon: Clock,
      title: 'Late Return Policy',
      content: [
        'Grace period: 4 hours past scheduled return time',
        'Late fee: Rs. 1000 per day for the first 2 days',
        'After 3 days: Rs. 2000 per day until item is returned',
        'Items not returned within 14 days will be charged full retail value'
      ]
    },
    {
      icon: Package,
      title: 'Damage & Loss Policy',
      content: [
        'Minor wear and tear is expected and covered',
        'Stains, tears, or damage will incur cleaning/repair fees',
        'Lost or irreparably damaged items charged at full retail value',
        'All items are photographed before and after rental'
      ]
    },
    {
      icon: Shield,
      title: 'Hygiene & Cleaning',
      content: [
        'All items professionally cleaned between rentals',
        'Eco-friendly cleaning solutions used exclusively',
        'Items inspected for quality and cleanliness before dispatch',
        'Health and safety protocols exceed industry standards'
      ]
    }
  ];

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h1 
                     className="text-4xl md:text-6xl font-bold text-white mb-6"
                     initial={{ opacity: 0, y: 30 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.8 }}
                   >
                     Rental <span className="text-amber-400">Policies & Terms</span>
                   </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-white max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Clear, transparent policies to ensure the best rental experience for everyone.
          </motion.p>
        </div>
      </section>

      {/* Policies Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
          {policies.map((policy, index) => (
            <motion.div 
              key={index}
              className="relative group bg-white/70 backdrop-blur-xl border border-gray-200 
                         rounded-2xl p-8 shadow-sm hover:shadow-2xl transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Icon */}
              <div className="absolute -top-7 left-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-500 
                                flex items-center justify-center shadow-md group-hover:scale-110 transition">
                  <policy.icon className="h-7 w-7 text-white" />
                </div>
              </div>

              <h3 className="mt-10 text-2xl font-bold text-gray-900">{policy.title}</h3>

              <ul className="mt-6 space-y-3">
                {policy.content.map((item, itemIndex) => (
                  <li 
                    key={itemIndex} 
                    className="flex items-start space-x-3 text-gray-700"
                  >
                    <span className="w-2 h-2 mt-2 rounded-full bg-blue-600"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Additional Terms */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
           <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Addtional Terms
          </h2>
          </motion.div>

          <motion.div 
            className="bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="space-y-8 text-gray-700">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Booking & Cancellation</h3>
                <p>Bookings can be cancelled up to 48 hours before the rental date for a full refund. Cancellations within 48 hours are subject to a 50% fee. Same-day cancellations forfeit the entire rental fee.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Size & Fit Guarantee</h3>
                <p>We provide detailed sizing charts and measurements for all items. If an item doesn't fit properly upon delivery, we'll exchange it for a better size at no additional cost, subject to availability.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Delivery & Returns</h3>
                <p>Free delivery and pickup within major metropolitan areas. Items must be returned in the original garment bag with all accessories. A prepaid return label is provided for your convenience.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Privacy & Data Protection</h3>
                <p>We take your privacy seriously and follow strict data protection protocols. Personal information is never shared with third parties and is used solely to enhance your rental experience.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PoliciesPage;
