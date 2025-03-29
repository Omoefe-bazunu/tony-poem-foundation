import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
// import BlogDetails from "./pages/BlogDetails";
import Programs from "./pages/Programs";
import Contact from "./pages/Contact";
import Navbar from "./components/NavBar";
import Blog from "./pages/Blogs";
// import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        {/* <Route path="/blog/:id" element={<BlogDetails />} /> */}
        <Route path="/programs" element={<Programs />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      {/* <Footer /> */}
    </Router>
  );
}

export default App;
