import { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Data Arrays
const projects = [
  {
    img: "/images/project1.jpg",
    title: "Youth Empowerment",
    alt: "Youth empowerment event",
  },
  {
    img: "/images/project2.jpg",
    title: "Skill Acquisition Training",
    alt: "Skill training session",
  },
  {
    img: "/images/project3.jpg",
    title: "Entrepreneurship Bootcamp",
    alt: "Entrepreneurship bootcamp",
  },
];

const testimonials = [
  { text: "Tony Poem Foundation changed my life!", author: "John Doe" },
  { text: "Amazing programs for youth empowerment.", author: "Jane Smith" },
  { text: "I discovered my true potential here.", author: "Michael Brown" },
];

const blogs = [
  {
    title: "The Future of African Youth",
    date: "March 10, 2024",
    slug: "/blog/future-african-youth",
  },
  {
    title: "Impact of Skill Training in Africa",
    date: "Feb 25, 2024",
    slug: "/blog/skill-training-africa",
  },
  {
    title: "How to Create Opportunities for Youth",
    date: "Jan 15, 2024",
    slug: "/blog/opportunities-youth",
  },
];

const impactStats = [
  { value: "10K+", label: "Youth Impacted" },
  { value: "50+", label: "Programs Run" },
  { value: "15", label: "Countries Reached" },
];

const partners = [
  { name: "Partner 1", logo: "parta.png" },
  { name: "Partner 2", logo: "PARTNER.png" },
  // { name: "Partner 3", logo: "/images/partner3.png" },
];

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

  useEffect(() => {
    setIsClient(true);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <p className="mt-4 text-lg sm:text-xl max-w-2xl mx-auto">
          Creating Opportunities for Youths in Africa
        </p>
        <Link to="/contact">
          <Button className="mt-6">Get Involved</Button>
        </Link>
      </section>

      {/* ABOUT US */}
      <section className="py-16 text-center bg-white">
        <h2 className="text-2xl sm:text-3xl font-semibold">About Us</h2>
        <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
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
        {isClient && (
          <Slider {...sliderSettings} className="mt-8">
            {projects.map((project, index) => (
              <div key={index} className="p-4">
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
        )}
        <Button className="px-6 py-3 rounded-full font-semibold shadow-md transition-all cursor-pointer duration-300 mx-auto mt-10 block">
          See More
        </Button>
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
        {isClient && (
          <Slider {...sliderSettings} className="mt-8 max-w-lg mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-6 bg-gray-500 flex flex-col justify-center items-center rounded-lg shadow-md"
              >
                <img
                  src=""
                  alt="author's image"
                  className=" bg-contain w-24 h-24 bg-gray-600 mx-auto rounded-full mb-2"
                />
                <p className="text-white italic">"{testimonial.text}"</p>
                <h4 className="mt-2 font-semibold text-white">
                  - {testimonial.author}
                </h4>
              </div>
            ))}
          </Slider>
        )}
      </section>

      {/* BLOG POSTS */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center">
          Latest Blog Posts
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 px-6 lg:px-12">
          {blogs.map((blog, index) => (
            <div
              key={index}
              className="p-6 border border-blue-300 flex flex-col rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold">{blog.title}</h3>
              <p className="text-gray-500 text-sm mt-2 flex-grow">
                {blog.date}
              </p>
              <Link to={blog.slug}>
                <Button className="mt-4">Read More</Button>
              </Link>
            </div>
          ))}
        </div>
        <Button className="px-6 py-3 rounded-full font-semibold shadow-md transition-all cursor-pointer duration-300 mx-auto mt-10 block">
          See All
        </Button>
      </section>

      {/* PARTNERS/SPONSORS */}
      <section className="py-16 text-center bg-white">
        <h2 className="text-2xl sm:text-3xl font-semibold">Our Partners</h2>
        <div className="mt-8 h-full flex flex-wrap gap-10 justify-center ">
          {partners.map((partner, index) => (
            <img
              key={index}
              src={partner.logo}
              alt={`${partner.name} logo`}
              className="h-full object-contain w-30 lg:w-48 "
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
