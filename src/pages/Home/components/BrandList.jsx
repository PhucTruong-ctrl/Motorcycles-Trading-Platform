import React, { useState, useEffect, useRef } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Brand from "./Brand";
import supabase from "../../../lib/supabase-client";

const BrandList = () => {
  const [brands, setBrands] = useState([]);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const { data, error } = await supabase
          .from("BRAND")
          .select("*")
          .order("id", { ascending: false });

        if (error) {
          throw error;
        }

        setBrands(data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, []);

  return (
    <div className="border-b-1 border-grey ">
      <Carousel
        ref={carouselRef}
        additionalTransfrom={0}
        arrows
        className="w-full pb-5 px-2"
        containerClass="carousel-container"
        itemClass="carousel-item"
        minimumTouchDrag={80}
       
        responsive={{
          desktop: {
            breakpoint: { max: 2560, min: 1920 },
            items: 10,
          },
          desktop1: {
            breakpoint: { max: 1920, min: 1440 },
            items: 8,
          },
          desktop2: {
            breakpoint: { max: 1440, min: 1024 },
            items: 6,
          },
          tablet: {
            breakpoint: { max: 1024, min: 800 },
            items: 5,
          },
          tablet1: {
            breakpoint: { max: 800, min: 464 },
            items: 3,
          },
          mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 2,
          },
        }}
        sliderClass=""
        slidesToSlide={1}
        swipeable
      >
        {brands.map((brd) => (
          <Brand key={brd.id} brand={brd} />
        ))}
      </Carousel>
    </div>
  );
};

export default BrandList;
