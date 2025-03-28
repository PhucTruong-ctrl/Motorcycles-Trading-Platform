import React, { useEffect, useState, useCallback, useRef, use } from "react";
import { Link, useLocation } from "react-router";
import queryString from "query-string";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import supabase from "../supabase-client";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";
import ProductCard from "../components/ProductCard";
import { Message } from "./../components/Message";

const formatNumber = (number) => {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
  }).format(number);
};

const CapitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const ProductDetail = () => {
  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const [moto, setMoto] = useState(null);
  const [motoMore, setMotoMore] = useState([]);
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [messageReceiver, setMessageReceiver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMainIndex, setCurrentMainIndex] = useState(0);
  const [viewsIncreased, setViewsIncreased] = useState(false);

  const mainCarouselRef = useRef(null);
  const thumbCarouselRef = useRef(null);
  const dealerCarouselRef = useRef(null);

  const handleChat = () => {
    setMessageReceiver(user);
  };

  const handleMainImageChange = (previousSlide, { currentSlide }) => {
    setCurrentMainIndex(currentSlide);
    thumbCarouselRef.current.goToSlide(currentSlide);
  };

  const handleThumbnailClick = (index) => {
    setCurrentMainIndex(index);
    mainCarouselRef.current.goToSlide(index);
  };

  const increaseViews = useCallback(async () => {
    if (!moto) {
      console.log("Moto is null, cannot increase views.");
      return;
    }

    try {
      console.log(
        `Increasing views for moto ID: ${queryParams.id}, current views: ${moto.views}`
      );

      const { data, error } = await supabase
        .from("MOTORCYCLE")
        .update({ views: moto.views + 1 })
        .eq("id", queryParams.id)
        .select("*")
        .single();

      if (error) {
        console.error("Error updating views:", error);
        return;
      }

      if (data && data.length > 0) {
        console.log(
          `Views updated successfully. New views count: ${data[0].views}`
        );
        setMoto((prevMoto) => ({ ...prevMoto, views: data[0].views }));
      }
    } catch (error) {
      console.error("Error increasing views:", error);
    }
  }, [moto, queryParams.id]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setCurrentUser(session?.user || null);
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setCurrentMainIndex(0);

        if (!queryParams.uid || !queryParams.id) {
          throw new Error("Missing UID or ID in URL");
        }

        const { data: motoData, error: motoError } = await supabase
          .from("MOTORCYCLE")
          .select("*")
          .eq("uid", queryParams.uid)
          .eq("id", queryParams.id)
          .single();

        if (motoError) throw motoError;
        setMoto(motoData);

        const { data: userData, error: userError } = await supabase
          .from("USER")
          .select("*")
          .eq("uid", queryParams.uid)
          .single();

        if (userError) throw userError;
        setUser(userData);

        const { data: moreMotoData, error: moreMotoError } = await supabase
          .from("MOTORCYCLE")
          .select("*")
          .eq("uid", queryParams.uid)
          .neq("id", queryParams.id);

        if (moreMotoError) throw moreMotoError;
        setMotoMore(moreMotoData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [queryParams.uid, queryParams.id]);

  useEffect(() => {
    if (moto && !viewsIncreased) {
      increaseViews();
      setViewsIncreased(true);
    }
  }, [moto, viewsIncreased, increaseViews]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!moto) {
    return <div>Moto not found.</div>;
  }

  return (
    <div>
      <main className="my-[15px] mx-[25px]">
        <header className="mb-5">
          <Header />
        </header>

        <Message newChatReceiver={messageReceiver} />
        
        <div className="font-light mb-4 ">
          {CapitalizeFirst(
            moto.type === "sport_touring" ? "Sport Touring" : moto.type
          )}{" "}
          / {moto.brand} / {moto.model} / {moto.trim} / {moto.year}
        </div>

        <div>
          <div className="flex flex-col lg:flex-row justify-center gap-15 items-center self-stretch mb-5">
            <div className="flex flex-col gap-3.5 w-full lg:w-[1000px] md:h-fit  rounded-xl">
              <div className="relative flex flex-col justify-center items-center w-full">
                <Carousel
                  ref={mainCarouselRef}
                  afterChange={handleMainImageChange}
                  arrows
                  className="w-full"
                  containerClass="carousel-container"
                  itemClass=""
                  responsive={{
                    desktop: {
                      breakpoint: { max: 3000, min: 1024 },
                      items: 1,
                    },
                    tablet: {
                      breakpoint: { max: 1024, min: 464 },
                      items: 1,
                    },
                    mobile: {
                      breakpoint: { max: 464, min: 0 },
                      items: 1,
                    },
                  }}
                >
                  {moto.image_url.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      className="w-full h-[250px] sm:h-[350px] md:h-[700px] rounded-sm object-cover border-1 border-grey"
                      alt={`Main ${index + 1}`}
                    />
                  ))}
                </Carousel>
              </div>

              <div className="hidden md:block">
                <Carousel
                  ref={thumbCarouselRef}
                  arrows
                  className="w-full"
                  containerClass="carousel-container"
                  responsive={{
                    desktop: {
                      breakpoint: { max: 3000, min: 1024 },
                      items: 7,
                    },
                    tablet: {
                      breakpoint: { max: 1024, min: 464 },
                      items: 5,
                    },
                    mobile: {
                      breakpoint: { max: 464, min: 0 },
                      items: 4,
                    },
                  }}
                  swipeable
                >
                  {moto.image_url.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className={`w-[130px] h-[100px] rounded-sm object-contain cursor-pointer hover:border-2 ${
                        index === currentMainIndex
                          ? "border-2 border-black"
                          : "border-0"
                      }`}
                      onClick={() => handleThumbnailClick(index)}
                    />
                  ))}
                </Carousel>
              </div>
            </div>
            <div
              id="RightSection"
              className="flex flex-col justify-start items-start self-stretch"
            >
              <div
                id="BikeDetail"
                className="flex flex-col items-start gap-1 self-stretch border-b-1 border-grey pb-5"
              >
                <div className="text-black font-light flex flex-row gap-4">
                  {moto.condition} {moto.year} {moto.brand}{" "}
                  {CapitalizeFirst(
                    moto.type === "sport_touring" ? "Sport Touring" : moto.type
                  )}{" "}
                  {""}
                  {moto.model} {moto.trim}
                </div>
                <div className="font-bold text-4xl">
                  {moto.model} {moto.trim}
                </div>

                <div className="text-grey font-light">
                  {formatNumber(moto.mile)} Miles
                </div>

                <div className="text-4xl font-extrabold text-red">
                  ${formatNumber(moto.price)}
                </div>
              </div>

              <div id="ContactSeller" className="w-full">
                <div
                  id="SellerDetail"
                  className="flex flex-col md:flex-row justify-center items-center gap-5 md:gap-15 pt-5"
                >
                  {user && (
                    <div className="flex items-center gap-2">
                      <Link to={`/profile/${user?.uid}`}>
                        <img
                          src={user.avatar_url}
                          alt={user.name}
                          className="w-[60px] h-[60px] sm:min-w-[80px] sm:min-h-[80px] md:min-w-[95px] md:min-h-[95px] rounded-full shrink-0"
                        />
                      </Link>
                      <div className="flex flex-col items-start gap-1">
                        <Link to={`/profile/${user?.uid}`}>
                          <div className="font-light text-grey text-[15px]">
                            {user.badge}
                          </div>
                          <div className="font-bold text-2xl">{user.name}</div>
                        </Link>
                        <div className="flex flex-row gap-1 font-light text-grey text-nowrap text-[15px]">
                          <img src="/icons/Location.svg" alt="" /> {user?.state}
                          , {user?.city}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-row gap-5 w-full justify-center items-center">
                    <div>
                      <Button
                        textValue={`${user.phone_num}`}
                        bg_color={"black"}
                        text_color={"white"}
                        icons={"/icons/Phone.svg"}
                      />
                    </div>
                    <div>
                      <button
                        onClick={handleChat}
                        className={`w-full p-2.5 flex flex-row justify-center items-center gap-1.5 shadow-md shadow-grey bg-blue rounded-sm hover:scale-110 hover:cursor-pointer transition`}
                      >
                        <img
                          className="w-7 h-auto"
                          src="/icons/Chat.svg"
                          alt=""
                        />
                        <div className={`text-white text-[23px] font-[500]`}>
                          Chat
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-5 pt-5 pb-5 border-b-1 border-grey w-full">
                  <div className="flex flex-row gap-5 text-grey">
                    <input
                      type="text"
                      placeholder="First Name"
                      className="rounded-sm border-[1px] border-grey h-10 bg-white w-full px-5"
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="rounded-sm border-[1px] border-grey h-10 bg-white w-full px-5"
                    />
                  </div>
                  <div className="flex flex-row gap-5 text-grey">
                    <input
                      type="text"
                      placeholder="Email Address"
                      defaultValue={user.email}
                      className="rounded-sm border-[1px] border-grey h-10 bg-white w-full px-5"
                    />
                    <input
                      type="text"
                      placeholder="Phone Number"
                      defaultValue={user.phone_num}
                      className="rounded-sm border-[1px] border-grey h-10 bg-white w-full px-5"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Message"
                    className="rounded-sm border-[1px] border-grey h-10 bg-white w-full px-5"
                    defaultValue={`Is this ${moto.brand} ${moto.model} ${moto.trim} still available? `}
                  />
                  <Button
                    textValue={"Send Email"}
                    bg_color={"black"}
                    text_color={"white"}
                    width={"full"}
                    icons={"/icons/Chat.svg"}
                  />
                </div>
              </div>

              <div className="pt-5">
                <div className="font-semibold">Popularity Stats</div>
                <div>Seen {moto.views} times</div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex flex-col gap-5 items-start justify-start mb-5">
              <div className="font-semibold text-2xl">Description</div>
              <div className="text-[16px]">{moto.desc}</div>
            </div>
            <div className="flex flex-col justify-start items-start gap-5">
              <div className="font-light text-xl underline">
                More From This Dealer
              </div>
              <Carousel
                ref={dealerCarouselRef}
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
                {motoMore.map((moto) => (
                  <ProductCard key={moto.id} moto={moto} />
                ))}
              </Carousel>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
