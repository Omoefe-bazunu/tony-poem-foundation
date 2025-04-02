import React, { useState } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { motion } from "framer-motion";

const Donation = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    department: "",
    email: "",
    bio: "",
    image: null, // Added for file input
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

  // Handle image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      let imageUrl = "";
      if (formData.image) {
        // Upload image to Firebase Storage
        const storageRef = ref(
          storage,
          `donations/${formData.image.name}-${Date.now()}`
        );
        await uploadBytes(storageRef, formData.image);
        imageUrl = await getDownloadURL(storageRef);
      }

      // Add data to Firestore
      const donationsRef = collection(db, "donations");
      await addDoc(donationsRef, {
        name: formData.name,
        email: formData.email,
        imageUrl,
        createdAt: new Date().toISOString(),
      });

      setSuccess(true);
      // Reset form
      setFormData({
        name: "",
        email: "",
        image: null,
      });
    } catch (err) {
      setError("Failed to save donation data. Please try again.");
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
      className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-25 mb-18"
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6 darktheme">
        Make a Donation
      </h2>
      <p className=" max-w-3xl text-center mb-8 darktheme">
        Support our cause by making a donation. Any amount will be greatly
        appreciated
      </p>

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

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
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
            className="mt-1 block darktheme w-full p-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter email address"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700 darktheme"
          >
            Payment Receipt/Screenshot
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full darktheme p-3 border border-gray-300 rounded-md text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {formData.image && (
            <p className="mt-2 text-sm text-gray-500">
              Selected: {formData.image.name}
            </p>
          )}
        </div>

        {/* Status Messages */}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && (
          <p className="text-green-500 text-sm text-center">
            Thank you for supporting a noble cause
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
          {loading ? "Submiting..." : "Submit"}
        </button>
      </form>
    </motion.div>
  );
};

export default Donation;
