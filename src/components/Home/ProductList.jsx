import React, { useEffect, useState, useRef } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ProductCard from "../ProductCard";
import supabase from "../../supabase-client";

const ProductList = ({ condition }) => {
  const [motorcycles, setMotorcycles] = useState([]);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchMotorcycles = async () => {
      try {
        const { data, error } = await supabase
          .from("MOTORCYCLE")
          .select("*")
          .eq("condition", condition)
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setMotorcycles(data);
      } catch (error) {
        console.error("Error fetching motorcycles:", error);
      }
    };

    fetchMotorcycles();
  }, [condition]);

  const title = condition === "New" ? "Brand New" : "Used Motorcycles";
  const description =
    condition === "New"
      ? "No miles, no worries—just pure riding joy."
      : "Pre-loved bikes with stories to tell.";

  return (
    <div className="self-stretch border-b-1 border-grey pb-5">
      <div className="flex flex-col items-start gap-1 mb-2">
        <div className="flex gap-2">
          <div className="font-bold text-[16px]">{title}</div>
          <button className="text-blue">See All</button>
        </div>
        <div className="font-light">{description}</div>
      </div>
      <div>
        <Carousel
          ref={carouselRef}
          additionalTransfrom={0}
          arrows
          className="w-full p-2"
          containerClass="carousel-container"
          itemClass="carousel-item"
          minimumTouchDrag={80}
          responsive={{
            desktop: {
              breakpoint: { max: 3000, min: 1024 },
              items: 10,
            },
            tablet: {
              breakpoint: { max: 1024, min: 464 },
              items: 4,
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
          {motorcycles.map(
            (moto) =>
              moto.is_sold === false && (
                <ProductCard key={moto.id} moto={moto} />
              )
          )}
        </Carousel>
      </div>
    </div>
  );
};

export default ProductList;
