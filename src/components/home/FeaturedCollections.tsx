import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const collections = [
  {
    title: 'Bridal Wear',
    image: 'https://www.nameerabyfarooq.com/cdn/shop/files/ZincRedKameezLehengaforPakistaniBridalDresses_900x.jpg?v=1683300571',
    description: 'Bridal gowns and wedding outfits'
  },
  {
    title: 'Textured Cotton',
    image: 'https://blog.g3fashion.com/wp-content/uploads/2024/08/floral_printed_cream_silk_sharara_suit_1710847563as2931547-768x1024.webp',
    description: 'Business attire and formal wear'
  },
  {
    title: 'Casual Dresses',
    image: 'https://www.stylesgap.com/wp-content/uploads/2018/09/ALKARAM-Pakistani-Fashion-Latest-Women-Best-Winter-Dresses-2019-2020-Designs-1.jpg',
    description: 'Cocktail and party outfits'
  },
  {
    title: 'Traditional Wear',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNpTP8P3EASYz522We-3UsY0ZtRLUTYBRCNg&s',
    description: 'Cultural and traditional attire'
  },
  {
    title: 'Groom Wear',
    image: 'https://nameerabridal.com/wp-content/uploads/2025/02/12.webp',
    description: 'Suits and formal groom wear'
  },
  {
    title: 'Cast and Crew Mens',
    image: 'https://janan.com/cdn/shop/files/30727_r15_1__3.webp?v=1756394893&width=1080',
    description: 'Designer Groom collections'
  }
];

const FeaturedCollections = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Featured <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Collection</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our carefully curated collections for every special occasion and event
          </p>
        </motion.div>

        {/* Collection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <motion.div
              key={index}
              className="group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="relative overflow-hidden">
               <img
  src={collection.image}
  alt={collection.title}
  className={`w-full h-80 object-cover object-top group-hover:scale-110 transition-transform duration-500 ${
    collection.title === "Bride Specials" || collection.title === "Wedding Wear"
      ? "object-top"
      : "object-center"
  }`}
/>

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold mb-1">{collection.title}</h3>
                  <p className="text-gray-200">{collection.description}</p>
                </div>
              </div>
              <div className="p-6 bg-white">
                <Link
                  to="/shop"
                  className="inline-flex items-center text-blue-700 font-semibold hover:text-blue-800 transition-colors duration-200"
                >
                  Shop Collection
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;
