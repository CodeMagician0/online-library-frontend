import React from "react";
import "./App.css";
import { Navbar } from "./layouts/NavbarAndFooter/Navbar";
import { ExploreTopBooks } from "./layouts/HomePage/components/ExploreTopBooks";
import { Carousel } from "./layouts/HomePage/components/Carousel";
import { Footer } from "./layouts/NavbarAndFooter/Footer";

function App() {
  return (
    <div>
      <Navbar />
      <ExploreTopBooks />
      <Carousel />
      <Footer />
    </div>
  );
}

export default App;
