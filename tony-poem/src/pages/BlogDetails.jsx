import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  limit,
} from "firebase/firestore";
import LoadingSpinner from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const postRef = doc(db, "blogs", id);
        const postSnapshot = await getDoc(postRef);

        if (!postSnapshot.exists()) {
          setError("Blog post not found");
          navigate("/blog", { replace: true });
          return;
        }

        const postData = postSnapshot.data();
        setPost({
          id: postSnapshot.id,
          ...postData,
          title: postData.title || "Untitled Post",
          imageUrl: postData.imageUrl || "/default-blog.jpg",
          content: postData.content || "No content available.",
          date: postData.date || new Date(),
        });

        if (postData.topic) {
          const postsRef = collection(db, "blogs");
          const relatedQuery = query(
            postsRef,
            where("topic", "==", postData.topic),
            where("__name__", "!=", id),
            limit(3)
          );
          const relatedSnapshot = await getDocs(relatedQuery);

          const related = relatedSnapshot.docs.map((doc) => ({
            id: doc.id,
            title: doc.data().title || "Untitled Post",
            imageUrl: doc.data().imageUrl || "/default-blog.jpg",
            date: doc.data().date || new Date(),
          }));

          setRelatedPosts(related);
        }
      } catch (err) {
        console.error("Error fetching blog post:", err);
        setError("Failed to load blog post. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const formatDate = (date) => {
    if (!date) return "No date";
    try {
      if (date instanceof Object && "toDate" in date) {
        return date.toDate().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
      return new Date(date).toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (error)
    return (
      <ErrorMessage message={error} onRetry={() => window.location.reload()} />
    );
  if (!post) return <ErrorMessage message="No blog post data available" />;

  return (
    <div className="w-full overflow-hidden">
      {/* Breadcrumb Section */}
      <motion.div
        className="relative h-64 sm:h-80 bg-cover bg-center text-white flex items-center justify-center"
        style={{ backgroundImage: `url('${post.imageUrl}')` }} // Fixed path
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-black/80"></div>
        <div className="relative text-center">
          <h1 className="text-2xl sm:text-5xl md:text-3xl font-bold mb-4">
            {post.title}
          </h1>
        </div>
      </motion.div>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="bg-white rounded-lg shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "/default-blog.jpg";
            }}
          />

          <div className="p-6 sm:p-8">
            <p className="text-gray-500 mb-4">{formatDate(post.date)}</p>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {post.tags?.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.div
            className="mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold mb-6 pb-2 border-b border-gray-200">
              Related Posts
            </h3>

            <div className="grid gap-6 md:grid-cols-3">
              {relatedPosts.map((post) => (
                <motion.div
                  key={post.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  whileHover={{ y: -5 }}
                >
                  <Link to={`/blog/${post.id}`}>
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-40 object-cover"
                      onError={(e) => {
                        e.target.src = "/default-blog.jpg";
                      }}
                    />
                    <div className="p-4">
                      <h4 className="font-semibold text-lg mb-2 line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-gray-500 text-sm">
                        {formatDate(post.date)}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Back to Blog Link */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            to="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to All Posts
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default BlogDetails;
