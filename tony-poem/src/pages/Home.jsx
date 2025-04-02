import { useState, useEffect, Suspense, lazy } from "react";
import React from "react"; // Add this import for React.memo
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { db } from "../firebase"; // Adjust path to your firebase config
import { collection, getDocs, query, limit, orderBy } from "firebase/firestore";

// Lazy load the Slider component
const Slider = lazy(() => import("react-slick"));

// Import slick-carousel styles (client-side only)
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Reusable Button Component (Memoized for performance)
const Button = React.memo(
  ({ children, primary = true, className = "", ...props }) => (
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
  )
);

const Home = () => {
  const [isClient, setIsClient] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState({
    blogs: false,
    projects: false,
    testimonials: false,
  });

  useEffect(() => {
    setIsClient(true);

    // Fetch Blogs
    const fetchBlogs = async () => {
      setLoading((prev) => ({ ...prev, blogs: true }));
      try {
        const blogsQuery = query(
          collection(db, "blogs"),
          orderBy("date", "desc"),
          limit(3)
        );
        const querySnapshot = await getDocs(blogsQuery);
        const blogData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          date: doc.data().date,
          imageUrl: doc.data().imageUrl,
        }));
        setBlogs(blogData);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading((prev) => ({ ...prev, blogs: false }));
      }
    };

    // Fetch Programs (for Projects)
    const fetchPrograms = async () => {
      setLoading((prev) => ({ ...prev, projects: true }));
      try {
        const programsQuery = query(
          collection(db, "programs"),
          orderBy("date", "desc"),
          limit(3)
        );
        const querySnapshot = await getDocs(programsQuery);
        const programData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          img: doc.data().images?.[0] || "/images/abt.jpg",
          title: doc.data().name,
          alt: `${doc.data().name} event`,
          date: doc.data().date,
        }));
        setProjects(programData);
      } catch (err) {
        console.error("Error fetching programs:", err);
      } finally {
        setLoading((prev) => ({ ...prev, projects: false }));
      }
    };

    // Fetch Testimonials
    const fetchTestimonials = async () => {
      setLoading((prev) => ({ ...prev, testimonials: true }));
      try {
        const testimonialQuery = query(
          collection(db, "testimonials"),
          limit(5)
        );
        const querySnapshot = await getDocs(testimonialQuery);
        const testimonialData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          title: doc.data().title,
          review: doc.data().review,
        }));
        setTestimonials(testimonialData);
      } catch (err) {
        console.error("Error fetching testimonials:", err);
      } finally {
        setLoading((prev) => ({ ...prev, testimonials: false }));
      }
    };

    // Fetch data in parallel
    Promise.all([fetchBlogs(), fetchPrograms(), fetchTestimonials()]);
  }, []);

  const testimonialSliderSettings = {
    dots: true,
    infinite: testimonials.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: testimonials.length > 1,
    autoplaySpeed: 3000,
    arrows: true,
    centerMode: false,
    centerPadding: "0px",
    lazyLoad: "ondemand", // Enable lazy loading for slider images
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const impactStats = [
    { value: "500+", label: "Youth Impacted" },
    { value: "150+", label: "Volunteers" },
    { value: "50+", label: "Projects" },
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
        <h1 className="text-4xl sm:text-6xl font-bold">Tony Poem Foundation</h1>
        <p className="mt-4 lg:text-xl text-sm max-w-3xl mx-auto">
          Creating Opportunities for Youths in Africa
        </p>
        <Link to="/contact">
          <Button className="mt-6">Get Involved</Button>
        </Link>
      </section>

      {/* ABOUT US */}
      <section className="py-16 text-center bg-white">
        <h2 className="text-2xl sm:text-3xl font-semibold darktheme">
          About Us
        </h2>
        <p className="mt-4 text-gray-600 w-[80%] mx-auto">
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
            loading="lazy"
          />
          <motion.img
            src="abt3.jpg"
            alt="Youth training session"
            className="w-48 h-64 object-cover rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            loading="lazy"
          />
        </div>
        <Link to="/about">
          <Button className="mt-8">Learn More</Button>
        </Link>
      </section>

      {/* OUR PROJECTS (GRID) */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center darktheme">
          Our Projects
        </h2>
        {loading.projects ? (
          <p className="text-center text-gray-600 mt-8 darktheme">
            Loading projects...
          </p>
        ) : projects.length > 0 ? (
          <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-3 px-6 lg:px-12">
            {projects.map((project) => (
              <div key={project.id} className="p-4 flex flex-col items-center">
                <img
                  src={project.img}
                  alt={project.alt}
                  className="w-full h-64 object-cover rounded-lg shadow-lg border-4 border-white"
                  loading="lazy"
                />
                <h3 className="text-lg font-semibold text-center mt-4 darktheme">
                  {project.title}
                </h3>
              </div>
            ))}
          </div>
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
        <h2 className="text-2xl sm:text-3xl font-semibold darktheme">
          What People Say
        </h2>
        {loading.testimonials ? (
          <p className="text-center text-gray-600 mt-8 darktheme">
            Loading testimonials...
          </p>
        ) : isClient && testimonials.length > 0 ? (
          <Suspense fallback={<p>Loading testimonials slider...</p>}>
            <Slider {...testimonialSliderSettings} className="">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="p-4">
                  <div className="bg-white shadow-lg rounded-lg p-6 mx-2 h-full flex flex-col justify-between darktheme">
                    <p className="text-gray-800 italic mb-4">
                      "{testimonial.review}"
                    </p>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {testimonial.name}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {testimonial.title}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </Suspense>
        ) : (
          <p className="text-center text-gray-600 mt-8">
            No testimonials available.
          </p>
        )}
      </section>

      {/* BLOG POSTS */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center darktheme">
          Latest Blog Posts
        </h2>
        {loading.blogs ? (
          <p className="text-center text-gray-600 mt-8 darktheme">
            Loading blogs...
          </p>
        ) : blogs.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 px-6 lg:px-12">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="p-6 border border-blue-300 darktheme rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col sm:flex-row items-start"
              >
                {/* Text Content */}
                <div className="flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold flex-grow">
                    {blog.title}
                  </h3>
                  <p className="text-gray-500 text-sm mt-2 ">
                    {new Date(blog.date).toLocaleDateString()}
                  </p>
                  <Link to={`/blog/${blog.id}`}>
                    <p className="mt-4 text-blue-500 cursor-pointer self-baseline">
                      Read More
                    </p>
                  </Link>
                </div>
                {/* Image */}
                <div className="w-full sm:w-40 h-40 mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">
                  <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    className="w-full h-full border border-blue-300 object-cover rounded-lg"
                    loading="lazy"
                  />
                </div>
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
              loading="lazy"
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
          <Link to="/donation">
            <Button>Donate Now</Button>
          </Link>
          <Link to="/contact">
            <Button primary={false}>Volunteer</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
