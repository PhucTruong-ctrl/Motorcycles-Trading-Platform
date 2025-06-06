import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import supabase from "../lib/supabase-client";
import DOMPurify from "dompurify";
import queryString from "query-string";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import { useCurrentUser } from "../hooks/useCurrentUser";
import { formatNumber } from "../utils/FormatThings";
import { CapitalizeFirst } from "../utils/CapitalizeFirst";
import ProductCard from "../components/ui/ProductCard";
import { Message } from "../features/Chat/Message";
import LoadingFull from "../components/ui/LoadingFull";
import Loading from "../components/ui/Loading";

const ProductDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = queryString.parse(location.search);
  const [moto, setMoto] = useState(null);
  const [motoMore, setMotoMore] = useState([]);
  const [user, setUser] = useState(null);
  const currentUser = useCurrentUser();
  const [messageReceiver, setMessageReceiver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [inTransaction, setInTransaction] = useState(false);
  const [error, setError] = useState(null);
  const [currentMainIndex, setCurrentMainIndex] = useState(0);
  const [viewsIncreased, setViewsIncreased] = useState(false);

  const mainCarouselRef = useRef(null);
  const thumbCarouselRef = useRef(null);
  const dealerCarouselRef = useRef(null);

  const handleChat = () => {
    if (!currentUser || !user) {
      alert("Please login to chat.");
      navigate("/account");
      return;
    }
    if (currentUser.id !== user.uid) {
      setMessageReceiver(user);
    } else {
      alert("You cannot chat to yourself!");
    }
  };

  const handleMainImageChange = (previousSlide, { currentSlide }) => {
    setCurrentMainIndex(currentSlide);
    thumbCarouselRef.current.goToSlide(currentSlide);
    console.log(currentSlide);
  };

  const handleThumbnailClick = (index) => {
    setCurrentMainIndex(index);
    mainCarouselRef.current.goToSlide(index);
  };

  const handleBuy = async () => {
    if (isPurchasing) return;

    if (!currentUser) {
      navigate("/account");
      return;
    }

    if (!user) {
      alert("Seller information is not available.");
      return;
    }

    if (currentUser.id === user.uid) {
      alert("You cannot buy from yourself.");
      return;
    }

    try {
      setIsPurchasing(true);

      const { error } = await supabase
        .from("TRANSACTION")
        .insert([
          {
            uid_buyer: currentUser.id,
            uid_seller: user.uid,
            id_moto: queryParams.id,
          },
        ])
        .select();

      if (error) {
        if (error.code === "23505") {
          alert("You've already purchased this item!");
        } else {
          throw error;
        }
        return;
      }

      alert("Purchase successful!");
      navigate(`/transaction/${currentUser.id}`);
    } catch (error) {
      console.error("Error buying product:", error);
      alert("Purchase failed: " + error.message);
    } finally {
      setIsPurchasing(false);
    }
  };

  const increaseViews = useCallback(async () => {
    if (!moto || viewsIncreased) return;

    try {
      const { data, error } = await supabase
        .from("MOTORCYCLE")
        .update({ views: moto.views + 1 })
        .eq("id", queryParams.id)
        .select("*")
        .single();

      if (error) throw error;

      setMoto((prevMoto) => ({ ...prevMoto, views: data.views }));
      setViewsIncreased(true);
    } catch (error) {
      console.error("Error increasing views:", error);
    }
  }, [moto, queryParams.id, viewsIncreased]);

  useEffect(() => {
    if (moto && !viewsIncreased) {
      increaseViews();
      setViewsIncreased(true);
    }
  }, [moto, viewsIncreased, increaseViews]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setCurrentMainIndex(0);

        const { data: existingTransactions, error: checkError } = await supabase
          .from("TRANSACTION")
          .select("*")
          .eq("id_moto", queryParams.id);

        if (checkError) throw checkError;

        if (existingTransactions && existingTransactions.length > 0) {
          setInTransaction(true);
        }

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
    if (moto) {
      document.title = `${moto.brand} ${moto.model} ${moto.trim}`;
    }
  }, [moto]);

  if (loading) {
    return <LoadingFull />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!moto) {
    return <div>Moto not found.</div>;
  }

  return (
    <div>
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
                {moto?.image_url?.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    className="w-full h-[250px] sm:h-[350px] md:h-[700px] rounded-sm object-cover border-1 border-grey"
                    alt={`Main ${index + 1}`}
                  />
                )) || <div>No images available</div>}
              </Carousel>
            </div>

            <div className="hidden md:block">
              <Carousel
                ref={thumbCarouselRef}
                arrows
                className="w-full p-2"
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
                    className={`w-[96%] rounded-sm object-contain cursor-pointer hover:outline-2 ${
                      index === currentMainIndex ? "outline-1" : "outline-0"
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

            <div
              id="ContactSeller"
              className="w-full flex flex-col justify-center items-center gap-5 mt-5"
            >
              <div
                id="SellerDetail"
                className="w-full flex flex-col md:flex-row justify-center items-center gap-5 md:gap-15"
              >
                {user && (
                  <div className="flex items-center gap-2 w-full">
                    <Link to={`/profile/${user?.uid}`}>
                      <img
                        src={user.avatar_url}
                        alt={user.name}
                        className="w-[60px] h-[60px] sm:min-w-[80px] sm:min-h-[80px] md:min-w-[95px] md:min-h-[95px] border-1 rounded-full shrink-0"
                      />
                    </Link>
                    <div className="flex flex-col items-start gap-1 w-full">
                      <Link to={`/profile/${user?.uid}`}>
                        <div className="font-light text-grey text-[15px]">
                          {user.badge}
                        </div>
                        <div className="font-bold text-2xl">{user.name}</div>
                      </Link>
                      <div className="flex flex-row gap-1 font-light text-grey text-nowrap text-[15px]">
                        <img src="/icons/Location.svg" alt="" /> {user?.state},{" "}
                        {user?.city}
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex flex-row gap-5 w-full justify-center items-center">
                  <div className="w-full md:w-fit">
                    <button
                      className={`w-full py-2.5 px-5 flex flex-row justify-center items-center gap-1.5 shadow-md shadow-grey bg-black rounded-sm hover:scale-110 hover:cursor-pointer transition`}
                    >
                      <img
                        className="w-7 h-auto"
                        src="/icons/Phone.svg"
                        alt=""
                      />
                      <span className={`text-white text-[22px] font-[500]`}>
                        {user.phone_num}
                      </span>
                    </button>
                  </div>
                  <div className="w-full md:w-fit">
                    <button
                      onClick={handleChat}
                      className={`w-full py-2.5 px-5 flex flex-row justify-center items-center gap-1.5 shadow-md shadow-grey bg-blue rounded-sm hover:scale-110 hover:cursor-pointer transition`}
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

              <button
                onClick={handleBuy}
                disabled={isPurchasing || inTransaction}
                className={`bg-yellow text-black rounded-sm shadow-md shadow-grey p-2.5 w-full text-[22px] font-bold flex flex-col justify-center items-center ${
                  isPurchasing || inTransaction
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {isPurchasing ? (
                  <Loading />
                ) : inTransaction ? (
                  "In Transaction..."
                ) : (
                  "Buy now"
                )}
              </button>

              {/* <div
                  id="or"
                  className="flex justify-center items-center gap-[10px] self-stretch"
                >
                  <div className="h-[1px] w-full bg-grey"></div>
                  <span className="text-grey">or</span>
                  <div className="h-[1px] w-full bg-grey"></div>
                </div>

                <div className="flex flex-col gap-5 border-b-1 border-grey w-full">
                  <div className="flex flex-row gap-5 text-black">
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
                  <div className="flex flex-row gap-5 text-black">
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
                  <textarea
                    placeholder="Message"
                    className="rounded-sm border-[1px] border-grey h-30 bg-white w-full p-2.5"
                    defaultValue={`Is this ${moto.brand} ${moto.model} ${moto.trim} still available? `}
                  />
                  <Button
                    textValue={"Send Email"}
                    bg_color={"black"}
                    text_color={"white"}
                    width={"full"}
                    icons={"/icons/Chat.svg"}
                  />
                </div> */}

              <div className="bg-black w-full h-[1px]"></div>
            </div>

            <div className="flex flex-col justify-start items-start gap-2 pt-5">
              <div className="font-semibold">Popularity Stats</div>
              {moto.views === 0 ? (
                <span>You're the first to view this motorcycle</span>
              ) : (
                <div className="flex gap-1">
                  <img src="/icons/Views.svg" alt="" />
                  <span>Seen {moto.views} times</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="flex flex-col items-start justify-start mb-5">
            <div className="font-semibold text-2xl">Description</div>
            <div
              className="w-full ql-editor"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(moto.desc),
              }}
            />
          </div>
          <div className="flex flex-col justify-start items-start gap-5">
            <div className="font-light text-xl underline">
              More From This Dealer
            </div>
            <Carousel
              ref={dealerCarouselRef}
              additionalTransfrom={0}
              arrows
              className="w-full p-2 mb-5"
              containerClass="carousel-container"
              itemClass="carousel-item"
              minimumTouchDrag={80}
              responsive={{
                desktop: {
                  breakpoint: { max: 2560, min: 1920 },
                  items: 14,
                },
                desktop1: {
                  breakpoint: { max: 1920, min: 1440 },
                  items: 9,
                },
                desktop2: {
                  breakpoint: { max: 1440, min: 1024 },
                  items: 7,
                },
                tablet: {
                  breakpoint: { max: 1024, min: 800 },
                  items: 5,
                },
                tablet1: {
                  breakpoint: { max: 800, min: 464 },
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
    </div>
  );
};

export default ProductDetail;
