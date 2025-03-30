import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { db } from "../firebase"; // Adjust path to your firebase config
import { collection, getDocs } from "firebase/firestore";

const Blog = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [selectedDate, setSelectedDate] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Add error state
  const postsPerPage = 3;

  // Fetch blog posts from Firestore
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const blogsRef = collection(db, "blogs");
        const querySnapshot = await getDocs(blogsRef);
        const posts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Fetched posts:", posts); // Debug fetched data
        setAllPosts(posts);
        setFilteredPosts(posts);
      } catch (err) {
        setError("Failed to fetch blog posts. Please try again later.");
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Unique topics and years for filters
  const topics = [
    "All",
    ...new Set(allPosts.map((post) => post.topic || "Uncategorized")),
  ];
  const years = [
    "All",
    ...new Set(
      allPosts.map((post) =>
        post.date ? new Date(post.date).getFullYear().toString() : "Unknown"
      )
    ),
  ];

  // Filter and search posts
  useEffect(() => {
    let result = [...allPosts];

    // Apply topic filter
    if (selectedTopic !== "All") {
      result = result.filter(
        (post) => (post.topic || "Uncategorized") === selectedTopic
      );
    }

    // Apply date filter
    if (selectedDate !== "All") {
      result = result.filter((post) =>
        post.date
          ? new Date(post.date).getFullYear().toString() === selectedDate
          : false
      );
    }

    // Apply search filter
    if (searchQuery) {
      result = result.filter((post) =>
        (post.title || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPosts(result);
    setCurrentPage(1); // Reset to first page
  }, [selectedTopic, selectedDate, searchQuery, allPosts]);

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
        style={{ backgroundImage: "url('/images/blogb.jpg')" }} // Fixed path
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

        {/* Loading/Error States */}
        {loading ? (
          <p className="text-center text-gray-600 text-lg">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500 text-lg">{error}</p>
        ) : (
          <>
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row justify-center items-center mb-8 space-y-6 sm:space-y-0 sm:space-x-6">
              <div className="w-full sm:w-auto">
                <label
                  htmlFor="search"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Search Posts
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search posts..."
                  className="w-full sm:w-48 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
                />
              </div>
              <div className="w-full sm:w-auto">
                <label
                  htmlFor="topic"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Filter by Topic
                </label>
                <select
                  id="topic"
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full sm:w-48 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
                >
                  {topics.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full sm:w-auto">
                <label
                  htmlFor="year"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Filter by Year
                </label>
                <select
                  id="year"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full sm:w-48 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
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
              <p className="text-center text-gray-600 text-lg">
                No posts match your filters or search.
              </p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <img
                      src={post.imageUrl || "/images/default-blog.jpg"}
                      alt={post.title || "Blog Post"}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {post.title || "Untitled"}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1">
                        {post.date
                          ? new Date(post.date).toLocaleDateString()
                          : "No date"}
                      </p>
                      <p className="text-gray-600 mt-2 flex-grow">
                        {post.excerpt || "No excerpt available."}
                      </p>
                      <Link
                        to={`/blog/${post.id}`}
                        className="mt-4 inline-block w-fit px-6 py-2 bg-blue-500 text-white font-semibold rounded-full shadow-md hover:bg-blue-600 transition-all duration-300"
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
                  className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-full shadow-md disabled:opacity-50 hover:bg-blue-600 transition-all duration-300"
                >
                  Prev
                </button>
                <span className="text-gray-700 text-lg">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-full shadow-md disabled:opacity-50 hover:bg-blue-600 transition-all duration-300"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Blog;
