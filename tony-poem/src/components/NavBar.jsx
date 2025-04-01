import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion"; // Added for animations

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavClick = (path) => {
    navigate(path);
    setMenuOpen(false); // Close menu on mobile after clicking
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Projects", path: "/programs" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  // Animation variants for mobile menu
  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <NavLink
          to="/"
          className="text-xl sm:text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-300"
        >
          Tony Poem Foundation
        </NavLink>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center space-x-8 text-gray-700 font-medium">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `relative cursor-pointer hover:text-blue-600 transition-colors duration-300 ${
                    isActive ? "after:text-blue-600 after:font-semibold" : ""
                  }`
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
          {/* Donate Button */}
          <li>
            <NavLink
              to="/donation"
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 transition-all duration-300"
            >
              Donate
            </NavLink>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="text-gray-700 hover:text-blue-600 transition-colors duration-300"
          >
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          className="md:hidden bg-white shadow-lg absolute w-full left-0 top-16"
          initial="hidden"
          animate="visible"
          variants={menuVariants}
        >
          <ul className="flex flex-col items-center space-y-6 py-6">
            {navItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => handleNavClick(item.path)}
                  className="text-gray-700 font-medium hover:text-blue-600 transition-colors duration-300"
                >
                  {item.name}
                </button>
              </li>
            ))}
            {/* Donate Button in Mobile Menu */}
            <li>
              <button
                onClick={() => handleNavClick("/donation")}
                className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 transition-all duration-300"
              >
                Donate
              </button>
            </li>
          </ul>
        </motion.div>
      )}
    </nav>
  );
};

export default NavBar;
