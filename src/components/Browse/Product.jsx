import React from "react";
import { useNavigate } from "react-router";
import { formatDate } from "../FormatDate";
import DOMPurify from "dompurify";

const Product = ({ moto, user }) => {
  const navigate = useNavigate();

  const formatNumber = (number) => {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const updateURL = () => {
    const queryParams = new Map([
      ["uid", moto.uid || undefined],
      ["id", moto.id || undefined],
      ["year", moto.year || undefined],
      ["brand", moto.brand || undefined],
      ["model", moto.model || undefined],
      ["trim", moto.trim || undefined],
    ]);

    const query = new URLSearchParams(queryParams).toString();
    navigate(`/motorcycle-detail?${query}`);
  };

  return (
    <div
      onClick={updateURL}
      id="Product"
      className="flex flex-col md:flex-row justify-start items-center content-center gap-3.5 bg-white rounded-xl p-4 sm:p-5 md:p-6 shadow-md shadow-grey cursor-pointer hover:outline-1 transition"
    >
      <img
        src={
          Array.isArray(moto.image_url) && moto.image_url.length > 0
            ? moto.image_url[0]
            : "/img/R7_Sample.jpg"
        }
        alt={moto.type}
        className="w-full h-[200px] md:max-w-[250px] rounded-[6px] object-cover"
      />
      <div
        id="Detail"
        className="flex flex-col items-start justify-start gap-3.5 w-full md:min-w-[250px] h-fit md:max-h-[200px] pr-3.5 lg:border-r-1 border-grey"
      >
        <div id="Top" className="flex flex-col justify-end items-start gap-1">
          <div id="Name" className="font-extrabold text-2xl text-black">
            {moto.condition.toUpperCase()} {moto.brand.toUpperCase()}{" "}
            {moto.model.toUpperCase()} {moto.trim.toUpperCase()}
          </div>
          <div
            id="Location"
            className="text-nowrap text-[13px] font-light text-black flex flex-row gap-1"
          >
            <img src="/icons/Location.svg" alt="" />
            {user?.state}, {user?.city}
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
        className="hidden md:block text-black w-full line-clamp-4 overflow-hidden"
      >
        <div
          className="w-full ql-editor"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(moto.desc),
          }}
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 4,
          }}
        />
      </div>
    </div>
  );
};

export default Product;
