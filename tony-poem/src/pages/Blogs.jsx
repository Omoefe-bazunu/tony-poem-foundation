import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Sample blog data (replace with API/CMS data in production)
const blogPosts = [
  {
    id: 1,
    title: "The Future of African Youth",
    date: "2024-03-10",
    topic: "Youth",
    excerpt: "Exploring opportunities and challenges for the next generation.",
    slug: "/blog/future-african-youth",
    image: "/images/blog1.jpg",
  },
  {
    id: 2,
    title: "Impact of Skill Training in Africa",
    date: "2024-02-25",
    topic: "Skills",
    excerpt: "How vocational training is transforming lives.",
    slug: "/blog/skill-training-africa",
    image: "/images/blog2.jpg",
  },
  {
    id: 3,
    title: "Entrepreneurship: A Path to Empowerment",
    date: "2024-01-15",
    topic: "Entrepreneurship",
    excerpt: "Success stories from our bootcamp participants.",
    slug: "/blog/entrepreneurship-empowerment",
    image: "/images/blog3.jpg",
  },
  {
    id: 4,
    title: "Leadership in the Digital Age",
    date: "2023-12-20",
    topic: "Leadership",
    excerpt: "Preparing youth for modern leadership roles.",
    slug: "/blog/leadership-digital-age",
    image: "/images/blog4.jpg",
  },
];

const Blog = () => {
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [selectedDate, setSelectedDate] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;

  // Unique topics for filter
  const topics = ["All", ...new Set(blogPosts.map((post) => post.topic))];
  // Unique years for date filter
  const years = [
    "All",
    ...new Set(blogPosts.map((post) => post.date.slice(0, 4))),
  ];

  // Filter posts based on topic and date
  useEffect(() => {
    let result = blogPosts;
    if (selectedTopic !== "All") {
      result = result.filter((post) => post.topic === selectedTopic);
    }
    if (selectedDate !== "All") {
      result = result.filter((post) => post.date.startsWith(selectedDate));
    }
    setFilteredPosts(result);
    setCurrentPage(1); // Reset to first page on filter change
  }, [selectedTopic, selectedDate]);

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  return (
    <div className="w-full overflow-hidden">
      {/* Breadcrumb Section */}
      <motion.div
        className="relative h-64 sm:h-80 bg-cover bg-center text-white flex items-center justify-center"
        style={{ backgroundImage: "url('blogb.jpg')" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            Blog
          </h1>
        </div>
      </motion.div>

      {/* Blog Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 text-center mb-10">
          Latest Insights
        </h2>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0 sm:space-x-6">
          {/* Topic Filter */}
          <div className="w-full sm:w-auto">
            <label className="block text-gray-700 font-medium mb-2">
              Filter by Topic
            </label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="w-full sm:w-auto">
            <label className="block text-gray-700 font-medium mb-2">
              Filter by Year
            </label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Blog Posts */}
        {filteredPosts.length === 0 ? (
          <p className="text-center text-gray-600">
            No posts match your filters.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentPosts.map((post) => (
              <motion.div
                key={post.id}
                className=" flex flex-col border  border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-6 flex flex-col flex-grow ">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {new Date(post.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 mt-2 flex-grow">{post.excerpt}</p>
                  <Link
                    to={post.slug}
                    className="mt-4 px-4 py-2 w-fit bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 transition-all duration-300"
                  >
                    Read More
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredPosts.length > postsPerPage && (
          <div className="mt-10 flex justify-center items-center space-x-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded-full disabled:opacity-50 hover:bg-blue-600 transition-all duration-300"
            >
              Prev
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded-full disabled:opacity-50 hover:bg-blue-600 transition-all duration-300"
            >
              Next
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Blog;
