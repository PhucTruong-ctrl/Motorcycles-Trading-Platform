import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import supabase from "../supabase-client";

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

  useEffect(() => {
    const fetchUser = async () => {
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
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

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

    for (const file of files) {
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

    try {
      let imageUrls = NewMoto.image_url;

      if (selectedFile && selectedFile.length > 0) {
        imageUrls = await uploadFiles(selectedFile);
        if (imageUrls.length === 0) {
          alert("Error uploading images. Please try again.");
          return;
        }
      }

      const { data, error } = await supabase
        .from("MOTORCYCLE")
        .insert([{ ...NewMoto, image_url: imageUrls }]); // Lưu mảng ảnh vào DB

      if (error) {
        throw error;
      }

      console.log("Motorcycle added successfully:", data);
      alert("Motorcycle added successfully!");

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
        <form className="flex flex-col gap-5 items-start" onSubmit={addMoto}>
          <input
            type="text"
            name="type"
            className="border-2"
            placeholder="type"
            value={NewMoto.type}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="brand"
            className="border-2"
            placeholder="brand"
            value={NewMoto.brand}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="model"
            className="border-2"
            placeholder="model"
            value={NewMoto.model}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="trim"
            className="border-2"
            placeholder="trim"
            value={NewMoto.trim}
            onChange={handleInputChange}
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
                selectedFile.map((file, index) => (
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
        <div className="mb-5">
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default Sell;
