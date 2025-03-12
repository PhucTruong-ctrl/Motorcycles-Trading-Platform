import React from "react";
import { format } from "date-fns";
import { Link } from "react-router";

const BrowseProduct = ({ moto }) => {
  const formatDate = (dateString) => {
    return format(new Date(dateString), " HH:mm MM-dd-yyyy");
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 0,
    }).format(number);
  };

  return (
    <Link to={`/${moto.uid}/${moto.id}`}>
      <div
        id="BrowseProduct"
        className="flex flex-col md:flex-row justify-start items-center content-center gap-3.5 bg-white rounded-[6px] p-2 sm:p-4 md:p-6 shadow-md shadow-grey"
      >
        <img
          src={moto.image_url || "/img/R7_Sample.jpg"}
          alt={moto.type}
          className="w-[100%] h-[180px] md:w-[250px] rounded-[6px] object-contain"
        />
        <div
          id="Detail"
          className="flex flex-col items-start justify-center gap-3.5 w-full md:w-[250px] min-h-[200px] pr-3.5 md:border-r-1 border-grey"
        >
          <div id="Top" className="flex flex-col justify-end items-start gap-1">
            <div id="Name" className="font-extrabold text-2xl text-black">
              {moto.brand.toUpperCase()} {moto.model.toUpperCase()}{" "}
              {moto.trim.toUpperCase()}
            </div>
            <div
              id="Location"
              className="text-nowrap text-[13px] font-light text-black flex flex-row gap-1"
            >
              <img src="/icons/Location.svg" alt="" />
              {moto.location}
            </div>
          </div>
          <div id="Mid" className="flex flex-col justify-end items-start gap-1">
            <div id="Price" className="text-red text-2xl font-extrabold">
              ${formatNumber(moto.price)}
            </div>
            <div>
              <div id="Mileage" className="text-[14px] text-grey font-light">
                {formatNumber(moto.mile)} Miles
              </div>
              <div id="Year" className="text-[14px] text-grey font-light">
                {moto.year}
              </div>
            </div>
          </div>
          <div id="Bot" className="flex gap-1 w-full">
            <img src="/icons/Time.svg" alt="" className="opacity-70 w-5 h-5" />
            <div className="font-light text-[13px] text-grey">
              {formatDate(moto.created_at)}
            </div>
          </div>
        </div>

        <div
          id="Desc"
          className="hidden md:block text-black text-[13px] line-clamp-9 self-center"
        >
          {moto.desc}
        </div>
      </div>
    </Link>
  );
};

export default BrowseProduct;
