import React, {
  useState,
  useEffect,
  lazy,
  Suspense,
  useMemo,
  useCallback,
} from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import LoadingSpinner from "../components/Loading";

// Lazy load heavy components
const MotionDiv = lazy(() =>
  import("framer-motion").then((mod) => ({ default: mod.motion.div }))
);

const Blog = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [selectedDate, setSelectedDate] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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

  // Memoized unique topics and years
  const { topics, years } = useMemo(() => {
    const uniqueTopics = [
      "All",
      ...new Set(allPosts.map((post) => post.topic || "Uncategorized")),
    ];
    const uniqueYears = [
      "All",
      ...new Set(
        allPosts.map((post) =>
          post.date ? new Date(post.date).getFullYear().toString() : "Unknown"
        )
      ),
    ];
    return { topics: uniqueTopics, years: uniqueYears };
  }, [allPosts]);

  // Filter and search posts
  useEffect(() => {
    const filterPosts = () => {
      let result = [...allPosts];

      if (selectedTopic !== "All") {
        result = result.filter(
          (post) => (post.topic || "Uncategorized") === selectedTopic
        );
      }

      if (selectedDate !== "All") {
        result = result.filter((post) =>
          post.date
            ? new Date(post.date).getFullYear().toString() === selectedDate
            : false
        );
      }

      if (searchQuery) {
        result = result.filter((post) =>
          (post.title || "").toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setFilteredPosts(result);
      setCurrentPage(1);
    };

    filterPosts();
  }, [selectedTopic, selectedDate, searchQuery, allPosts]);

  // Memoized pagination calculations
  const { currentPosts, totalPages } = useMemo(() => {
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    return {
      currentPosts: filteredPosts.slice(indexOfFirstPost, indexOfLastPost),
      totalPages: Math.ceil(filteredPosts.length / postsPerPage),
    };
  }, [currentPage, filteredPosts, postsPerPage]);

  // Memoized filter handlers
  const handleSearchChange = useCallback(
    (e) => setSearchQuery(e.target.value),
    []
  );
  const handleTopicChange = useCallback(
    (e) => setSelectedTopic(e.target.value),
    []
  );
  const handleDateChange = useCallback(
    (e) => setSelectedDate(e.target.value),
    []
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full overflow-hidden">
      {/* Breadcrumb Section */}
      <Suspense fallback={<div className="h-64 sm:h-80 bg-gray-200" />}>
        <MotionDiv
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
        </MotionDiv>
      </Suspense>

      {/* Blog Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 text-center mb-10">
          Latest Insights
        </h2>

        {error ? (
          <p className="text-center text-red-500 text-lg">{error}</p>
        ) : (
          <>
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row justify-center items-center mb-8 space-y-6 sm:space-y-0 sm:space-x-6">
              <div className="w-full sm:w-auto">
                <label
                  htmlFor="search"
                  className="block text-gray-700 font-medium mb-2 contact-form"
                >
                  Search Posts
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search posts..."
                  className="w-full sm:w-48 px-4 py-3 darktheme border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
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
                  onChange={handleTopicChange}
                  className="w-full sm:w-48 px-4 py-3 darktheme border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
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
                  onChange={handleDateChange}
                  className="w-full sm:w-48 px-4 py-3 darktheme border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
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
                  <Suspense
                    key={post.id}
                    fallback={
                      <div className="bg-white rounded-lg shadow-md h-full" />
                    }
                  >
                    <MotionDiv
                      className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 h-full"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <img
                        src={post.imageUrl || "/images/default-blog.jpg"}
                        alt={post.title || "Blog Post"}
                        loading="lazy"
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-xl font-semibold text-gray-800 uppercase">
                          {post.title || "Untitled"}
                        </h3>
                        <p className="text-gray-500 text-sm mt-1">
                          {post.date
                            ? new Date(post.date).toLocaleDateString()
                            : "No date"}
                        </p>
                        <div
                          className="prose max-w-none flex-grow darktheme"
                          dangerouslySetInnerHTML={{
                            __html: `${post.content.slice(0, 200)}...`,
                          }}
                        />
                        <Link
                          to={`/blog/${post.id}`}
                          className="mt-4 inline-block w-fit px-6 py-2 bg-blue-500 text-white font-semibold rounded-full shadow-md hover:bg-blue-600 transition-all duration-300"
                        >
                          Read More
                        </Link>
                      </div>
                    </MotionDiv>
                  </Suspense>
                ))}
              </div>
            )}

            {/* Pagination */}
            {filteredPosts.length > postsPerPage && (
              <div className="mt-10 flex justify-center items-center space-x-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="px-6 py-2 bg-blue-500 text-white darktheme font-semibold rounded-full shadow-md disabled:opacity-50 hover:bg-blue-600 transition-all duration-300"
                >
                  Prev
                </button>
                <span className="text-gray-700 text-lg">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="px-6 py-2 bg-blue-500 text-white darktheme font-semibold rounded-full shadow-md disabled:opacity-50 hover:bg-blue-600 transition-all duration-300"
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

export default React.memo(Blog);
