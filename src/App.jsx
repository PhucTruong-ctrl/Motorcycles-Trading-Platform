import React from "react";
import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Sell from "./pages/Sell";
import About from "./pages/About";
import Browse from "./pages/Browse";
import ProductDetail from "./pages/ProductDetail";
import Profile from "./pages/Profile";
import EditProduct from "./pages/EditProduct";
import Listing from "./pages/Listing";
import PurchaseHistory from "./pages/PurchaseHistory";
import WorkArea from "./pages/WorkArea";

const App = () => {
  return (
    <div>
      <div>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/browse" element={<Browse />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/sell" element={<Sell />}></Route>
          <Route
            path="/:type/:brand/:model/:trim/:year/:uid/:id"
            element={<ProductDetail />}
          />
          <Route path="/:uid/edit/:id" element={<EditProduct />} />
          <Route path="/:uid/profile" element={<Profile />} />
          <Route path="/:uid/listing" element={<Listing />} />
          <Route path="/:uid/purchase-history" element={<PurchaseHistory />} />
          <Route path="/work" element={<WorkArea />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
