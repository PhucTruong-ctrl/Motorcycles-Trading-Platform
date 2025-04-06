import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import supabase from "../supabase-client";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Message } from "../components/Message";
import LoadingFull from "../components/LoadingFull";
import MotorcycleForm from "../components/MotorcycleForm";
import { motorcycleData } from "../data/motorcycleData";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [moto, setMoto] = useState(null);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [filteredTrims, setFilteredTrims] = useState([]);

  const initializeDropdowns = (motoData) => {
    if (!motoData) return;

    const brands = Object.keys(motorcycleData).filter((brand) =>
      Object.keys(motorcycleData[brand]).includes(motoData.type)
    );
    setFilteredBrands(brands);

    const models = motorcycleData[motoData.brand]?.[motoData.type] || [];
    setFilteredModels(models);

    const model = models.find((m) => m.model === motoData.model);
    const trims = model?.trims || [];
    setFilteredTrims(trims);
  };

  const handleDeleteImage = async (imageUrl) => {
    try {
      const updatedImages = moto.image_url.filter((url) => url !== imageUrl);

      setMoto((prev) => ({
        ...prev,
        image_url: updatedImages,
      }));

      const pathParts = imageUrl.split("/");
      const fileName = pathParts[pathParts.length - 1];
      const filePath = `${moto.uid}/${fileName}`;

      const { error } = await supabase.storage
        .from("motorcycle-media")
        .remove([filePath]);

      if (error) throw error;

      console.log("Image deleted successfully");
    } catch (error) {
      console.error("Image delete error:", error);
      setMoto((prev) => ({
        ...prev,
        image_url: [...prev.image_url, imageUrl],
      }));
      alert("Failed to delete image. Please try again.");
    }
  };

  const handleSubmit = async ({ formData, selectedFiles }) => {
    setSubmitting(true);

    try {
      // Upload ảnh mới nếu có
      let newImageUrls = [];
      if (selectedFiles && selectedFiles.length > 0) {
        for (const file of selectedFiles.reverse()) {
          const fileName = `${moto.uid}-${Date.now()}-${file.name}`;
          const filePath = `${moto.uid}/${fileName}`;

          const { error } = await supabase.storage
            .from("motorcycle-media")
            .upload(filePath, file);

          if (error) throw error;

          const {
            data: { publicUrl },
          } = await supabase.storage
            .from("motorcycle-media")
            .getPublicUrl(filePath);

          newImageUrls.push(publicUrl);
        }
      }

      const payload = {
        ...formData,
        image_url: [...moto.image_url, ...newImageUrls],
      };

      const { error } = await supabase
        .from("MOTORCYCLE")
        .update(payload)
        .eq("id", id)
        .eq("uid", moto.uid);

      if (error) throw error;

      alert("Update successful!");

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
    } catch (error) {
      console.error("Update error:", error);
      alert("Update failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: motoData, error: motoError } = await supabase
          .from("MOTORCYCLE")
          .select("*")
          .eq("id", id)
          .single();

        if (motoError) throw motoError;

        setMoto({
          ...motoData,
          image_url: motoData.image_url || [],
        });

        initializeDropdowns(motoData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <LoadingFull />;
  if (error) return <div>Error: {error.message}</div>;
  if (!moto) return <div>Product not found</div>;

  return (
    <div>
      <main className="my-[15px] mx-[25px]">
        <Message />
        <header className="mb-5">
          <Header />
        </header>

        {moto && (
          <MotorcycleForm
            initialData={moto}
            onSubmit={handleSubmit}
            isSubmitting={submitting}
            mode="edit"
            onDeleteImage={handleDeleteImage}
            initialBrands={filteredBrands}
            initialModels={filteredModels}
            initialTrims={filteredTrims}
          />
        )}

        <div className="mt-5">
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default EditProduct;
