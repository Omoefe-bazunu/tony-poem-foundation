import { useEffect, useState } from "react";
import { motion } from "framer-motion"; // Added for smoother animations

const About = () => {
  const [counters, setCounters] = useState({
    volunteers: 0,
    projects: 0,
    programs: 0,
  });

  useEffect(() => {
    const targetValues = { volunteers: 150, projects: 30, programs: 20 };
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
            { value: counters.volunteers, label: "Volunteers" },
            { value: counters.projects, label: "Projects" },
            { value: counters.programs, label: "Programs" },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <h3 className="text-4xl font-bold text-white">{item.value}+</h3>
              <p className="text-white mt-2">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Leadership Team */}
      <section className="bg-gray-100 py-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
          Our Leadership Team
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {[
            { name: "John Doe", role: "Founder & CEO", img: "leader1.jpg" },
            {
              name: "Jane Smith",
              role: "Director of Operations",
              img: "leader2.jpg",
            },
            {
              name: "Michael Brown",
              role: "Head of Programs",
              img: "leader3.jpg",
            },
          ].map((leader, index) => (
            <motion.div
              key={index}
              className="p-6 bg-white shadow-lg rounded-xl hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <img
                src={`/images/${leader.img}`}
                alt={`${leader.name}, ${leader.role}`}
                className="w-32 h-32 mx-auto rounded-full mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-800 text-center">
                {leader.name}
              </h3>
              <p className="text-gray-500 text-center">{leader.role}</p>
            </motion.div>
          ))}
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
        <motion.button className="px-8 py-3 bg-white cursor-pointer text-blue-500 font-semibold rounded-full shadow-md hover:bg-gray-100 transition-all duration-300">
          Contact Us
        </motion.button>
      </section>
    </div>
  );
};

export default About;
