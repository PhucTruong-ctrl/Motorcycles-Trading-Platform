import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import supabase from "../supabase-client";
import Select from "react-dropdown-select";
import { motorcycleData } from "../data/motorcycleData";

const Sell = () => {
  const [user, setUser] = useState(null);
  const [NewMoto, setNewMoto] = useState({
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
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [brands, setBrands] = useState([]); // State để lưu danh sách brand

  const typeOptions = [
    { value: "naked", label: "Naked" },
    { value: "cruiser", label: "Cruiser" },
    { value: "touring", label: "Touring" },
    { value: "sport", label: "Sport" },
    { value: "offroad", label: "Offroad" },
    { value: "adventure", label: "Adventure" },
    { value: "sport touring", label: "Sport Touring" },
    { value: "scooters", label: "Scooters" },
    { value: "underbones", label: "Underbones" },
  ];

  const [filteredBrands, setFilteredBrands] = useState([]); // Lưu danh sách brand sau khi lọc
  const [filteredModels, setFilteredModels] = useState([]); // Lưu danh sách model sau khi lọc
  const [filteredTrims, setFilteredTrims] = useState([]); // Lưu danh sách trim sau khi lọc

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          setNewMoto((prevState) => ({
            ...prevState,
            uid: user.id,
          }));
        }

        const { data, error } = await supabase.from("BRAND").select("*"); // Lấy tất cả các brand

        if (error) {
          throw error;
        }

        console.log("Fetched brands:", data); // Kiểm tra dữ liệu brand
        setBrands(data || []); // Lưu danh sách brand vào state
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchData();
  }, []);

  const handleTypeChange = (selectedOptions) => {
    if (selectedOptions.length > 0) {
      const selectedType = selectedOptions[0].value;

      // Lọc danh sách brand dựa trên type đã chọn
      const brandsForType = Object.keys(motorcycleData).filter((brand) =>
        Object.keys(motorcycleData[brand]).includes(selectedType)
      );

      console.log("Filtered brands for type:", brandsForType); // Kiểm tra danh sách brand sau khi lọc
      setFilteredBrands(brandsForType); // Cập nhật danh sách brand
      setFilteredModels([]); // Reset danh sách model
      setFilteredTrims([]); // Reset danh sách trim

      setNewMoto((prevState) => ({
        ...prevState,
        type: selectedType,
        brand: "", // Reset brand khi type thay đổi
        model: "", // Reset model khi type thay đổi
        trim: "", // Reset trim khi type thay đổi
      }));
    }
  };

  const handleBrandChange = (selectedOptions) => {
    if (selectedOptions.length > 0) {
      const selectedBrand = selectedOptions[0].value;

      console.log("Selected brand ID:", selectedBrand); // Kiểm tra giá trị brand được chọn

      // Lọc danh sách model dựa trên type và brand đã chọn
      const modelsForBrandAndType =
        motorcycleData[selectedBrand]?.[NewMoto.type] || [];

      setFilteredModels(modelsForBrandAndType); // Cập nhật danh sách model
      setFilteredTrims([]); // Reset danh sách trim

      setNewMoto((prevState) => ({
        ...prevState,
        brand: selectedBrand, // Lưu id của brand
        model: "", // Reset model khi brand thay đổi
        trim: "", // Reset trim khi brand thay đổi
      }));
    }
  };

  const handleModelChange = (selectedOptions) => {
    if (selectedOptions.length > 0) {
      const selectedModel = selectedOptions[0].value;
      console.log("Selected brand ID:", selectedModel);

      // Lọc danh sách trim dựa trên type, brand, và model đã chọn
      const trimsForModel =
        motorcycleData[NewMoto.brand]?.[NewMoto.type]?.find(
          (model) => model.model === selectedModel
        )?.trims || [];

      setFilteredTrims(trimsForModel); // Cập nhật danh sách trim

      setNewMoto((prevState) => ({
        ...prevState,
        model: selectedModel,
        trim: "", // Reset trim khi model thay đổi
      }));
    }
  };

  const handleTrimChange = (selectedOptions) => {
    if (selectedOptions.length > 0) {
      console.log("Selected brand ID:", selectedOptions[0].value);
      setNewMoto((prevState) => ({
        ...prevState,
        trim: selectedOptions[0].value,
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewMoto({
      ...NewMoto,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files) {
      setSelectedFile(files);
    }
  };

  const uploadFiles = async (files) => {
    if (!files || files.length === 0) return [];

    const urls = [];
    const reversedFiles = files.toReversed();

    for (const file of reversedFiles) {
      const fileName = `${user.id}-${Date.now()}-${file.name}`;
      try {
        const { error } = await supabase.storage
          .from("motorcycle-media")
          .upload(fileName, file);

        if (error) throw error;

        const { data: publicUrl } = supabase.storage
          .from("motorcycle-media")
          .getPublicUrl(fileName);

        urls.push(publicUrl.publicUrl);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }

    return urls;
  };

  const addMoto = async (e) => {
    e.preventDefault();

    if (!NewMoto.uid) {
      alert("User not found. Please log in again.");
      return;
    }

    console.log("NewMoto before submission:", NewMoto); // Kiểm tra giá trị NewMoto trước khi gửi

    try {
      let imageUrls = NewMoto.image_url;

      if (selectedFile && selectedFile.length > 0) {
        imageUrls = await uploadFiles(selectedFile);
        if (imageUrls.length === 0) {
          alert("Error uploading images. Please try again.");
          return;
        }
      }

      // Tìm tên brand từ danh sách brands
      const selectedBrand = brands.find(
        (brand) => brand.name === NewMoto.brand
      );
      console.log("Selected brand:", selectedBrand); // Kiểm tra giá trị selectedBrand

      if (!selectedBrand) {
        alert("Invalid brand selected. Please try again.");
        return;
      }

      const brandName = selectedBrand.name;

      const { data, error } = await supabase.from("MOTORCYCLE").insert([
        {
          ...NewMoto,
          brand: brandName, // Chèn tên brand vào cột brand
          model: NewMoto.model,
          trim: NewMoto.trim,
          image_url: imageUrls,
        },
      ]);

      if (error) {
        throw error;
      }

      console.log("Motorcycle added successfully:", data);
      alert("Motorcycle added successfully!");

      // Reset form after success
      setNewMoto({
        uid: user.id,
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
      });
      setSelectedFile([]);
    } catch (error) {
      console.error("Error adding motorcycle:", error);
      alert("Error adding motorcycle. Please try again.");
    }
  };

  return (
    <div>
      <main className="my-[15px] mx-[25px]">
        <header className="mb-5">
          <Header />
        </header>

        <div className="border-4 flex justify-center items-center">
          <form
            className="flex flex-col gap-5 items-center justify-center border-2 border-red"
            onSubmit={addMoto}
          >
            <Select
              options={typeOptions}
              onChange={handleTypeChange}
              values={typeOptions.filter(
                (option) => option.value === NewMoto.type
              )}
              placeholder="Select a type"
              searchable
              className="border-2"
            />

            <Select
              options={filteredBrands.map((brand) => ({
                label: brand,
                value: brand,
              }))}
              onChange={handleBrandChange}
              values={filteredBrands
                .map((brand) => ({ label: brand, value: brand }))
                .filter((option) => option.value === NewMoto.brand)}
              placeholder="Select a brand"
              searchable
              className="border-2"
              disabled={!NewMoto.type} // Vô hiệu hóa nếu chưa chọn type
            />

            <Select
              options={filteredModels.map((model) => ({
                label: model.model,
                value: model.model,
              }))}
              onChange={handleModelChange}
              values={filteredModels
                .map((model) => ({ label: model.model, value: model.model }))
                .filter((option) => option.value === NewMoto.model)}
              placeholder="Select a model"
              searchable
              className="border-2"
              disabled={!NewMoto.brand} // Vô hiệu hóa nếu chưa chọn brand
            />

            <Select
              options={filteredTrims.map((trim) => ({
                label: trim,
                value: trim,
              }))}
              onChange={handleTrimChange}
              values={filteredTrims
                .map((trim) => ({ label: trim, value: trim }))
                .filter((option) => option.value === NewMoto.trim)}
              placeholder="Select a trim"
              searchable
              className="border-2"
              disabled={!NewMoto.model} // Vô hiệu hóa nếu chưa chọn model
            />
            <input
              type="text"
              name="mile"
              className="border-2"
              placeholder="mile"
              value={NewMoto.mile}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="year"
              className="border-2"
              placeholder="year"
              value={NewMoto.year}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="engine_size"
              className="border-2"
              placeholder="engine size"
              value={NewMoto.engine_size}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="engine_num"
              className="border-2"
              placeholder="engine num"
              value={NewMoto.engine_num}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="chassis_num"
              className="border-2"
              placeholder="chassis num"
              value={NewMoto.chassis_num}
              onChange={handleInputChange}
            />
            <div>
              registration
              <input
                type="checkbox"
                name="registration"
                className="border-2"
                checked={NewMoto.registration}
                onChange={handleInputChange}
              />
            </div>
            <div>
              condition <br />
              Used
              <input
                type="radio"
                name="condition"
                value="Used"
                checked={NewMoto.condition === "Used"}
                onChange={handleInputChange}
              />
              New
              <input
                type="radio"
                name="condition"
                value="New"
                checked={NewMoto.condition === "New"}
                onChange={handleInputChange}
              />
            </div>
            <input
              type="text"
              name="desc"
              className="border-2"
              placeholder="desc"
              value={NewMoto.desc}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="price"
              className="border-2"
              placeholder="price"
              value={NewMoto.price}
              onChange={handleInputChange}
            />
            {}
            <div>
              <label>Upload Images:</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
              />
              <div className="flex gap-2 mt-2">
                {selectedFile &&
                  selectedFile
                    .toReversed()
                    .map((file, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(file)}
                        alt="Selected"
                        className="w-32 h-32 object-cover"
                      />
                    ))}
              </div>
            </div>

            <button type="submit" className="bg-amber-800">
              Add Motorcycle
            </button>
          </form>
        </div>
        <div className="mb-5">
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default Sell;
