import React, { useState } from "react";
import { motion } from "framer-motion";
import { db, storage } from "../firebase"; // Adjust path to your firebase config
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const CreateProgram = () => {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    description: "",
    images: [], // Array for multiple image files
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle multiple image file changes
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, images: files }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Upload images to Firebase Storage and get URLs
      const imageUrls = await Promise.all(
        formData.images.map(async (image) => {
          const storageRef = ref(
            storage,
            `program-images/${image.name}-${Date.now()}`
          );
          await uploadBytes(storageRef, image);
          return getDownloadURL(storageRef);
        })
      );

      // Add program to Firestore
      const programsRef = collection(db, "programs");
      await addDoc(programsRef, {
        name: formData.name,
        date: formData.date,
        description: formData.description,
        images: imageUrls, // Store array of image URLs
        slug: `/programs/${formData.name.toLowerCase().replace(/\s+/g, "-")}`,
        createdAt: new Date().toISOString(),
      });

      setSuccess(true);
      setFormData({ name: "", date: "", description: "", images: [] }); // Reset form
    } catch (err) {
      setError("Failed to create program. Please try again.");
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
    <div className="w-full overflow-hidden">
      {/* Breadcrumb Section */}
      <motion.div
        className="relative h-64 sm:h-80 bg-cover bg-center text-white flex items-center justify-center"
        style={{ backgroundImage: "url('/images/progb.jpg')" }} // Matches Programs
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            Create Program
          </h1>
        </div>
      </motion.div>

      {/* Program Form */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="bg-white rounded-lg shadow-lg p-6"
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 text-center mb-6">
            Add a New Program
          </h2>
          {success ? (
            <p className="text-green-600 text-lg text-center">
              Program created successfully!
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Program Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 shadow-md"
                  placeholder="Enter program name"
                />
              </div>

              {/* Date */}
              <div>
                <label
                  htmlFor="date"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 shadow-md"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 shadow-md"
                  placeholder="Brief description of the program"
                />
              </div>

              {/* Images */}
              <div>
                <label
                  htmlFor="images"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Program Images (Carousel)
                </label>
                <input
                  type="file"
                  id="images"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:bg-gray-100 shadow-md"
                />
                {formData.images.length > 0 && (
                  <p className="mt-2 text-sm text-gray-500">
                    Selected:{" "}
                    {formData.images.map((img) => img.name).join(", ")}
                  </p>
                )}
              </div>

              {/* Status Messages */}
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
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
                {loading ? "Saving..." : "Create Program"}
              </button>
            </form>
          )}
        </motion.div>
      </section>
    </div>
  );
};

export default CreateProgram;
