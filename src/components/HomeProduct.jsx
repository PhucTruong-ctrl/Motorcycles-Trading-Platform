import React from "react";
import { Link } from "react-router";

const HomeProduct = ({ moto }) => {
  const formatNumber = (number) => {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 0,
    }).format(number);
  };
  return (
    <Link to={`/${moto.uid}/${moto.id}`}>
      <div id="product" className="home-card">
        <div id="img">
          <img
            className="rounded-t-md h-[145px] object-cover"
            src={
              Array.isArray(moto.image_url) && moto.image_url.length > 0
                ? moto.image_url[moto.image_url.length - 1]
                : "/img/R7_Sample.jpg"
            }
            alt={moto.type}
          />
        </div>
        <div
          id="detail"
          className="flex flex-col justify-start gap-0.5 self-stretch p-2 h-full"
        >
          <div
            id="price-status"
            className="flex justify-between items-start self-stretch"
          >
            <span
              id="price"
              className="flex-[1,0,0] text-[16px] font-extrabold"
            >
              ${formatNumber(moto.price)}
            </span>
            <span
              id="status"
              className="text-[16px] font-[700] text-red stroke-2 stroke-black"
            >
              {moto.condition.toUpperCase()}
            </span>
          </div>

          <span id="name" className="text-[14px] text-grey font-[500]">
            {moto.brand} {moto.model} {moto.trim}
          </span>
          <div
            id="odo-year"
            className="flex justify-between items-start self-stretch text-[12px] text-grey font-[500]"
          >
            <span id="odo" className="flex-[1,0,0]">
              {formatNumber(moto.mile)} Miles
            </span>
            <span id="year">{moto.year}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HomeProduct;
