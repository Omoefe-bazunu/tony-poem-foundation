import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const Programs = () => {
  const [view, setView] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [programsData, setProgramsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 2;

  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "programs"));
      const programs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProgramsData(programs);
      setLoading(false);
    };
    fetchPrograms();
  }, []);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPrograms = programsData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(programsData.length / itemsPerPage);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  if (loading)
    return <p className="text-center text-gray-600 text-lg">Loading...</p>;

  return (
    <div className="w-full overflow-hidden">
      {/* Breadcrumb Section */}
      <motion.div
        className="relative h-64 sm:h-80 bg-cover bg-center text-white flex items-center justify-center"
        style={{ backgroundImage: "url('progb.jpg')" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <h1 className="relative text-4xl sm:text-5xl md:text-6xl font-bold">
          Our Programs
        </h1>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* View Toggle */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
            Explore Our Programs
          </h2>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => setView("grid")}
              className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
                view === "grid"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setView("list")}
              className={`ml-2 px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
                view === "list"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              List
            </button>
          </div>
        </div>

        {/* Programs Display */}
        <div
          className={
            view === "grid" ? "grid sm:grid-cols-2 gap-8" : "space-y-8"
          }
        >
          {currentPrograms.map((program) => (
            <motion.div
              key={program.id}
              className="p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Slider {...sliderSettings} className="mb-4">
                {program.images.map((img, index) => (
                  <div key={index}>
                    <img
                      src={img}
                      alt={`${program.name} - Image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </div>
                ))}
              </Slider>
              <h3 className="text-xl font-semibold text-gray-800">
                {program.name}
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                {new Date(program.date).toLocaleDateString()}
              </p>
              <p className="text-gray-600 mt-2">{program.description}</p>
              <Link
                to={program.slug}
                className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 transition-all duration-300"
              >
                Learn More
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-10 flex justify-center items-center space-x-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-full shadow-md disabled:opacity-50 hover:bg-blue-600 transition-all duration-300"
          >
            Prev
          </button>
          <span className="text-gray-700 text-lg">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={indexOfLastItem >= programsData.length}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-full shadow-md disabled:opacity-50 hover:bg-blue-600 transition-all duration-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Programs;
