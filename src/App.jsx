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
          <Route path="Browse" element={<Browse />}></Route>
          <Route path="About" element={<About />}></Route>
          <Route path="Sell" element={<Sell />}></Route>
          <Route path="Login" element={<Login />}></Route>
        </Routes>
      </div>
    </div>
  );
};

export default App;
