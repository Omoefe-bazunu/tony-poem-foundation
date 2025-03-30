import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

// Reusable Button Component (consistent with your Home component)
const Button = ({ children, primary = true, className = "", ...props }) => (
  <button
    className={`px-6 py-3 rounded-full font-semibold shadow-md transition-all cursor-pointer duration-300 ${
      primary
        ? "bg-blue-500 text-white hover:bg-blue-600"
        : "bg-white text-blue-500 hover:bg-gray-200"
    } ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      console.log("Logged in:", userCredential.user);
      setSuccess(true);
      setTimeout(() => navigate("/"), 1500); // Redirect after 1.5s
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="w-full overflow-hidden">
      {/* Breadcrumb Section */}
      <motion.div
        className="relative h-64 sm:h-80 bg-cover bg-center text-white flex items-center justify-center"
        style={{ backgroundImage: "url('/images/login-bg.jpg')" }} // Use a relevant background
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            Login
          </h1>
        </div>
      </motion.div>

      {/* Login Form */}
      <section className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="bg-white rounded-lg shadow-lg p-6"
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6">
            Sign In
          </h2>
          {success ? (
            <p className="text-green-600 text-lg text-center">
              Login successful! Redirecting...
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 shadow-md"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 shadow-md"
                  placeholder="Enter your password"
                />
              </div>

              {/* Error Message */}
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className={`w-full ${
                  loading ? "bg-gray-400 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          )}

          {/* Register Link */}
          {!success && (
            <p className="mt-4 text-center text-gray-600">
              Don’t have an account?{" "}
              <Link to="/register" className="text-blue-500 hover:underline">
                Register
              </Link>
            </p>
          )}
        </motion.div>
      </section>
    </div>
  );
};

export default Login;
