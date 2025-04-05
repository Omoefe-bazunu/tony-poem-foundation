import { FaFacebookF } from "react-icons/fa";
import { TiSocialInstagram } from "react-icons/ti";
import { FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 bottom-0 w-full flex flex-col gap-4 justify-center items-center">
      <div className="container px-4 flex flex-col md:flex-row justify-between items-center text-center">
        {/* Left Section */}
        <p className="text-sm text-gray-400 w-full">
          © {new Date().getFullYear()} Tony Poem Foundation. All rights
          reserved.
        </p>

        {/* Center - Navigation Links */}
        <nav className="flex space-x-4 my-4 md:my-0 flex-wrap item-center justify-center text-center w-full">
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
        <div className="flex space-x-4 w-full mx-auto justify-center items-center">
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
      <p className=" text-xs mx-auto w-full text-center text-gray-600">
        DESIGNED BY: HIGH-ER ENTERPRISES - +2349043970401
      </p>
    </footer>
  );
};

export default Footer;
