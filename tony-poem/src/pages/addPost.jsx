import React, { useState } from "react";
import { motion } from "framer-motion";
import { db, storage } from "../firebase"; // Adjust path to your firebase config
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const CreateBlogPost = () => {
  const [formData, setFormData] = useState({
    title: "",
    topic: "",
    image: null, // Separate image field
  });
  const [content, setContent] = useState(""); // Separate state for editor content
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Initialize TipTap editor with limited features (no image or lists)
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false, // Disable bullet lists
        orderedList: false, // Disable ordered lists
        image: false, // Disable image extension
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML()); // Update content state
    },
  });

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editor) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      let imageUrl = "";
      if (formData.image) {
        // Upload image to Firebase Storage
        const storageRef = ref(
          storage,
          `blogs/${formData.image.name}-${Date.now()}`
        );
        await uploadBytes(storageRef, formData.image);
        imageUrl = await getDownloadURL(storageRef);
      }

      // Add blog post to Firestore
      const blogsRef = collection(db, "blogs");
      await addDoc(blogsRef, {
        title: formData.title,
        topic: formData.topic,
        content, // Editor content
        imageUrl, // Separate image URL
        date: new Date().toISOString(),
        slug: `/blog/${formData.title.toLowerCase().replace(/\s+/g, "-")}`,
      });

      setSuccess(true);
      setFormData({ title: "", topic: "", image: null });
      setContent("");
      editor.commands.clearContent(); // Clear editor
    } catch (err) {
      setError("Failed to create blog post. Please try again.");
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
        style={{ backgroundImage: "url('/blogb.jpg')" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 ">
            Create Blog Post
          </h1>
        </div>
      </motion.div>

      {/* Blog Post Form */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center darktheme">
            Write a New Post
          </h2>
          {success ? (
            <p className="text-green-600 text-lg text-center">
              Blog post created successfully!
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-gray-700 font-medium mb-2"
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
                  disabled={loading}
                  className="w-full px-4 py-3 border darktheme border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  placeholder="Enter blog post title"
                />
              </div>

              {/* Topic */}
              <div>
                <label
                  htmlFor="topic"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Topic
                </label>
                <select
                  id="topic"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border darktheme border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                >
                  <option value="">Select a topic</option>
                  <option value="Youth">Youth</option>
                  <option value="Skills">Skills</option>
                  <option value="Entrepreneurship">Entrepreneurship</option>
                  <option value="Leadership">Leadership</option>
                </select>
              </div>

              {/* Image Upload */}
              <div>
                <label
                  htmlFor="image"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Featured Image
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={loading}
                  className="w-full px-4 py-3 border darktheme border-gray-300 rounded-lg text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:bg-gray-100"
                />
                {formData.image && (
                  <p className="mt-2 text-sm text-gray-500">
                    Selected: {formData.image.name}
                  </p>
                )}
              </div>

              {/* Content */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Content
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <div className="p-2 bg-gray-100 flex space-x-2">
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleBold().run()}
                      disabled={loading || !editor?.can().toggleBold()}
                      className="px-2 py-1 text-sm font-semibold text-gray-700  bg-white rounded hover:bg-gray-200 disabled:opacity-50"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        editor?.chain().focus().toggleItalic().run()
                      }
                      disabled={loading || !editor?.can().toggleItalic()}
                      className="px-2 py-1 text-sm font-semibold text-gray-700 bg-white rounded hover:bg-gray-200 disabled:opacity-50"
                    >
                      I
                    </button>
                  </div>
                  <EditorContent
                    editor={editor}
                    className="p-4 min-h-[200px] bg-white focus:outline-blue-400 px-4 darktheme"
                  />
                </div>
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
                {loading ? "Saving..." : "Create Post"}
              </button>
            </form>
          )}
        </motion.div>
      </section>
    </div>
  );
};

export default CreateBlogPost;
