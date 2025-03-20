import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import supabase from "../supabase-client";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Select from "react-dropdown-select";
import { motorcycleData } from "../data/motorcycleData";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [moto, setMoto] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);

  const [filteredBrands, setFilteredBrands] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [filteredTrims, setFilteredTrims] = useState([]);
  const typeOptions = [
    { value: "naked", label: "Naked" },
    { value: "cruiser", label: "Cruiser" },
    { value: "touring", label: "Touring" },
    { value: "sport", label: "Sport" },
    { value: "offroad", label: "Offroad" },
    { value: "adventure", label: "Adventure" },
    { value: "sportTouring", label: "Sport Touring" },
    { value: "scooters", label: "Scooters" },
    { value: "underbones", label: "Underbones" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: motoData, error: motoError } = await supabase
          .from("MOTORCYCLE")
          .select("*")
          .eq("id", id)
          .single();

        if (motoError) throw motoError;

        initializeDropdowns(motoData);
        setMoto({
          ...motoData,
          image_url: motoData.image_url || [],
        });
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const initializeDropdowns = (motoData) => {
    const type = motoData.type;
    const brands = Object.keys(motorcycleData).filter((brand) =>
      Object.keys(motorcycleData[brand]).includes(type)
    );
    setFilteredBrands(brands);

    const brand = motoData.brand;
    const models = motorcycleData[brand]?.[type] || [];
    setFilteredModels(models);

    const model = motoData.model;
    const trims = models.find((m) => m.model === model)?.trims || [];
    setFilteredTrims(trims);
  };

  const handleTypeChange = (selectedOptions) => {
    const type = selectedOptions[0]?.value;
    if (!type) return;

    const brands = Object.keys(motorcycleData).filter((brand) =>
      Object.keys(motorcycleData[brand]).includes(type)
    );

    setFilteredBrands(brands);
    setFilteredModels([]);
    setFilteredTrims([]);

    setMoto((prev) => ({
      ...prev,
      type,
      brand: "",
      model: "",
      trim: "",
    }));
  };

  const handleBrandChange = (selectedOptions) => {
    const brand = selectedOptions[0]?.value;
    if (!brand) return;

    const models = motorcycleData[brand]?.[moto.type] || [];

    setFilteredModels(models);
    setFilteredTrims([]);

    setMoto((prev) => ({
      ...prev,
      brand,
      model: "",
      trim: "",
    }));
  };

  const handleModelChange = (selectedOptions) => {
    const model = selectedOptions[0]?.value;
    if (!model) return;

    const trims = filteredModels.find((m) => m.model === model)?.trims || [];

    setFilteredTrims(trims);
    setMoto((prev) => ({
      ...prev,
      model,
      trim: "",
    }));
  };

  const handleDeleteImage = async (imageUrl) => {
    try {
      const pathParts = imageUrl.split("/");
      const fileName = pathParts[pathParts.length - 1];
      const filePath = `${moto.uid}/${fileName}`;

      const { error } = await supabase.storage
        .from("motorcycle-media")
        .remove([filePath]);
      console.log(filePath);

      if (error) throw error;

      setMoto((prev) => ({
        ...prev,
        image_url: prev.image_url.filter((url) => url !== imageUrl),
      }));

      setDeletedImages((prev) => [...prev, imageUrl]);
    } catch (error) {
      console.error("Image delete error:", error);
      alert("Image delete failed!");
    }
  };

  const uploadNewImages = async () => {
    if (!selectedFiles.length) return [];
    const reverseFiles = selectedFiles.toReversed();
    const newUrls = [];
    for (const file of reverseFiles) {
      const filePath = `${moto.uid}/${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from("motorcycle-media")
        .upload(filePath, file);

      if (error) throw error;

      const {
        data: { publicUrl },
      } = await supabase.storage
        .from("motorcycle-media")
        .getPublicUrl(filePath);

      newUrls.push(publicUrl);
    }
    return newUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newImageUrls = await uploadNewImages();

      const payload = {
        ...moto,
        uid: moto.uid,
        image_url: [...moto.image_url, ...newImageUrls],
      };

      const { error } = await supabase
        .from("MOTORCYCLE")
        .update(payload)
        .eq("id", id)
        .eq("uid", moto.uid);

      if (error) throw error;

      if (deletedImages.length > 0) {
        const paths = deletedImages.map((url) => {
          const parts = url.split("/");
          return parts[parts.length - 1];
        });

        await supabase.storage.from("motorcycle-media").remove(paths);
      }

      if (!moto.type || !moto.brand || !moto.model) {
        alert("Please fill all the information");
        return;
      }

      alert("Update complete!");
      navigate(
        `/${moto.type}/${moto.brand}/${moto.model}/${moto.trim}/${moto.year}/${moto.uid}/${moto.id}`
      );
    } catch (error) {
      console.error("Update error:", error);
      alert("Update failed!");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!moto) return <div>Product not found</div>;

  return (
    <div>
      <main className="my-[15px] mx-[25px]">
        <Header />

        <form onSubmit={handleSubmit} className="edit-form">
          {}
          <div className="w-fit">
            <Select
              options={typeOptions}
              onChange={handleTypeChange}
              values={typeOptions.filter((opt) => opt.value === moto.type)}
              placeholder="Select type"
            />
            <Select
              options={filteredBrands.map((b) => ({ label: b, value: b }))}
              onChange={handleBrandChange}
              values={[{ label: moto.brand, value: moto.brand }]}
              placeholder="Select brand"
              disabled={!moto.type}
            />

            <Select
              options={filteredModels.map((m) => ({
                label: m.model,
                value: m.model,
              }))}
              onChange={handleModelChange}
              values={[{ label: moto.model, value: moto.model }]}
              placeholder="Select model"
              disabled={!moto.brand}
            />

            <Select
              options={filteredTrims.map((t) => ({ label: t, value: t }))}
              onChange={(selected) =>
                setMoto((prev) => ({
                  ...prev,
                  trim: selected[0]?.value,
                }))
              }
              values={[{ label: moto.trim, value: moto.trim }]}
              placeholder="Select trim"
              disabled={!moto.model}
            />
          </div>

          <div>
            <div>Mileage</div>
            <input
              name="mile"
              value={moto.mile}
              onChange={(e) =>
                setMoto((prev) => ({
                  ...prev,
                  mile: e.target.value,
                }))
              }
              className="border-2"
            />
          </div>
          <div>
            <div>Year</div>
            <input
              name="year"
              value={moto.year}
              onChange={(e) =>
                setMoto((prev) => ({
                  ...prev,
                  year: e.target.value,
                }))
              }
              className="border-2"
            />
          </div>
          <div>
            <div>Description</div>
            <input
              name="desc"
              value={moto.desc}
              onChange={(e) =>
                setMoto((prev) => ({
                  ...prev,
                  desc: e.target.value,
                }))
              }
              className="border-2"
            />
          </div>
          <div>
            <div>Engine Number</div>
            <input
              name="engine_num"
              value={moto.engine_num}
              onChange={(e) =>
                setMoto((prev) => ({
                  ...prev,
                  engine_num: e.target.value,
                }))
              }
              className="border-2"
            />
          </div>
          <div>
            <div>Chasiss Number</div>
            <input
              name="chassis_num"
              value={moto.chassis_num}
              onChange={(e) =>
                setMoto((prev) => ({
                  ...prev,
                  chassis_num: e.target.value,
                }))
              }
              className="border-2"
            />
          </div>
          <div>
            <div>Price</div>
            <input
              name="price"
              value={moto.price}
              onChange={(e) =>
                setMoto((prev) => ({
                  ...prev,
                  price: e.target.value,
                }))
              }
              className="border-2"
            />
          </div>

          {}
          <div className="image-section">
            <h3>Current Images:</h3>
            <div className="image-grid grid grid-cols-10">
              {moto.image_url.map((url, index) => (
                <div key={index}>
                  <img
                    src={url}
                    alt={`Preview ${index}`}
                    className="w-50 h-50 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(url)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="new-images">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setSelectedFiles([...e.target.files])}
            />
            <div className="previews">
              {selectedFiles.map((file, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="preview-image"
                />
              ))}
            </div>
          </div>

          <button type="submit">Save Changes</button>
        </form>

        <Footer />
      </main>
    </div>
  );
};

export default EditProduct;
