import React, { useState } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { motion } from "framer-motion";

const TestimonialForm = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    review: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Handle input changes for text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Add data to Firestore
      const testimonialRef = collection(db, "testimonials");
      await addDoc(testimonialRef, {
        name: formData.name,
        title: formData.title,
        review: formData.review,
        createdAt: new Date().toISOString(),
      });

      setSuccess(true);
      // Reset form
      setFormData({
        name: "",
        title: "",
        review: "",
      });
    } catch (err) {
      setError("Failed to save leadership data. Please try again.");
      console.error("Error adding document: ", err);
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
    <motion.div
      className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-25 mb-16"
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-2xl darktheme sm:text-3xl font-semibold text-center mb-6">
        Add Testimonial
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full darktheme rounded-md p-4 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter full name"
          />
        </div>

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full darktheme p-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., Resident, Asaba, Delta State"
          />
        </div>

        {/* Bio */}
        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700"
          >
            Brief Review/Short statement
          </label>
          <textarea
            id="review"
            name="review"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full darktheme p-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter the review or statement here"
          />
        </div>

        {/* Status Messages */}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && (
          <p className="text-green-500 text-sm text-center">
            Testimonials added successfully!
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full px-6 py-3 rounded-full font-semibold shadow-md transition-all duration-300 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {loading ? "Saving..." : "Add Testimonial"}
        </button>
      </form>
    </motion.div>
  );
};

export default TestimonialForm;
