import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { db, storage, auth } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { onAuthStateChanged, signOut } from "firebase/auth";

// Reusable Button Component
const Button = ({ children, primary = true, className = "", ...props }) => (
  <button
    className={`px-6 py-3 rounded-full font-semibold shadow-md transition-all cursor-pointer duration-300 ${
      primary
        ? "bg-blue-500 text-white hover:bg-blue-600"
        : "bg-red-500 text-white hover:bg-red-600"
    } ${className}`}
    {...props}
  >
    {children}
  </button>
);

// Collapsible Section Component
const CollapsibleSection = ({ title, items, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left bg-gray-200 p-4 rounded-lg font-semibold text-gray-800 hover:bg-gray-300 transition-all duration-300"
      >
        {title} ({items.length})
        <span className="float-right">{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="mt-2 bg-white rounded-lg shadow-lg p-4"
        >
          {items.length > 0 ? (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      {item.title || item.name}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {item.date
                        ? new Date(item.date).toLocaleDateString()
                        : item.role || ""}
                    </p>
                  </div>
                  <Button primary={false} onClick={() => onDelete(item)}>
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No items available.</p>
          )}
        </motion.div>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [leadership, setLeadership] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Optionally redirect or show a message
      console.log("User signed out successfully.");
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  // Check authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/adminlogin");
      }
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [navigate]);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch Blogs
        const blogsRef = collection(db, "blogs");
        const blogsSnapshot = await getDocs(blogsRef);
        const blogData = blogsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogs(blogData);

        // Fetch Leadership (assuming a "leadership" collection)
        const leadershipRef = collection(db, "leadership");
        const leadershipSnapshot = await getDocs(leadershipRef);
        const leadershipData = leadershipSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLeadership(leadershipData);

        // Fetch Testimonials (assuming a "testimonials" collection)
        const testRef = collection(db, "testimonials");
        const testSnapshot = await getDocs(testRef);
        const testData = testSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTestimonials(testData);

        // Fetch Programs
        const programsRef = collection(db, "programs");
        const programsSnapshot = await getDocs(programsRef);
        const programData = programsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPrograms(programData);
      } catch (err) {
        setError("Failed to fetch data: " + err.message);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Delete item handler
  const handleDelete = async (item) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${item.title || item.name}"?`
      )
    ) {
      return;
    }

    try {
      setLoading(true);

      // Delete from Firestore
      await deleteDoc(doc(db, item.collection, item.id));

      // Delete associated image from Storage if it exists
      if (item.imageUrl) {
        const imageRef = ref(storage, item.imageUrl);
        await deleteObject(imageRef).catch((err) => {
          console.warn("Image not found in Storage:", err);
        });
      }

      // Update state
      if (item.collection === "blogs") {
        setBlogs(blogs.filter((b) => b.id !== item.id));
      } else if (item.collection === "leadership") {
        setLeadership(leadership.filter((l) => l.id !== item.id));
      } else if (item.collection === "testimonials") {
        setTestimonials(testimonials.filter((l) => l.id !== item.id));
      } else if (item.collection === "programs") {
        setPrograms(programs.filter((p) => p.id !== item.id));
      }
    } catch (err) {
      setError("Failed to delete item: " + err.message);
      console.error("Delete error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null; // Redirect handled by useEffect
  }

  return (
    <div className="w-full overflow-hidden">
      {/* Breadcrumb Section */}
      <motion.div
        className="relative h-64 sm:h-80 bg-cover bg-center text-white flex items-center justify-center"
        style={{ backgroundImage: "url('/images/admin-bg.jpg')" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            Admin Dashboard
          </h1>
        </div>
      </motion.div>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6">
            Manage Content
          </h2>
          {loading && <p className="text-center text-gray-600">Loading...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          {/* Collapsible Sections */}
          <CollapsibleSection
            title="Blog Posts"
            items={blogs.map((b) => ({ ...b, collection: "blogs" }))}
            onDelete={handleDelete}
          />
          <CollapsibleSection
            title="Leadership"
            items={leadership.map((l) => ({ ...l, collection: "leadership" }))}
            onDelete={handleDelete}
          />
          <CollapsibleSection
            title="testimonials"
            items={testimonials.map((l) => ({
              ...l,
              collection: "testimonials",
            }))}
            onDelete={handleDelete}
          />
          <CollapsibleSection
            title="Programs"
            items={programs.map((p) => ({ ...p, collection: "programs" }))}
            onDelete={handleDelete}
          />
        </motion.div>
      </section>
      <div className=" mx-auto max-w-xl px-6  mb-8 bg-none text-center  grid grid-cols-2 gap-6 justify-center items-center">
        <Link
          to="/addPost"
          className="p-4 max-w-3xl bg-blue-500 text-white rounded-lg shadow-lg whitespace-nowrap"
        >
          Add Blog Post
        </Link>
        <Link
          to="/addLeaders"
          className="p-4 max-w-3xl bg-blue-500 text-white rounded-lg shadow-lg whitespace-nowrap"
        >
          Add Leaders
        </Link>
        <Link
          to="/addProgram"
          className="p-4 max-w-3xl bg-blue-500 text-white rounded-lg shadow-lg whitespace-nowrap"
        >
          Add Projects
        </Link>
        <Link
          to="/addTestimonial"
          className="p-4 max-w-3xl bg-blue-500 text-white rounded-lg shadow-lg whitespace-nowrap"
        >
          Add Testimonials
        </Link>
      </div>
      <div className="text-center mt-10">
        <button
          onClick={handleSignOut}
          className="px-6 mb-8 cursor-pointer py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold transition duration-300 shadow-md"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
