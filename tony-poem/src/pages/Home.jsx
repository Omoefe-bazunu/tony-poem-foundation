import { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { db } from "../firebase"; // Adjust path to your firebase config
import { collection, getDocs, query, limit, orderBy } from "firebase/firestore";

// Reusable Button Component
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

const Home = () => {
  const [isClient, setIsClient] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonial] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Fetch Blogs
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const blogsQuery = query(
          collection(db, "blogs"),
          orderBy("date", "desc"),
          limit(3) // Limit to 3 latest blogs
        );
        const querySnapshot = await getDocs(blogsQuery);
        const blogData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogs(blogData);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    // Fetch Programs (for Projects)
    const fetchPrograms = async () => {
      try {
        const programsQuery = query(
          collection(db, "programs"),
          limit(3) // Limit to 3 programs for carousel
        );
        const querySnapshot = await getDocs(programsQuery);
        const programData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          img: doc.data().images[0] || "abt.jpg", // Use first image
          title: doc.data().name,
          alt: `${doc.data().name} event`,
        }));
        setProjects(programData);
      } catch (err) {
        console.error("Error fetching programs:", err);
      }
    };

    // Fetch testimonials (for Projects)
    const fetchTestimonials = async () => {
      try {
        const testimonialQuery = query(collection(db, "testimonials"));
        const querySnapshot = await getDocs(testimonialQuery);
        const testimonialData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          img: doc.data().images[0] || "abt.jpg", // Use first image
          title: doc.data().name,
          alt: `${doc.data().name} event`,
        }));
        setTestimonial(testimonialData);
      } catch (err) {
        console.error("Error fetching programs:", err);
      }
    };

    fetchTestimonials();
    fetchBlogs();
    fetchPrograms();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  const impactStats = [
    { value: "500+", label: "Youth Impacted" },
    { value: "150+", label: "Volunteers" },
    { value: "50+", label: "Programs" },
  ];

  const partners = [
    { name: "Partner 1", logo: "parta.png" },
    { name: "Partner 2", logo: "PARTNER.png" },
  ];

  return (
    <div className="w-full overflow-hidden">
      {/* HERO SECTION */}
      <section
        className="text-center py-20 bg-blue-500 text-white mt-8 bg-cover bg-center"
        style={{ backgroundImage: `url('tbg.jpg')` }}
      >
        <motion.h1
          className="text-4xl sm:text-5xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Tony Poem Foundation
        </motion.h1>
        <p className="mt-4 lg:text-lg text-sm max-w-3xl mx-auto">
          Creating Opportunities for Youths in Africa
        </p>
        <Link to="/contact">
          <Button className="mt-6">Get Involved</Button>
        </Link>
      </section>

      {/* ABOUT US */}
      <section className="py-16 text-center bg-white">
        <h2 className="text-2xl sm:text-3xl font-semibold">About Us</h2>
        <p className="mt-4 text-gray-600 max-w-4xl mx-auto">
          Tony Poem Foundation is a worldwide therapy solutions NGO dedicated to
          youth empowerment, skill acquisition, and leadership development
          across Africa and beyond.
        </p>
        <div className="mt-10 flex flex-wrap gap-6 justify-center">
          <motion.img
            src="abt.jpg"
            alt="Team collaboration"
            className="w-48 h-64 object-cover rounded-lg shadow-lg"
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          />
          <motion.img
            src="abt3.jpg"
            alt="Youth training session"
            className="w-48 h-64 object-cover rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          />
        </div>
        <Link to="/about">
          <Button className="mt-8">Learn More</Button>
        </Link>
      </section>

      {/* OUR PROJECTS (CAROUSEL) */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center">
          Our Projects
        </h2>
        {loading ? (
          <p className="text-center text-gray-600 mt-8">Loading projects...</p>
        ) : isClient && projects.length > 0 ? (
          <Slider {...sliderSettings} className="mt-8">
            {projects.map((project) => (
              <div key={project.id} className="p-4">
                <img
                  src={project.img}
                  alt={project.alt}
                  className="w-full h-64 object-cover rounded-lg shadow-lg"
                />
                <h3 className="text-lg font-semibold text-center mt-4">
                  {project.title}
                </h3>
              </div>
            ))}
          </Slider>
        ) : (
          <p className="text-center text-gray-600 mt-8">
            No projects available.
          </p>
        )}
        <Link to="/programs">
          <Button className="mx-auto mt-10 block">See More</Button>
        </Link>
      </section>

      {/* IMPACT STATS */}
      <section
        className="py-16 bg-blue-50 text-center bg-cover bg-center"
        style={{ backgroundImage: `url('impact.jpg')` }}
      >
        <h2 className="text-2xl sm:text-3xl font-semibold text-white">
          Our Impact
        </h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          {impactStats.map((stat, index) => (
            <motion.div
              key={index}
              className="p-6"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <p className="text-4xl font-bold text-white">{stat.value}</p>
              <p className="mt-2 text-white">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 bg-white text-center px-6 lg:px-12">
        <h2 className="text-2xl sm:text-3xl font-semibold">What People Say</h2>
        {loading ? (
          <p className="text-center text-gray-600 mt-8">Loading projects...</p>
        ) : isClient && projects.length > 0 ? (
          <Slider {...sliderSettings} className="mt-8 max-w-lg mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-6 bg-gray-500 flex flex-col justify-center items-center rounded-lg shadow-md"
              >
                <img
                  src=""
                  alt="author's image"
                  className="bg-contain w-24 h-24 bg-gray-600 mx-auto rounded-full mb-2"
                />
                <p className="text-white italic">"{testimonial.text}"</p>
                <h4 className="mt-2 font-semibold text-white">
                  - {testimonial.author}
                </h4>
              </div>
            ))}
          </Slider>
        ) : (
          <p className="text-center text-gray-600 mt-8">
            No testimonials available.
          </p>
        )}
      </section>

      {/* BLOG POSTS */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center">
          Latest Blog Posts
        </h2>
        {loading ? (
          <p className="text-center text-gray-600 mt-8">Loading blogs...</p>
        ) : blogs.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 px-6 lg:px-12">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="p-6 border border-blue-300 flex flex-col rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold">{blog.title}</h3>
                <p className="text-gray-500 text-sm mt-2 flex-grow">
                  {new Date(blog.date).toLocaleDateString()}
                </p>
                <Link to={`/blog/${blog.id}`}>
                  <p className="mt-4 text-blue-500 cursor-pointer">Read More</p>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 mt-8">
            No blog posts available.
          </p>
        )}
        <Link to="/blog">
          <Button className="mx-auto mt-10 block">See All</Button>
        </Link>
      </section>

      {/* PARTNERS/SPONSORS */}
      <section className="py-16 text-center bg-white">
        <h2 className="text-2xl sm:text-3xl font-semibold">Our Partners</h2>
        <div className="mt-8 h-full flex flex-wrap gap-10 justify-center">
          {partners.map((partner, index) => (
            <img
              key={index}
              src={partner.logo}
              alt={`${partner.name} logo`}
              className="h-full object-contain w-30 lg:w-48"
            />
          ))}
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section
        className="py-20 bg-blue-500 text-white text-center bg-cover bg-center"
        style={{ backgroundImage: `url('join.jpg')` }}
      >
        <h2 className="text-2xl sm:text-3xl font-semibold">Join Our Mission</h2>
        <p className="mt-4 max-w-2xl mx-auto">
          Help us empower the young and bright futures through donations,
          volunteering, or spreading the word.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center px-12">
          <Button>Donate Now</Button>
          <Button primary={false}>Volunteer</Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
