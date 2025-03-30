import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import BlogDetails from "./pages/BlogDetails";
import Programs from "./pages/Programs";
import Contact from "./pages/Contact";
import Navbar from "./components/NavBar";
import Blog from "./pages/Blogs";
import LeadershipForm from "./pages/addLeaders";
import CreateBlogPost from "./pages/addPost";
import CreateProgram from "./pages/addProgram";
import TestimonialForm from "./pages/addTestimonials";
import Login from "./pages/Login";
import AdminDashboard from "./pages/manageContent";
// import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetails />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/addLeaders" element={<LeadershipForm />} />
        <Route path="/addPost" element={<CreateBlogPost />} />
        <Route path="/addProgram" element={<CreateProgram />} />
        <Route path="/addTestimonial" element={<TestimonialForm />} />
        <Route path="/Adminlogin" element={<Login />} />
        <Route path="/manageContent" element={<AdminDashboard />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
      {/* <Footer /> */}
    </Router>
  );
}

export default App;
