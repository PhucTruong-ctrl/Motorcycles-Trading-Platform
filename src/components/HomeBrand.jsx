import React from "react";

const HomeBrand = ({ brand }) => {
  return (
    <div className="brand border-1 border-grey p-5 rounded-md">
      <img className="min-w-[80px] w-[80px]" src={brand.logo_url} alt="" />
    </div>
  );
};

export default HomeBrand;
