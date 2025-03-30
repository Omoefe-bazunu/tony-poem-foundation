import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { db } from "../firebase"; // Adjust path to your firebase config
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const BlogDetails = () => {
  const { id } = useParams(); // Get blog ID from URL (previously slug)
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch blog post and related posts
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch the specific post by ID
        const postRef = doc(db, "blogs", id);
        const postSnapshot = await getDoc(postRef);

        console.log("ID queried:", id); // Debug ID
        console.log("Doc exists:", postSnapshot.exists()); // Debug result

        if (!postSnapshot.exists()) {
          setError("Blog post not found. Please check the URL.");
          setLoading(false);
          return;
        }

        const postData = postSnapshot.data();
        const postId = postSnapshot.id;
        console.log("Post data:", postData); // Debug post data
        setPost({ id: postId, ...postData });

        // Fetch related posts (same topic, exclude current post by ID)
        const postsRef = collection(db, "blogs");
        const relatedQuery = query(
          postsRef,
          where("topic", "==", postData.topic),
          where("__name__", "!=", id) // Use document ID field (__name__)
        );
        const relatedSnapshot = await getDocs(relatedQuery);
        const related = relatedSnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .slice(0, 3); // Limit to 3 related posts
        console.log("Related posts:", related); // Debug related posts
        setRelatedPosts(related);
      } catch (err) {
        setError("Failed to load blog post. Please try again later.");
        console.error("Error fetching post:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // Handle Firestore Timestamp for date
  const formatDate = (date) => {
    if (date instanceof Object && "toDate" in date) {
      // Firestore Timestamp
      return date.toDate().toLocaleDateString();
    }
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="w-full overflow-hidden">
      {/* Breadcrumb Section */}
      <motion.div
        className="relative h-64 sm:h-80 bg-cover bg-center text-white flex items-center justify-center"
        style={{ backgroundImage: "url('/images/blogb.jpg')" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            {post ? post.title : "Blog Details"}
          </h1>
        </div>
      </motion.div>

      {/* Blog Post Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <p className="text-center text-gray-600 text-lg">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500 text-lg">{error}</p>
        ) : post ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Main Post Content */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <img
                src={post.imageUrl || "/images/default-blog.jpg"}
                alt={post.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                {post.title}
              </h2>
              <p className="text-gray-500 text-sm mb-4">
                {formatDate(post.date)}
              </p>
              <div
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: post.content || "No content available.",
                }}
              />
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-12">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
                  Related Posts
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {relatedPosts.map((related) => (
                    <motion.div
                      key={related.id}
                      className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <img
                        src={related.imageUrl || "/images/default-blog.jpg"}
                        alt={related.title}
                        className="w-full h-40 object-cover rounded-t-lg"
                      />
                      <div className="p-4">
                        <h4 className="text-lg font-semibold text-gray-800">
                          {related.title}
                        </h4>
                        <p className="text-gray-500 text-sm mt-1">
                          {formatDate(related.date)}
                        </p>
                        <Link
                          to={`/blog/${related.id}`} // Use ID instead of slug
                          className="mt-2 inline-block px-4 py-1 bg-blue-500 text-white font-semibold rounded-full shadow-md hover:bg-blue-600 transition-all duration-300"
                        >
                          Read More
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <p className="text-center text-gray-600 text-lg">
            No blog post available.
          </p>
        )}
      </section>
    </div>
  );
};

export default BlogDetails;
