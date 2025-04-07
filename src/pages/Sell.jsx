import React, { useState, useEffect } from "react";
import supabase from "../supabase-client";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LoadingFull from "../components/LoadingFull";
import { Message } from "../components/Message";
import MotorcycleForm from "../components/MotorcycleForm";
import { useNavigate } from "react-router";
import normalizeFileName from "../components/utils/normalizeFileName";

const Sell = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [brands, setBrands] = useState([]);

  const initialFormData = {
    uid: "",
    brand: "",
    type: "",
    model: "",
    trim: "",
    mile: "",
    year: "",
    engine_size: "",
    engine_num: "",
    chassis_num: "",
    registration: false,
    condition: "",
    desc: "",
    price: "",
    image_url: [],
  };

  const uploadFiles = async (files, userId) => {
    if (!files || files.length === 0) return [];

    const urls = [];

    for (const file of files) {
      const safeFileName = normalizeFileName(file.name);
      const fileName = `${userId}-${Date.now()}-${safeFileName}`;
      const filePath = `${userId}/${fileName}`;

      try {
        const { error } = await supabase.storage
          .from("motorcycle-media")
          .upload(filePath, file);

        if (error) throw error;

        const { data } = supabase.storage
          .from("motorcycle-media")
          .getPublicUrl(filePath);

        urls.push(data.publicUrl);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }

    return urls;
  };

  const handleSubmit = async ({ formData, selectedFiles }) => {
    setSubmitting(true);

    if (!formData.uid) {
      alert("User not found. Please log in again.");
      return;
    }

    const requiredFields = [
      formData.type,
      formData.brand,
      formData.model,
      formData.trim,
      formData.year,
      formData.engine_num,
      formData.chassis_num,
      formData.condition,
      formData.desc,
      formData.price,
    ];

    if (requiredFields.some((field) => !field)) {
      alert("Please fill all required fields");
      return;
    }

    if (formData.condition !== "New" && !formData.mile) {
      alert("Please enter mileage");
      return;
    }

    try {
      let imageUrls = formData.image_url;

      if (selectedFiles && selectedFiles.length > 0) {
        imageUrls = await uploadFiles(selectedFiles.reverse(), currentUser.id);
        if (imageUrls.length === 0) {
          alert("Error uploading images. Please try again.");
          return;
        }
      }

      const selectedBrand = brands.find(
        (brand) => brand.name === formData.brand
      );

      if (!selectedBrand) {
        alert("Invalid brand selected. Please try again.");
        return;
      }

      const { error } = await supabase.from("MOTORCYCLE").insert([
        {
          ...formData,
          brand: selectedBrand.name,
          image_url: imageUrls,
        },
      ]);

      if (error) throw error;

      alert("Motorcycle added successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error adding motorcycle:", error);
      alert("Error adding motorcycle. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const user = session?.user || null;
        setCurrentUser(user);
      } catch (error) {
        console.error("Error fetching current user:", error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data: userData, error: userError } = await supabase
          .from("USER")
          .select("*")
          .eq("uid", currentUser.id)
          .single();

        if (userError) throw userError;

        setUser(userData);

        const { data: brandData, error: brandError } = await supabase
          .from("BRAND")
          .select("*");

        if (brandError) throw brandError;

        setBrands(brandData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  useEffect(() => {
    document.title = "Sell";
  }, []);

  if (loading) {
    return <LoadingFull />;
  }

  if (!user) {
    navigate("/account");
  }

  return (
    <div>
      <main className="my-[15px] mx-[25px]">
        <Message />
        <header className="mb-5">
          <Header />
        </header>

        {user ? (
          <div>
            {user.citizen_id === null && (
              <div>Please update your citizen id!</div>
            )}

            {user.phone_num === null && (
              <div>Please update your phone number!</div>
            )}

            {user.email === null && <div>Please update your email!</div>}

            {user.state === null && <div>Please update your state!</div>}

            {user.city === null && <div>Please update your city!</div>}

            {user.citizen_id != null &&
              user.phone_num != null &&
              user.email != null &&
              user.state != null &&
              user.city != null && (
                <MotorcycleForm
                  initialData={{ ...initialFormData, uid: currentUser?.id }}
                  onSubmit={handleSubmit}
                  isSubmitting={submitting}
                  mode="create"
                />
              )}
          </div>
        ) : (
          <div className="w-full flex justify-center items-center font-bold text-2xl">
            Please log in to sell motorcycle
          </div>
        )}
        <div className="mt-5">
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default Sell;
