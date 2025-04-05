import React, { useState, useEffect, lazy, Suspense, useMemo } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import LoadingSpinner from "../components/Loading";

// Lazy load heavy components
const Slider = lazy(() => import("react-slick"));
const MotionDiv = lazy(() =>
  import("framer-motion").then((mod) => ({ default: mod.motion.div }))
);

// Load CSS asynchronously
import("slick-carousel/slick/slick.css");
import("slick-carousel/slick/slick-theme.css");

const Programs = () => {
  const [view, setView] = useState(() =>
    window.innerWidth >= 640 ? "grid" : "list"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [programsData, setProgramsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 2;

  useEffect(() => {
    const handleResize = () => {
      setView(window.innerWidth >= 640 ? "grid" : "list");
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "programs"));
        const programs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProgramsData(programs);
      } catch (error) {
        console.error("Error fetching programs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  // Memoized pagination calculations
  const { currentPrograms, totalPages, indexOfLastItem } = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return {
      currentPrograms: programsData.slice(indexOfFirstItem, indexOfLastItem),
      totalPages: Math.ceil(programsData.length / itemsPerPage),
      indexOfLastItem,
    };
  }, [currentPage, programsData, itemsPerPage]);

  // Memoized slider settings
  const sliderSettings = useMemo(
    () => ({
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      autoplay: true,
      autoplaySpeed: 3000,
    }),
    []
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full overflow-hidden">
      {/* Breadcrumb Section */}
      <Suspense fallback={<div className="h-64 sm:h-80 bg-gray-200" />}>
        <MotionDiv
          className="relative h-64 sm:h-80 bg-cover bg-center text-white flex items-center justify-center"
          style={{ backgroundImage: "url('progb.jpg')" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
          <h1 className="relative text-4xl sm:text-5xl md:text-6xl font-bold">
            Our Projects
          </h1>
        </MotionDiv>
      </Suspense>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* View Toggle - Only show on desktop */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
            Explore Our Projects
          </h2>
          <div className="hidden sm:block mt-4 sm:mt-0">
            <button
              onClick={() => setView("grid")}
              className={`px-4 py-2 cursor-pointer rounded-full font-semibold transition-all duration-300 ${
                view === "grid"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setView("list")}
              className={`ml-2 px-4 py-2 cursor-pointer rounded-full font-semibold transition-all duration-300 ${
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
            view === "grid" && window.innerWidth >= 640
              ? "grid sm:grid-cols-2 gap-8"
              : "space-y-8"
          }
        >
          {currentPrograms.map((program) => (
            <Suspense
              key={program.id}
              fallback={<div className="p-6 bg-white rounded-lg shadow-md" />}
            >
              <MotionDiv
                className="p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Suspense
                  fallback={
                    <div className="mb-4 h-96 bg-gray-200 rounded-md" />
                  }
                >
                  <Slider {...sliderSettings} className="mb-4">
                    {program.images.map((img, index) => (
                      <div key={index}>
                        <img
                          src={img}
                          alt={`${program.name} - Image ${index + 1}`}
                          loading="lazy"
                          className="w-full h-96 object-cover rounded-md"
                        />
                      </div>
                    ))}
                  </Slider>
                </Suspense>
                <h3 className="text-xl font-semibold text-gray-800">
                  {program.name}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  {new Date(program.date).toLocaleDateString()}
                </p>
                <p className="text-gray-600 mt-2 whitespace-pre-wrap">
                  {program.description}
                </p>
              </MotionDiv>
            </Suspense>
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

export default React.memo(Programs);
