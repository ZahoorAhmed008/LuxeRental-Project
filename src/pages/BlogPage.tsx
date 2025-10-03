import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, User } from "lucide-react";

const BlogPage = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Top 5 Outfits to Wear at a Wedding",
      excerpt:
        "Discover the perfect wedding guest outfits that will make you look stunning while respecting the dress code.",
      image:
        "https://filhaal.co.uk/cdn/shop/articles/Pakistani_Eid_Clothing_Collection_002e6c3a-8959-45ba-beff-e6b4061a51bc.png?v=1742959117&width=1780",
      author: "Babar Azam",
      date: "2025-01-15",
      readTime: "5 min read",
      category: "Wedding Fashion",
      externalUrl: "https://askanigroup.com/blog/pakistani-women-wedding-dress/",
    },
    {
      id: 2,
      title: "Why Renting Clothes Saves You Money",
      excerpt:
        "Learn how fashion rentals can save you thousands of dollars while keeping your wardrobe fresh and sustainable.",
      image:
        "https://profit.pakistantoday.com.pk/wp-content/uploads/2022/01/IMG_1927_700x-696x974.jpg",
      author: "Babar Azam",
      date: "2025-01-12",
      readTime: "4 min read",
      category: "Fashion Tips",
      externalUrl: "https://unhiddenclothing.com/blogs/blog/5-reasons-why-renting-clothes-should-be-your-favourite-new-way-to-shop-in-2024?srsltid=AfmBOor1vpkTIwFLUZDRZ7azytXTwliLRej6ls81XvOOhSNXCk97P944",
    },
    {
      id: 3,
      title: "Fashion Tips for Grooms & Bridesmaids",
      excerpt:
        "Essential style advice for wedding parties to look coordinated and elegant on the big day and while keeping your wardrobe fresh.",
      image:
        "https://www.blog.shadiyana.pk/wp-content/uploads/2025/01/c5e96736f2a79e77aec68416faec2570.jpg",
      author: "Babar Azam",
      date: "2025-01-10",
      readTime: "6 min read",
      category: "Wedding Fashion",
      externalUrl: "https://www.thetiebar.com/blogs/news/how-to-match-bridesmaids-and-groomsmen-the-ultimate-wedding-attire-guide?srsltid=AfmBOoogk4ST3jGdrPYNglHcBbbCNb0fbpHjLNZFN7WuxbnURSrTFBsS",
    },
  ];

  const categories = [
    "All",
    "Wedding Fashion",
    "Fashion Tips",
    "Sustainability",
    "Formal Wear",
    "Cultural Fashion",
  ];

  const [selectedCategory, setSelectedCategory] = React.useState("All");

  const filteredPosts =
    selectedCategory === "All"
      ? blogPosts
      : blogPosts.filter((post) => post.category === selectedCategory);

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://filhaal.co.uk/cdn/shop/articles/Pakistani_Eid_Clothing_Collection_002e6c3a-8959-45ba-beff-e6b4061a51bc.png?v=1742959117&width=1780"
            alt="fashion banner"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.h1 
                                       className="text-4xl md:text-6xl font-bold text-white mb-6"
                                       initial={{ opacity: 0, y: 30 }}
                                       animate={{ opacity: 1, y: 0 }}
                                       transition={{ duration: 0.8 }}
                                     >
                                       Fashion <span className="text-amber-400">& Style Blog</span>
                                     </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Expert fashion advice, styling tips, and insider insights to help
            you look your absolute best for every occasion.
          </motion.p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                className="rounded-2xl p-[2px] bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg hover:shadow-xl transition"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="bg-white rounded-2xl overflow-hidden">
                  {/* Image */}
                  <div className="relative">
                    <a
                      href={post.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
  src={post.image}
  alt={post.title}
  className="w-full h-52 object-cover object-top hover:scale-105 transition-transform duration-500"
/>

                    </a>
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md">
                      {post.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <User className="h-4 w-4 mr-1" />
                      <span className="mr-4">{post.author}</span>
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{post.readTime}</span>
                    </div>

                    <h2 className="text-xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-pink-500 transition-all duration-300">
                      <a
                        href={post.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {post.title}
                      </a>
                    </h2>

                    <p className="text-gray-600 leading-relaxed mb-4">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">
                        {new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <a
                        href={post.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:underline"
                      >
                        Read More →
                      </a>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
