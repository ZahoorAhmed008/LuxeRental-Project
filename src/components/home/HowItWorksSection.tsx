import React from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Truck, RotateCcw } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Browse & Select Outfit',
    description: 'Explore our curated collection and find the perfect outfit for your event'
  },
  {
    icon: Calendar,
    title: 'Choose Rental Period',
    description: 'Select your rental dates and duration based on your event schedule'
  },
  {
    icon: Truck,
    title: 'Get Outfit Delivered',
    description: 'Receive your outfit cleaned, pressed, and ready to wear at your doorstep'
  },
  {
    icon: RotateCcw,
    title: 'Return on Time',
    description: 'Return the outfit after your event or pay a small fine if returned late'
  }
];

const HowItWorksSection = () => {
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
            How <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">It Works</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Simple, hassle-free process to rent your dream outfit in just four easy steps
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              className="relative group bg-white/70 backdrop-blur-xl border border-gray-200 
                         rounded-2xl p-8 shadow-sm hover:shadow-2xl transition-all duration-300 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Icon same as Policies */}
              <div className="absolute -top-7 left-1/2 -translate-x-1/2">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-500 
                                flex items-center justify-center shadow-md group-hover:scale-110 transition">
                  <step.icon className="h-7 w-7 text-white" />
                </div>
              </div>

              <h3 className="mt-12 text-xl font-bold text-gray-900">{step.title}</h3>
              <p className="mt-4 text-gray-600 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
