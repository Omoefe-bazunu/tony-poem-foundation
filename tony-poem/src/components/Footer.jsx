import { FaFacebookF } from "react-icons/fa";
import { TiSocialInstagram } from "react-icons/ti";
import { FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 bottom-0 w-full">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        {/* Left Section */}
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} Tony Poem Foundation. All rights
          reserved.
        </p>

        {/* Center - Navigation Links */}
        <nav className="flex space-x-4 my-4 md:my-0">
          <a href="/" className="text-gray-400 hover:text-white transition">
            Home
          </a>
          <a
            href="/about"
            className="text-gray-400 hover:text-white transition"
          >
            About
          </a>
          <a
            href="/programs"
            className="text-gray-400 hover:text-white transition"
          >
            Projects
          </a>
          <a href="/blog" className="text-gray-400 hover:text-white transition">
            Blogs
          </a>
          <a
            href="/contact"
            className="text-gray-400 hover:text-white transition"
          >
            Contact
          </a>
          <a
            href="/donation"
            className="text-gray-400 hover:text-white transition"
          >
            Donate
          </a>
        </nav>

        {/* Right Section - Social Icons */}
        <div className="flex space-x-4">
          <a
            href="https://www.facebook.com/profile.php?id=61566465128143&mibextid=ZbWKwL"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebookF />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <FaLinkedinIn />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <TiSocialInstagram />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
