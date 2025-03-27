import React from "react";
import { useNavigate } from "react-router";

const HomeBrand = ({ brand }) => {
  const navigate = useNavigate();
  const handleBrandClick = () => {
    navigate(`/browse?brand=${encodeURIComponent(brand.name)}&page=1`, {
      replace: true,
    });
  };
  return (
    <button
      onClick={handleBrandClick}
      className="brand border-1 border-grey p-5 rounded-md"
    >
      <img className="min-w-[80px] w-[80px]" src={brand.logo_url} alt="" />
    </button>
  );
};

export default HomeBrand;
