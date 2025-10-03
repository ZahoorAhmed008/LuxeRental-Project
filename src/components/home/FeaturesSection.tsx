import React from 'react';
import { motion } from 'framer-motion';
import { Shirt, DollarSign, Package, Clock } from 'lucide-react';

const features = [
  {
    icon: Shirt,
    title: 'Wide Variety of Outfits',
    description: 'From traditional wear to designer gowns, find the perfect outfit for any occasion'
  },
  {
    icon: DollarSign,
    title: 'Affordable Rental Prices',
    description: 'Wear luxury fashion without the luxury price tag. Save up to 90% compared to buying'
  },
  {
    icon: Package,
    title: 'Easy Booking & Returns',
    description: 'Simple online booking process with convenient pickup and return options'
  },
  {
    icon: Clock,
    title: 'Transparent Fine Policy',
    description: 'Clear and fair late return policy. No hidden fees, just transparent pricing'
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">LuxeRental?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We make luxury fashion accessible with our premium rental service and customer-first approach
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
