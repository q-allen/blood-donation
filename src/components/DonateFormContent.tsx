"use client";
import React, { useState, useEffect } from "react";
import { useAnimation } from "framer-motion";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import axios from "axios";
import Image from "next/image";

const healthQuestions = [
  "Have you had a recent illness or infection?",
  "Are you currently taking antibiotics?",
  "Do you have a history of heart disease?",
  "Are you pregnant or have you recently given birth?",
  "Have you received a blood transfusion in the last year?",
  "Have you traveled to a malaria-risk area in the past 12 months?",
  "Do you have a history of hepatitis or HIV?",
  "Have you had a tattoo or piercing in the last 6 months?",
];

interface DonateFormContentProps {
  id: string;
  name: string;
  description: string;
  location: string;
  image: string;
}

const DonateFormContent: React.FC<DonateFormContentProps> = ({ id, name, description, location, image }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    age: "",
    weight: "",
    gender: "",
    bloodType: "",
    phone: "",
    email: "",
    lastDonationDate: "",
    healthIssues: Object.fromEntries(healthQuestions.map((_, index) => [`healthIssues_${index}`, ""])),
    eligibilityConfirmed: false,
    address: "",
    parentalConsent: false,
    dateOfBirth: "",
    IdCard: null as File | null,
  });

  const [, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const controls = useAnimation();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL; // Update with your API URL

  useEffect(() => {
    const handleScroll = () => {
      controls.start({ opacity: 1, y: 0 });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [controls]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRadioChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      healthIssues: { ...prev.healthIssues, [`healthIssues_${index}`]: value },
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("File selected:", file.name, file.size, file.type);
      setFileName(file.name);
      setFormData((prev) => {
        console.log("Updating formData with file:", file.name);
        return { ...prev, IdCard: file };
      });
    } else {
      console.log("No file selected in handleImageUpload");
      alert("No file selected. Please upload a valid identification card.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!id || isNaN(parseInt(id))) {
      alert("Invalid hospital selection. Please select a hospital first.");
      return;
    }

    const age = parseInt(formData.age, 10);
    const weight = parseFloat(formData.weight);
    const today = new Date().toISOString().split("T")[0];

    if (age < 16) {
      alert("You must be at least 16 years old to donate blood.");
      return;
    }
    if (weight < 110) {
      alert("You must weigh at least 110 lbs to donate blood.");
      return;
    }
    if (!formData.eligibilityConfirmed) {
      alert("You must confirm that you meet all donation requirements.");
      return;
    }
    if (!formData.firstName || !formData.lastName || !formData.dateOfBirth || !formData.address) {
      alert("Please fill in all required fields.");
      return;
    }
    if (formData.dateOfBirth > today) {
      alert("Date of birth cannot be in the future.");
      return;
    }
    if (formData.lastDonationDate && formData.lastDonationDate > today) {
      alert("Last donation date cannot be in the future.");
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("hospital", id.toString());
    formDataToSubmit.append("first_name", formData.firstName);
    formDataToSubmit.append("middle_name", formData.middleName || "");
    formDataToSubmit.append("last_name", formData.lastName);
    formDataToSubmit.append("phone_number", formData.phone);
    formDataToSubmit.append("address", formData.address);
    formDataToSubmit.append("date_of_birth", formData.dateOfBirth);
    formDataToSubmit.append("email", formData.email);
    formDataToSubmit.append("age", formData.age);
    formDataToSubmit.append("weight", formData.weight);
    formDataToSubmit.append("gender", formData.gender);
    formDataToSubmit.append("blood_type", formData.bloodType);
    formDataToSubmit.append("last_donation_date", formData.lastDonationDate || "");
    formDataToSubmit.append("recent_illness", formData.healthIssues.healthIssues_0 === "yes" ? "true" : "false");
    formDataToSubmit.append("taking_antibiotics", formData.healthIssues.healthIssues_1 === "yes" ? "true" : "false");
    formDataToSubmit.append("heart_disease", formData.healthIssues.healthIssues_2 === "yes" ? "true" : "false");
    formDataToSubmit.append("pregnant_or_given_birth", formData.healthIssues.healthIssues_3 === "yes" ? "true" : "false");
    formDataToSubmit.append("blood_transfusion_last_year", formData.healthIssues.healthIssues_4 === "yes" ? "true" : "false");
    formDataToSubmit.append("traveled_malaria_risk_area", formData.healthIssues.healthIssues_5 === "yes" ? "true" : "false");
    formDataToSubmit.append("hepatitis_or_hiv", formData.healthIssues.healthIssues_6 === "yes" ? "true" : "false");
    formDataToSubmit.append("tattoo_or_piercing_last_six_months", formData.healthIssues.healthIssues_7 === "yes" ? "true" : "false");
    formDataToSubmit.append("meets_eligibility", formData.eligibilityConfirmed.toString());

    console.log("formData.IdCard before append:", formData.IdCard ? formData.IdCard.name : "null");
    if (formData.IdCard) {
      formDataToSubmit.append("id_card", formData.IdCard);
      console.log("File attached to FormData:", formData.IdCard.name, formData.IdCard.size);
    } else {
      console.log("No id_card file in formData");
    }

    setLoading(true);

    try {
      
      const response = await axios.post(`${apiUrl}api/blood_donation/`, formDataToSubmit, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        alert("Thank you for your willingness to donate blood!");
      }
    } catch (error) {
      console.log("Data sent:", Object.fromEntries(formDataToSubmit));
      if (axios.isAxiosError(error)) {
        console.error("Error submitting form:", error.response?.data || error.message);
      } else {
        console.error("Error submitting form:", error);
      }
      const errorMessage = axios.isAxiosError(error) ? error.response?.data?.error || "Unknown error" : "An unexpected error occurred";
      alert("There was an error submitting the form: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-white text-gray-900 min-h-screen px-10 py-6 relative"
    >
      <Header />
      <main className="flex p-8 space-x-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col space-y-6 p-6 w-1/3 items-center"
        >
          <div className="relative">
            <Image
              src={image || "/placeholder.jpg"}
              alt={name || "Hospital"}
              width={200}
              height={200}
              className="w-48 h-48 md:w-56 md:h-56 object-cover rounded-full shadow-xl border-4 border-white bg-gray-100"
            />
            <div className="absolute inset-0 rounded-full ring-2 ring-gray-200 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-4 w-full">
            <p className="text-black text-center text-2xl font-semibold p-4">{name || "Hospital Name"}</p>
            <p className="text-black text-sm py-2 pl-2">{description || "No description available"}</p>
            <p className="text-black text-sm flex items-center justify-center text-sm italic gap-2">
              <MapPin className="w-4 h-4 text-red-500" />
              <span>{location || "Unknown Location"}</span>
            </p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-2/3 bg-white shadow-lg p-8 rounded"
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-3xl font-bold mb-6 text-red-600"
          >
            BLOOD DONATION FORM
          </motion.h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div>
              <label className="block font-medium">First Name</label>
              <input
                title="Input field"
                type="text"
                name="firstName"
                value={String(formData.firstName ?? "")}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                required
                placeholder="Enter your first name"
              />
            </motion.div>
            <motion.div>
              <label className="block font-medium">Middle Name</label>
              <input
                title="Input field"
                type="text"
                name="middleName"
                value={String(formData.middleName ?? "")}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                placeholder="Enter your middle name"
              />
            </motion.div>
            <motion.div>
              <label className="block font-medium">Last Name</label>
              <input
                title="Input field"
                type="text"
                name="lastName"
                value={String(formData.lastName ?? "")}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                required
                placeholder="Enter your last name"
              />
            </motion.div>
            <motion.div>
              <label className="block font-medium">Address</label>
              <input
                title="Input field"
                type="text"
                name="address"
                value={String(formData.address ?? "")}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                required
                placeholder="Enter your full address"
              />
            </motion.div>
            <motion.div>
              <label className="block font-medium">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                required
                title="Input field for date of birth"
                placeholder="Select your date of birth"
              />
            </motion.div>
            <motion.div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                  required
                  title="Input field for phone number"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="block font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                  title="Input field for email"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </motion.div>
            <motion.div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block font-medium">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg"
                  required
                  title="Input field for age"
                  placeholder="Enter your age"
                />
              </div>
              <div>
                <label className="block font-medium">Weight (lbs)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg"
                  required
                  title="Input field for weight"
                  placeholder="Enter your weight in lbs"
                />
              </div>
              <div>
                <label className="block font-medium">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg"
                  required
                  title="Select your gender"
                  aria-labelledby="gender-label"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block font-medium">Blood Type</label>
                <select
                  id="bloodType"
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg"
                  required
                  title="Select your blood type"
                  aria-labelledby="blood type-label"
                >
                  <option value="">Select Blood Type</option>
                  {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
            <motion.div>
              <label className="block font-medium">Last Blood Donation Date</label>
              <input
                type="date"
                name="lastDonationDate"
                value={formData.lastDonationDate}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                required
                title="Input field for last blood donation date"
                placeholder="Select your last blood donation date"
              />
            </motion.div>
            <motion.div>
              <label className="block font-medium">Health Screening</label>
              {healthQuestions.map((question, index) => (
                <div key={index} className="mb-4">
                  <p className="text-sm">{question}</p>
                  <div className="flex gap-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={`healthIssues_${index}`}
                        value="yes"
                        checked={formData.healthIssues[`healthIssues_${index}`] === "yes"}
                        onChange={() => handleRadioChange(index, "yes")}
                        className="mr-2"
                        required
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={`healthIssues_${index}`}
                        value="no"
                        checked={formData.healthIssues[`healthIssues_${index}`] === "no"}
                        onChange={() => handleRadioChange(index, "no")}
                        className="mr-2"
                        required
                      />
                      No
                    </label>
                  </div>
                </div>
              ))}
            </motion.div>
            <motion.div>
              <label className="block font-medium">Upload Identification Card</label>
              <div className="flex items-center justify-left w-full">
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
                >
                  Choose File
                </label>
                <input
                  id="file-upload"
                  type="file"
                  name="idCard"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  required
                  title="Upload your identification card"
                />
                <span className="ml-4 text-gray-600">{fileName || "No file selected"}</span>
              </div>
            </motion.div>
            {parseInt(formData.age, 10) < 18 && (
              <motion.div className="flex items-center">
                <input
                  type="checkbox"
                  name="parentalConsent"
                  checked={formData.parentalConsent}
                  onChange={handleChange}
                  className="mr-2"
                  required
                  title="Parental consent checkbox"
                  placeholder="Check if you have parental consent"
                />
                <label className="text-sm">I have parental consent to donate blood.</label>
              </motion.div>
            )}
            <motion.div className="flex items-center">
              <input
                type="checkbox"
                name="eligibilityConfirmed"
                checked={formData.eligibilityConfirmed}
                onChange={handleChange}
                className="mr-2"
                required
                title="Confirm eligibility requirements"
                placeholder="Confirm eligibility"
              />
              <label className="text-sm">I confirm that I meet all the eligibility requirements.</label>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition duration-300"
            >
              Submit
            </motion.button>
          </form>
        </motion.div>
      </main>
    </motion.div>
  );
};

export default DonateFormContent;