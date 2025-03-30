import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa"; // WhatsApp icon
import { db } from "../firebase"; // Adjust path to your firebase config
import { collection, addDoc } from "firebase/firestore";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSubmitted(false);

    try {
      // Add form data to Firestore
      const contactsRef = collection(db, "contacts");
      await addDoc(contactsRef, {
        ...formData,
        submittedAt: new Date().toISOString(),
      });

      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" }); // Reset form
    } catch (err) {
      setError("Failed to send your message. Please try again.");
      console.error("Error adding document: ", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full overflow-hidden">
      {/* Breadcrumb Section */}
      <motion.div
        className="relative h-64 sm:h-80 bg-cover bg-center text-white flex items-center justify-center"
        style={{ backgroundImage: "url('customerb.jpg')" }} // Adjusted path
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            Contact Us
          </h1>
        </div>
      </motion.div>

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Send Us a Message
            </h2>
            {submitted ? (
              <p className="text-green-600 text-lg">
                Thank you for your message! We’ll get back to you soon.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    placeholder="Your Name"
                  />
                </div>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    placeholder="Your Email"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    placeholder="Your Message"
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full px-6 py-3 rounded-full font-semibold shadow-md transition-all duration-300 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </motion.div>

          {/* Contact Info & WhatsApp */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Contact Information
              </h2>
              <p className="text-gray-600">
                Have questions? Reach out to us directly!
              </p>
              <ul className="mt-4 space-y-4 text-gray-700">
                <li>
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:info@tonypoemfoundation.org"
                    className="hover:text-blue-600"
                  >
                    info@tonypoemfoundation.org
                  </a>
                </li>
                <li>
                  <strong>Phone:</strong>{" "}
                  <a href="tel:+2347048194180" className="hover:text-blue-600">
                    +234 704 819 4180
                  </a>
                </li>
                <li>
                  <strong>Address:</strong> 123 Hope Street, Lagos, Nigeria
                </li>
              </ul>
            </div>

            {/* WhatsApp Option */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Or Chat with Us on WhatsApp
              </h3>
              <p className="text-gray-600 mb-4">
                Prefer a quick chat? Message us on WhatsApp!
              </p>
              <a
                href="https://wa.me/2347048194180"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-green-500 text-white font-semibold rounded-full shadow-md hover:bg-green-600 transition-all duration-300"
              >
                <FaWhatsapp className="mr-2" size={20} />
                Contact via WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
