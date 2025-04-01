import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

const About = () => {
  const [counters, setCounters] = useState({
    youthsImpacted: 0,
    volunteers: 0,
    programs: 0,
  });
  const [leadership, setLeadership] = useState([]);
  const [currentLeaderIndex, setCurrentLeaderIndex] = useState(0);

  useEffect(() => {
    const targetValues = { youthsImpacted: 500, volunteers: 150, programs: 50 };
    const duration = 2000;

    let startTime = null;

    const animateCounters = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      setCounters((prev) => {
        const newCounters = { ...prev };
        Object.keys(targetValues).forEach((key) => {
          newCounters[key] = Math.floor(targetValues[key] * progress);
        });
        return newCounters;
      });

      if (progress < 1) requestAnimationFrame(animateCounters);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          requestAnimationFrame(animateCounters);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    const counterSection = document.querySelector("#counter-section");
    if (counterSection) observer.observe(counterSection);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchLeadership = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "leadership"));
        const leaders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLeadership(leaders);
      } catch (error) {
        console.error("Error fetching leadership data:", error);
      }
    };
    fetchLeadership();
  }, []);

  return (
    <div className="w-full overflow-hidden">
      {/* Breadcrumb Section */}
      <motion.div
        className="relative h-64 sm:h-80 bg-cover bg-center text-white flex items-center justify-center"
        style={{ backgroundImage: "url('abtbg.jpg')" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <h1 className="relative text-4xl sm:text-5xl md:text-6xl font-bold">
          About Us
        </h1>
      </motion.div>

      {/* Mission & Vision */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative max-w-xl mx-auto h-64 md:h-80 rounded-xl overflow-hidden">
              <img
                src="abt2.jpg"
                alt="Our Mission"
                className="w-full bg-gray-800 h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-600 leading-relaxed max-w-lg mx-auto">
                To empower youths in Africa through skill acquisition,
                leadership training, and entrepreneurship support.
              </p>
            </div>
          </motion.div>
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative max-w-xl mx-auto h-64 md:h-80 rounded-xl overflow-hidden">
              <img
                src="abt3.jpg"
                alt="Our Vision"
                className="w-full bg-gray-800 h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Our Vision
              </h2>
              <p className="text-gray-600 leading-relaxed max-w-lg mx-auto">
                A future where every young African has the tools and knowledge
                to succeed in a competitive world.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="bg-gray-100 py-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
          Our Programs
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {[
            {
              title: "Skill Acquisition",
              desc: "Hands-on training in various fields to help youths become self-sufficient.",
            },
            {
              title: "Entrepreneurship",
              desc: "Support for young entrepreneurs to start and scale their businesses.",
            },
            {
              title: "Leadership Training",
              desc: "Equipping youths with skills to drive positive community change.",
            },
          ].map((program, index) => (
            <motion.div
              key={index}
              className="p-6 bg-white shadow-lg rounded-xl hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {program.title}
              </h3>
              <p className="text-gray-600">{program.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Counter Section */}
      <section
        id="counter-section"
        className="py-16 text-center bg-gradient-to-r from-blue-50 to-indigo-50 bg-cover bg-center"
        style={{ backgroundImage: `url('impact.jpg')` }}
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-12">
          Our Impact
        </h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          {[
            { value: counters.youthsImpacted, label: "Youths Impacted" },
            { value: counters.volunteers, label: "Volunteers" },
            { value: counters.programs, label: "Programs" },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <h3 className="text-3xl font-bold text-white">{item.value}+</h3>
              <p className="text-white mt-2">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-100 overflow-hidden">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
          Our Leadership Team
        </h2>

        <div className="relative max-w-7xl mx-auto">
          {/* Slider Container */}
          <div className="relative h-96 overflow-hidden shadow-xl">
            <AnimatePresence initial={false}>
              {leadership.length > 0 && (
                <motion.div
                  key={leadership[currentLeaderIndex].id}
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-white shadow-lg rounded-xl"
                >
                  <img
                    src={leadership[currentLeaderIndex].imageUrl}
                    alt={`${leadership[currentLeaderIndex].name}`}
                    className="w-32 h-32 mx-auto rounded-full mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-gray-800 text-center">
                    {leadership[currentLeaderIndex].name}
                  </h3>
                  <p className="text-gray-500 text-center mb-4">
                    {leadership[currentLeaderIndex].title}
                  </p>
                  {/* <p className="text-gray-600 text-center max-w-md">
                    {leadership[currentLeaderIndex].bio ||
                      "Leadership team member"}
                  </p> */}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={() =>
                setCurrentLeaderIndex(
                  (prev) => (prev - 1 + leadership.length) % leadership.length
                )
              }
              className="p-2 rounded-full bg-white shadow-md hover:bg-gray-200"
            >
              &larr;
            </button>
            <div className="flex items-center space-x-2">
              {leadership.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentLeaderIndex(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === currentLeaderIndex ? "bg-blue-500" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() =>
                setCurrentLeaderIndex((prev) => (prev + 1) % leadership.length)
              }
              className="p-2 rounded-full bg-white shadow-md hover:bg-gray-200"
            >
              &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section
        className="py-16 px-6 bg-blue-500 text-white text-center bg-cover bg-center"
        style={{ backgroundImage: `url('join.jpg')` }}
      >
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Get Involved
        </motion.h2>
        <p className="max-w-lg mx-auto mb-8">
          Join us in making a difference. Volunteer, donate, or partner with us
          today!
        </p>
        <Link to="/contact">
          <motion.button className="px-8 py-3 bg-white cursor-pointer text-blue-500 font-semibold rounded-full shadow-md hover:bg-blue-500 hover:text-white transition-all duration-300">
            Contact Us
          </motion.button>
        </Link>
      </section>
    </div>
  );
};

export default About;
