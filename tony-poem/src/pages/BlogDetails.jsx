import React, { useState, useEffect, lazy, Suspense, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import styles from "../components/BlogContent.module.css";
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

// Lazy load heavy components
const MotionDiv = lazy(() =>
  import("framer-motion").then((mod) => ({ default: mod.motion.div }))
);

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoized date formatter
  const formatDate = useCallback((date) => {
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
  }, []);

  // Fetch blog post and related posts
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

  if (loading) return <LoadingSpinner fullPage />;
  if (error)
    return (
      <ErrorMessage message={error} onRetry={() => window.location.reload()} />
    );
  if (!post) return <ErrorMessage message="No blog post data available" />;

  return (
    <div className="w-full overflow-hidden">
      {/* Breadcrumb Section */}
      <Suspense fallback={<div className="h-64 sm:h-80 bg-gray-200" />}>
        <MotionDiv
          className="relative h-64 sm:h-80 bg-cover bg-center text-white flex items-center justify-center"
          style={{ backgroundImage: `url('${post.imageUrl}')` }}
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
        </MotionDiv>
      </Suspense>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Suspense
          fallback={<div className="bg-white rounded-lg shadow-lg p-8" />}
        >
          <MotionDiv
            className="bg-white rounded-lg shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={post.imageUrl}
              alt={post.title}
              loading="lazy"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/default-blog.jpg";
              }}
            />

            <div className="p-6 sm:p-8">
              <p className="text-gray-500 mb-4">{formatDate(post.date)}</p>
              <div
                className={`prose whitespace-pre-wrap max-w-none ${styles.blogContent}`}
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
          </MotionDiv>
        </Suspense>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <Suspense fallback={<div className="mt-16" />}>
            <MotionDiv
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
                  <MotionDiv
                    key={post.id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    whileHover={{ y: -5 }}
                  >
                    <Link to={`/blog/${post.id}`}>
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        loading="lazy"
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
                  </MotionDiv>
                ))}
              </div>
            </MotionDiv>
          </Suspense>
        )}

        {/* Back to Blog Link */}
        <Suspense fallback={<div className="mt-12 text-center" />}>
          <MotionDiv
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
          </MotionDiv>
        </Suspense>
      </section>
    </div>
  );
};

export default React.memo(BlogDetails);
