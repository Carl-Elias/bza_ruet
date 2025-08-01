import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Alumni from "./pages/Alumni";
import AlumniRegister from "./pages/AlumniRegister";
import AdminDashboard from "./pages/AdminDashboard";
import Events from "./pages/Events";
import Announcements from "./pages/Announcements";
import Books from "./pages/Books";
import Contact from "./pages/Contact";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/alumni" element={<Alumni />} />
            <Route path="/alumni/register" element={<AlumniRegister />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/events" element={<Events />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/books" element={<Books />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
