import Navbar from "../components/Navbar/Navbar.tsx";
import "./App.css";
import Movies from "../components/movies/Movies.tsx";
import WatchLater from "../components/watchLater/watchLater.tsx";
import Favourite from "../components/favourite/favourite.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "../components/signup/signup.tsx";
function App() {
  return (
    <>
      <Router>
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<Signup></Signup>}></Route>
          <Route path="/home" element={<Movies></Movies>}></Route>
          <Route path="/favourite" element={<Favourite></Favourite>}></Route>
          <Route path="/watchLater" element={<WatchLater></WatchLater>}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
