import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import supabase from "../supabase-client";
import Select from "react-dropdown-select";
import Modal from "react-modal";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { ReputationMessage } from "../components/ReputationMessage";
import EditProfile from "./../components/EditProfile";

Modal.setAppElement("#root");

const Profile = () => {
  const { uid } = useParams();
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [moto, setMoto] = useState(null);
  const [rep, setRep] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [atListing, setAtListing] = useState(true);
  const [repType, setRepType] = useState(null);
  const [alreadyRep, setAlreadyRep] = useState(false);
  const [repMessage, setRepMessage] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUser(session.user);
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!uid || !currentUser) return;

    const fetchData = async () => {
      try {
        const { data: userData, error: userError } = await supabase
          .from("USER")
          .select("*")
          .eq("uid", uid)
          .single();

        if (userError) throw userError;
        setUser(userData);

        const { data: motoData, error: motoError } = await supabase
          .from("MOTORCYCLE")
          .select("*")
          .eq("uid", uid);

        if (motoError) throw motoError;
        setMoto(motoData);

        const { data: repData, error: repError } = await supabase
          .from("REPUTATION")
          .select("*")
          .eq("uid_rep", uid);

        if (repError) throw repError;
        setRep(repData || []);

        const { data: existingRep, error: checkError } = await supabase
          .from("REPUTATION")
          .select("*")
          .eq("uid_rep", uid)
          .eq("uid_send_rep", currentUser.id)
          .maybeSingle();

        if (checkError && checkError.code !== "PGRST116") {
          throw checkError;
        }

        if (existingRep) {
          setAlreadyRep(true);
        } else {
          setAlreadyRep(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uid, currentUser]);

  const ListingButton = () => {
    setAtListing(true);
  };
  const ReputationButton = () => {
    setAtListing(false);
  };

  const sendRep = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Please login to send reputation");
    }

    if (!repType || repMessage.trim() === "") {
      alert("You need to select rep type and enter rep message");
    }

    try {
      const { rep_data, rep_error } = await supabase.from("REPUTATION").insert([
        {
          uid_rep: uid,
          uid_send_rep: currentUser.id,
          rep_message: repMessage,
          is_positive_rep: repType,
        },
      ]);

      console.log("Reputation Data: ", rep_data);

      if (rep_error) throw rep_error;

      if (repType) {
        const { user_data, user_error } = await supabase
          .from("USER")
          .update({ reputation: user.reputation + 1 })
          .eq("uid", uid)
          .select();

        console.log("User Data: ", user_data);

        if (user_error) {
          console.error("Error updating rep:", error);
          return;
        }
      } else {
        const { user_data, user_error } = await supabase
          .from("USER")
          .update({ bad_rep: user.bad_rep + 1 })
          .eq("uid", uid)
          .select();

        console.log("User Data: ", user_data);

        if (user_error) {
          console.error("Error updating rep:", error);
          return;
        }
      }
      alert("Rep sended");
    } catch (error) {
      console.error("Rep send error", error);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const fileName = `avatar_${Date.now()}_${file.name}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("user-media")
        .upload(`${currentUser.id}/${fileName}`, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("user-media")
        .getPublicUrl(`${currentUser.id}/${fileName}`);

      const newAvatarUrl = publicUrlData.publicUrl;

      if (user?.avatar_url) {
        const oldFileName = user.avatar_url.split("/").pop();
        const { error: deleteError } = await supabase.storage
          .from("user-media")
          .remove([`${currentUser.id}/${oldFileName}`]);

        if (deleteError) throw deleteError;
      }

      const { data: userData, error: userError } = await supabase
        .from("USER")
        .update({ avatar_url: newAvatarUrl })
        .eq("uid", uid)
        .select();

      if (userError) throw userError;

      setUser({ ...user, avatar_url: newAvatarUrl });

      alert("Avatar updated successfully!");
    } catch (error) {
      console.error("Error updating avatar:", error);
      alert("Failed to update avatar.");
    }
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const fileName = `banner_${Date.now()}_${file.name}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("user-media")
        .upload(`${currentUser.id}/${fileName}`, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("user-media")
        .getPublicUrl(`${currentUser.id}/${fileName}`);

      const newBannerUrl = publicUrlData.publicUrl;

      if (user?.banner_url) {
        const oldFileName = user.avatar_url.split("/").pop();
        const { error: deleteError } = await supabase.storage
          .from("user-media")
          .remove([`${currentUser.id}/${oldFileName}`]);

        if (deleteError) throw deleteError;
      }

      const { data: userData, error: userError } = await supabase
        .from("USER")
        .update({ banner_url: newBannerUrl })
        .eq("uid", uid)
        .select();

      if (userError) throw userError;

      setUser({ ...user, banner_url: newBannerUrl });

      alert("Banner updated successfully!");
    } catch (error) {
      console.error("Error updating Banner:", error);
      alert("Failed to update Banner.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <main className="my-[15px] mx-[25px]">
        <header className="mb-5">
          <Header />
        </header>
        <div className="flex flex-col gap-4">
          <div className="relative rounded-xl w-full h-[270px] overflow-hidden flex justify-center items-center">
            <img
              src={user?.banner_url}
              alt=""
              className="object-cover w-full h-full"
            />
            {currentUser?.id === uid && (
              <div className="absolute">
                <label htmlFor="avt-upload">
                  <img
                    src="/icons/Upload.svg"
                    alt=""
                    className="w-30 opacity-0 hover:opacity-70 bg-white rounded-md cursor-pointer transition"
                  />
                </label>
                <input
                  id="avt-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBannerUpload}
                />
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-6 w-full bg-white rounded-xl shadow-md relative p-5">
            <div className="relative flex justify-center items-center">
              <img
                src={user?.avatar_url}
                alt=""
                className="w-[150px] h-[150px] rounded-xl border-2 border-grey"
              />
              {currentUser?.id === uid && (
                <div className="absolute">
                  <label htmlFor="avt-upload">
                    <img
                      src="/icons/Upload.svg"
                      alt=""
                      className="w-15 opacity-0 hover:opacity-70 bg-white rounded-md cursor-pointer transition"
                    />
                  </label>
                  <input
                    id="avt-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </div>
              )}
            </div>
            <div className="flex flex-row gap-6 justify-center items-center">
              <div className="flex flex-col gap-2.5">
                <h2>{user?.name}</h2>
                <div className="flex flex-row gap-2 justify-start items-center">
                  <img src="/icons/Location.svg" alt="" className="w-2.5" />
                  <div className="font-light text-[16px]">
                    {user?.state}, {user?.city}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                <div className="text-2xl font-light text-grey">
                  +{user?.reputation} Reputation
                </div>
                <div className="text-[16px] font-light text-grey">
                  {user?.badge}
                </div>
              </div>
            </div>
            {currentUser?.id === uid && (
              <button
                className="font-bold text-[24px] text-black absolute right-5 top-5"
                onClick={() => setModalIsOpen(true)}
              >
                Edit Profile
              </button>
            )}
          </div>

          <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            contentLabel="Edit Profile"
            className="fixed inset-0 flex items-center justify-center"
            overlayClassName=""
          >
            <EditProfile user={user} onClose={() => setModalIsOpen(false)} />
          </Modal>

          <div className="bg-white w-full h-20 rounded-xl shadow-md flex flex-row gap-12 justify-start items-center p-5">
            <button
              className={`font-bold text-[28px] text-blue ${atListing ? "border-b-2" : "border-b-0"}`}
              onClick={ListingButton}
            >
              Listing
            </button>
            <button
              className={`font-bold text-[28px] text-blue ${atListing === false ? "border-b-2" : "border-b-0"}`}
              onClick={ReputationButton}
            >
              Reputation
            </button>
          </div>

          {atListing ? (
            <div className="w-full">
              <div className="w-full flex flex-row flex-wrap justify-start items-start gap-8 overflow-hidden p-4">
                {moto.map((moto) => (
                  <ProductCard key={moto.id} moto={moto} />
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full">
              {currentUser.id !== uid && alreadyRep === false && (
                <form
                  onSubmit={sendRep}
                  className="flex flex-col gap-3 items-center justify-center bg-white shadow-md p-10 rounded-[6px]"
                >
                  <Select
                    options={[
                      { value: true, label: "+1 Positive" },
                      { value: false, label: "Report" },
                    ]}
                    placeholder="Send a reputation"
                    onChange={(selected) => setRepType(selected[0]?.value)}
                  />
                  <input
                    type="text"
                    className="border-2"
                    value={repMessage || ""}
                    onChange={(e) => setRepMessage(e.target.value)}
                    placeholder="Enter your reputation message"
                  />
                  <button type="submit" className="border-2">
                    Submit
                  </button>
                </form>
              )}
              <div className="flex flex-col gap-5 w-full mt-2">
                {rep && rep.length > 0 ? (
                  rep.map((repItem) => (
                    <div key={repItem.id}>
                      <ReputationMessage
                        uid_send={repItem.uid_send_rep}
                        message={repItem.rep_message}
                        created_at={repItem.created_at}
                        type={repItem.is_positive_rep ? "Positive" : "Report"}
                      />
                    </div>
                  ))
                ) : (
                  <p>No reputation available.</p>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="mt-5">
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default Profile;
