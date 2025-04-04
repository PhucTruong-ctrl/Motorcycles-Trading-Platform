import React from "react";
import { useNavigate } from "react-router";

const Brand = ({ brand }) => {
  const navigate = useNavigate();
  const handleBrandClick = () => {
    navigate(`/browse?brand=${encodeURIComponent(brand.name)}&page=1`, {
      replace: true,
    });
  };
  return (
    <div
      onClick={handleBrandClick}
      className="brand"
    >
      <img className="w-[100px] md:w-[80px] object-cover" src={brand.logo_url} alt="" />
    </div>
  );
};

export default Brand;
