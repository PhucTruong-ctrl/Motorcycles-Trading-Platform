import React from "react";
import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Sell from "./pages/Sell";
import About from "./pages/About";
import Browse from "./pages/Browse";
import Login from "./pages/Login";

const App = () => {
  return (
    <div>
      <div>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/browse" element={<Browse />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/sell" element={<Sell />}></Route>
          <Route path="/login" element={<Login />}></Route>
        </Routes>
      </div>
    </div>
  );
};

export default App;
