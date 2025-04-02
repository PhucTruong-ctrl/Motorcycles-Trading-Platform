import React, { useState, useEffect } from "react";
import Select from "react-select";
import geodata from "../data/US_States_and_Cities.json";
import supabase from "../supabase-client";

const EditProfile = ({ user, onClose }) => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone_num: user?.phone_num || "",
    citizen_id: user?.citizen_id || "",
    birthdate: user?.birthdate || "",
    is_man: user?.is_man ?? null,
    state: user?.state || "",
    city: user?.city || "",
  });

  useEffect(() => {
    const stateList = Object.keys(geodata).map((state) => ({
      value: state,
      label: state,
    }));
    setStates(stateList);
  }, []);

  useEffect(() => {
    if (user?.state) {
      setSelectedState(user.state);
      if (geodata[user.state]) {
        const cityList = geodata[user.state].map((city) => ({
          value: city,
          label: city,
        }));
        setCities(cityList);
      }
    }
    if (user?.city) {
      setSelectedCity(user.city);
    }
  }, [user]);

  const handleStateChange = (selected) => {
    if (selected.length === 0) {
      setSelectedState(null);
      setCities([]);
      setSelectedCity(null);
      return;
    }

    const stateName = selected[0]?.value;
    setSelectedState(stateName);

    const cityList = geodata[stateName].map((city) => ({
      value: city,
      label: city,
    }));
    setCities(cityList);

    setSelectedCity(null);
  };

  const handleCityChange = (selected) => {
    setSelectedCity(selected.length > 0 ? selected[0]?.value : null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRadioChange = (e) => {
    const value = e.target.value === "true";
    setFormData((prev) => ({
      ...prev,
      is_man: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase
        .from("USER")
        .update({
          name: formData.name,
          email: formData.email,
          phone_num: parseInt(formData.phone_num, 10),
          citizen_id: parseInt(formData.citizen_id, 10),
          birthdate: formData.birthdate,
          is_man: formData.is_man,
          state: selectedState,
          city: selectedCity,
        })
        .eq("uid", user.uid)
        .select();

      console.log("Data: ", data);
      if (error) throw error;

      onClose();
      alert("Profile updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Update error:", error);
      alert("Update failed!");
    }
  };

  return (
    <div className="m-5 p-5 flex flex-col gap-5 border-2 w-150 h-fit rounded-xl bg-white">
      <div className="flex flex-row justify-between pb-2.5 border-b-1 border-grey">
        <div id="title" className="font-bold text-2xl">
          Edit Profile
        </div>
        <button onClick={onClose} id="title" className="font-bold text-2xl">
          <img src="/icons/Close.svg" alt="" />
        </button>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 justify-between pb-2.5"
      >
        <div id="name" className="flex flex-col gap-1">
          <label htmlFor="nameInput" className="text-[16px] text-grey">
            Name
          </label>
          <input
            id="nameInput"
            name="name"
            type="text"
            required
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleInputChange}
            className="p-2.5 border-1 border-grey rounded-sm w-full h-10 bg-bg-white"
          />
        </div>
        <div id="email" className="flex flex-col gap-1">
          <label htmlFor="nameInput" className="text-[16px] text-grey">
            Email
          </label>
          <input
            id="emailInput"
            name="email"
            type="text"
            required
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            className="p-2.5 border-1 border-grey rounded-sm w-full h-10 bg-bg-white"
          />
        </div>
        <div id="phoneNumber" className="flex flex-col gap-1">
          <label htmlFor="nameInput" className="text-[16px] text-grey">
            Phone Number
          </label>
          <input
            name="phone_num"
            id="phoneInput"
            type="text"
            required
            placeholder="Enter your phone number"
            value={formData.phone_num}
            onChange={handleInputChange}
            className="p-2.5 border-1 border-grey rounded-sm w-full h-10 bg-bg-white"
          />
        </div>
        <div id="citizenId" className="flex flex-col gap-1">
          <label htmlFor="nameInput" className="text-[16px] text-grey">
            Citizen ID
          </label>
          <input
            id="phoneInput"
            name="citizen_id"
            type="text"
            required
            placeholder="Enter your citizen id"
            value={formData.citizen_id}
            onChange={handleInputChange}
            className="p-2.5 border-1 border-grey rounded-sm w-full h-10 bg-bg-white"
          />
        </div>
        <div id="birthdate" className="flex flex-col gap-1">
          <label htmlFor="nameInput" className="text-[16px] text-grey">
            Birthdate
          </label>
          <input
            id="birthInput"
            type="date"
            name="birthdate"
            required
            placeholder="Enter your phone number"
            value={formData.birthdate}
            onChange={handleInputChange}
            className="p-2.5 border-1 border-grey rounded-sm w-full h-10 bg-bg-white"
          />
        </div>
        <div id="sex" className="flex flex-col gap-1">
          <label htmlFor="is_man" className="text-[16px] text-grey">
            Sex
          </label>
          <div className="flex flex-row gap-5 justify-center items-center">
            <div className="flex flex-row gap-2 justify-start items-center">
              <label htmlFor="boy">Male</label>
              <input
                name="is_man"
                id="male"
                type="radio"
                required
                value={true}
                checked={formData.is_man === true}
                onChange={handleRadioChange}
                className="w-6 h-6"
              />
            </div>
            <div className="flex flex-row gap-2 justify-start items-center">
              <label htmlFor="girl">Female</label>
              <input
                name="is_man"
                id="female"
                type="radio"
                required
                value={false}
                checked={formData.is_man === false}
                onChange={handleRadioChange}
                className="w-6 h-6"
              />
            </div>
          </div>
        </div>

        <div
          id="location"
          className="flex flex-row justify-evenly items-center gap-5"
        >
          <div className="flex flex-col gap-1 w-full">
            <label className="text-[16px] text-grey">State</label>
            <Select
              options={states}
              value={states.find((option) => option.value === selectedState)}
              onChange={(selectedOption) => handleStateChange([selectedOption])}
              placeholder="Select a state"
              isSearchable
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-[16px] text-grey">City</label>
            <Select
              options={cities}
              value={cities.find((option) => option.value === selectedCity)}
              onChange={(selectedOption) => handleCityChange([selectedOption])}
              placeholder="Select a city"
              isSearchable
              isDisabled={!selectedState}
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full p-2.5 bg-black rounded-sm text-white font-bold text-xl active:scale-110 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
