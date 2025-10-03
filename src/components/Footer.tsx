import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Instagram, Facebook, Twitter, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
           <Link to="/" className="flex items-center space-x-2 mb-4">
  <Crown className="h-8 w-8 text-blue-600 group-hover:text-purple-600 transition-colors duration-300" />
  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
    LuxeRental
  </span>
</Link>

            <p className="text-gray-300 mb-6 max-w-md">
              Rent designer outfits for your special events. Look your best without spending a fortune on wedding and event wear.
            </p>
            <div className="flex space-x-4">
              <Instagram className="h-6 w-6 text-gray-300 hover:text-white cursor-pointer transition-colors duration-200" />
              <Facebook className="h-6 w-6 text-gray-300 hover:text-white cursor-pointer transition-colors duration-200" />
              <Twitter className="h-6 w-6 text-gray-300 hover:text-white cursor-pointer transition-colors duration-200" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Browse Collection
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/policies" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Rental Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-amber-600" />
                <span className="text-gray-300">luxerental08@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-amber-600" />
                <span className="text-gray-300">+923010822243</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2025 LuxeRental. All rights reserved. Making luxury fashion accessible to everyone.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;