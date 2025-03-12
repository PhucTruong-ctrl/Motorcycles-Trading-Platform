import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import supabase from "../supabase-client";

const Sell = () => {
  const [user, setUser] = useState(null);
  const [newMoto, setNewMoto] = useState({
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
    condition: "", // "used" hoặc "new"
    desc: "",
    price: "",
    image_url: "", // Link hình ảnh
    video_url: "", // Link video
  });

  // Lấy thông tin user khi component được render
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
            uid: user.id, // Cập nhật uid vào state newMoto
          }));
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  // Hàm xử lý thay đổi giá trị của các input
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewMoto({
      ...newMoto,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Hàm xử lý upload file (hình ảnh hoặc video)
  const handleFileUpload = async (e, fileType) => {
    const file = e.target.files[0];
    if (!file) return;

    // Tạo tên file duy nhất (ví dụ: sử dụng user ID và timestamp)
    const fileName = `${user.id}-${Date.now()}-${file.name}`;

    try {
      // Upload file vào bucket `motorcycle-media`
      const { data, error } = await supabase.storage
        .from("motorcycle-media")
        .upload(fileName, file);

      if (error) {
        throw error;
      }

      // Lấy URL công khai của file
      const { data: publicUrl } = supabase.storage
        .from("motorcycle-media")
        .getPublicUrl(fileName);

      // Cập nhật link vào state newMoto
      if (fileType === "image") {
        setNewMoto({ ...newMoto, image_url: publicUrl.publicUrl });
      } else if (fileType === "video") {
        setNewMoto({ ...newMoto, video_url: publicUrl.publicUrl });
      }

      console.log(`${fileType} uploaded successfully:`, publicUrl.publicUrl);
    } catch (error) {
      console.error(`Error uploading ${fileType}:`, error);
      alert(`Error uploading ${fileType}. Please try again.`);
    }
  };

  // Hàm thêm xe máy vào Supabase
  const addMoto = async (e) => {
    e.preventDefault(); // Ngăn chặn form submit mặc định

    // Kiểm tra xem uid đã được lấy thành công chưa
    if (!newMoto.uid) {
      alert("User not found. Please log in again.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("MOTORCYCLE")
        .insert([newMoto]);

      if (error) {
        throw error;
      }

      console.log("Motorcycle added successfully:", data);
      alert("Motorcycle added successfully!");

      // Reset form sau khi thêm thành công
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
        image_url: "", // Reset link hình ảnh
        video_url: "", // Reset link video
      });
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
            value={newMoto.type}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="brand"
            className="border-2"
            placeholder="brand"
            value={newMoto.brand}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="model"
            className="border-2"
            placeholder="model"
            value={newMoto.model}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="trim"
            className="border-2"
            placeholder="trim"
            value={newMoto.trim}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="mile"
            className="border-2"
            placeholder="mile"
            value={newMoto.mile}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="year"
            className="border-2"
            placeholder="year"
            value={newMoto.year}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="engine_size"
            className="border-2"
            placeholder="engine size"
            value={newMoto.engine_size}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="engine_num"
            className="border-2"
            placeholder="engine num"
            value={newMoto.engine_num}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="chassis_num"
            className="border-2"
            placeholder="chassis num"
            value={newMoto.chassis_num}
            onChange={handleInputChange}
          />
          <div>
            registration
            <input
              type="checkbox"
              name="registration"
              className="border-2"
              checked={newMoto.registration}
              onChange={handleInputChange}
            />
          </div>
          <div>
            condition <br />
            used
            <input
              type="radio"
              name="condition"
              value="used"
              checked={newMoto.condition === "used"}
              onChange={handleInputChange}
            />
            new
            <input
              type="radio"
              name="condition"
              value="new"
              checked={newMoto.condition === "new"}
              onChange={handleInputChange}
            />
          </div>
          <input
            type="text"
            name="desc"
            className="border-2"
            placeholder="desc"
            value={newMoto.desc}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="price"
            className="border-2"
            placeholder="price"
            value={newMoto.price}
            onChange={handleInputChange}
          />
          {/* Nút upload hình ảnh */}
          <div>
            <label>Upload Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, "image")}
            />
            {newMoto.image_url && (
              <img
                src={newMoto.image_url}
                alt="Uploaded"
                className="w-32 h-32 object-cover"
              />
            )}
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
