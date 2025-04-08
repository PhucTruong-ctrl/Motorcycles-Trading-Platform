import React from "react";
import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Sell from "./pages/Sell";
import Browse from "./pages/Browse";
import ProductDetail from "./pages/ProductDetail";
import Profile from "./pages/Profile";
import EditProduct from "./pages/EditProduct";
import Listing from "./pages/Listing";
import Transaction from "./pages/Transaction";
import WorkArea from "./pages/WorkArea";
import LoginSignUp from "./pages/LoginSignUp";
import AuthCallback from "./components/AuthCallback";
import Header from "./components/Header";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div>
      <main className="my-[15px] mx-[25px]">
        <div className="mb-5">
          <Header />
        </div>
        <div>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/auth-callback" element={<AuthCallback />} />
            <Route path="/browse" element={<Browse />}></Route>
            <Route path="/sell" element={<Sell />}></Route>
            <Route path="/motorcycle-detail" element={<ProductDetail />} />
            <Route path="/edit/:id" element={<EditProduct />} />
            <Route path="/profile/:uid" element={<Profile />} />
            <Route path="/listing/:uid" element={<Listing />} />
            <Route path="/transaction/:uid" element={<Transaction />} />
            <Route path="/account" element={<LoginSignUp />} />
            <Route path="/work" element={<WorkArea />} />
          </Routes>
        </div>
        <div>
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default App;
