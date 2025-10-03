import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Users, Award, Linkedin, Github } from 'lucide-react';

const AboutPage = () => {
  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'Making luxury fashion accessible and affordable for everyone, regardless of budget or occasion.'
    },
    {
      icon: Eye,
      title: 'Our Vision',
      description: 'Creating a world where you can wear luxury without owning it, promoting sustainable fashion choices.'
    },
    {
      icon: Users,
      title: 'Our Community',
      description: 'Building a community of fashion-conscious individuals who value quality, style, and sustainability.'
    },
    {
      icon: Award,
      title: 'Our Promise',
      description: 'Delivering exceptional quality, service, and experience with every rental interaction.'
    }
  ];

  const teamMembers = [
    {
      name: 'Zahoor Ahmed',
      role: 'Founder & CEO',
      image: '/team/zahoor-ahmed.png',
      linkedin: 'https://linkedin.com/in/zahoorahmed',
      github: 'https://github.com/zahoorahmed'
    },
    {
      name: 'Mudassir Ali',
      role: 'Founder & CEO',
      image: '/team/zahoor-ahmed.png',
      linkedin: 'https://linkedin.com/in/zahoorali',
      github: 'https://github.com/zahoorali'
    },
    {
      name: 'Basit Ali',
      role: 'Founder & CEO',
      image: '/team/zahoor-ahmed.png',
      linkedin: 'https://linkedin.com/in/ogahizahoor',
      github: 'https://github.com/ogahizahoor'
    },
    {
      name: 'Sachal Khan',
      role: 'Founder & CEO',
      image: '/team/zahoor-ahmed.png',
      linkedin: 'https://linkedin.com/in/ogahizahoor',
      github: 'https://github.com/ogahizahoor'
    }
  ];

  return (
    <div className="pt-16 min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/19292843/pexels-photo-19292843.jpeg)'
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            About <span className="text-amber-400">LuxeRental</span>
          </motion.h1>
          <motion.p 
            className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            We believe that everyone deserves to look and feel their best on special occasions, without the hefty price tag that comes with luxury fashion.
          </motion.p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Story</span>
          </h2>
            <div className="prose prose-lg mx-auto text-gray-600">
              <p className="text-xl leading-relaxed mb-6">
                LuxeRental was born from a simple realization: why should you spend thousands of dollars on an outfit you'll wear once? Our founders experienced this dilemma firsthand when preparing for a wedding, spending more on attire than seemed reasonable for a single event.
              </p>
              <p className="text-xl leading-relaxed mb-6">
                We saw an opportunity to revolutionize the fashion industry by making luxury accessible through rentals. Our platform connects fashion-conscious individuals with designer outfits for a fraction of the purchase price, making every special occasion truly special.
              </p>
              <p className="text-xl leading-relaxed">
                Today, we're proud to serve thousands of customers who trust us for their most important moments. From weddings to galas, from business meetings to cultural celebrations, LuxeRental ensures you always look your absolute best.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Values</span>
          </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core principles guide everything we do at LuxeRental
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {values.map((value, index) => (
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
                    <value.icon className="h-7 w-7 text-white" />
                  </div>
                </div>

                <h3 className="mt-10 text-2xl font-bold text-gray-900">{value.title}</h3>
                <p className="mt-4 text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
             <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Meet <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Our Team</span>
          </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate individuals behind LuxeRental's success
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="relative group bg-white/70 backdrop-blur-xl border border-gray-200 
                           rounded-2xl p-8 shadow-sm hover:shadow-2xl transition-all duration-300 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Profile Image */}
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                  />
                </div>

                <div className="mt-10">
                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                  <p className="text-gray-600 mb-4">{member.role}</p>

                  {/* Social Links */}
                  <div className="flex justify-center gap-4">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition"
                    >
                      <Linkedin className="w-5 h-5 text-blue-700" />
                    </a>
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                    >
                      <Github className="w-5 h-5 text-gray-700" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
