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

  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const controls = useAnimation();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

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
    setErrors([]);
  };

  const handleRadioChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      healthIssues: { ...prev.healthIssues, [`healthIssues_${index}`]: value },
    }));
    setErrors([]);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setErrors(['Please upload a valid image file (JPEG, PNG, or GIF).']);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(['Image file size must be less than 5MB.']);
        return;
      }
      setFileName(file.name);
      setFormData((prev) => ({ ...prev, IdCard: file }));
      setErrors([]);
    } else {
      setErrors(['Please upload a valid identification card.']);
    }
  };

  const validateDate = (date: string): boolean => {
    if (!date) return true;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) return false;
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  };

  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateLastDonationDate = (date: string, gender: string): boolean => {
    if (!date) return true;
    const lastDonation = new Date(date);
    const today = new Date();
    const daysSinceLastDonation = Math.floor(
      (today.getTime() - lastDonation.getTime()) / (1000 * 60 * 60 * 24)
    );
    const minDays = gender === "Female" ? 84 : 56;
    return daysSinceLastDonation >= minDays;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    const newErrors: string[] = [];

    if (!id || isNaN(parseInt(id))) {
      newErrors.push("Invalid hospital selection. Please select a hospital first.");
    }

    if (!formData.firstName.trim()) {
      newErrors.push("First name is required.");
    }
    if (!formData.lastName.trim()) {
      newErrors.push("Last name is required.");
    }
    if (!formData.address.trim()) {
      newErrors.push("Address is required.");
    }

    if (!formData.dateOfBirth) {
      newErrors.push("Date of birth is required.");
    } else if (!validateDate(formData.dateOfBirth)) {
      newErrors.push("Date of birth must be in YYYY-MM-DD format (e.g., 1990-01-01).");
    } else if (formData.dateOfBirth > new Date().toISOString().split("T")[0]) {
      newErrors.push("Date of birth cannot be in the future.");
    }

    const age = parseInt(formData.age, 10);
    if (!formData.age) {
      newErrors.push("Age is required.");
    } else if (isNaN(age) || age < 16 || age > 120) {
      newErrors.push("Age must be between 16 and 120 years.");
    }

    if (formData.dateOfBirth && validateDate(formData.dateOfBirth)) {
      const calculatedAge = calculateAge(formData.dateOfBirth);
      if (!isNaN(age) && Math.abs(calculatedAge - age) > 1) {
        newErrors.push(`Age (${age}) does not match date of birth (expected ~${calculatedAge}).`);
      }
    }

    const weight = parseFloat(formData.weight);
    if (!formData.weight) {
      newErrors.push("Weight is required.");
    } else if (isNaN(weight) || weight < 110 || weight > 500) {
      newErrors.push("Weight must be between 110 and 500 lbs.");
    }

    if (!formData.gender) {
      newErrors.push("Gender is required.");
    }

    if (!formData.bloodType) {
      newErrors.push("Blood type is required.");
    }

    if (!formData.phone) {
      newErrors.push("Phone number is required.");
    } else if (!validatePhone(formData.phone)) {
      newErrors.push("Please enter a valid phone number (minimum 10 digits).");
    }

    if (!formData.email) {
      newErrors.push("Email is required.");
    } else if (!validateEmail(formData.email)) {
      newErrors.push("Please enter a valid email address.");
    }

    if (formData.lastDonationDate) {
      if (!validateDate(formData.lastDonationDate)) {
        newErrors.push("Last donation date must be in YYYY-MM-DD format (e.g., 2023-10-15).");
      } else if (formData.lastDonationDate > new Date().toISOString().split("T")[0]) {
        newErrors.push("Last donation date cannot be in the future.");
      } else if (!validateLastDonationDate(formData.lastDonationDate, formData.gender)) {
        const minDays = formData.gender === "Female" ? 84 : 56;
        newErrors.push(
          `You must wait at least ${minDays} days since your last donation before donating again.`
        );
      }
    }

    healthQuestions.forEach((question, index) => {
      if (!formData.healthIssues[`healthIssues_${index}`]) {
        newErrors.push(`Please answer health question: ${question}`);
      }
      if (formData.healthIssues[`healthIssues_${index}`] === "yes") {
        newErrors.push(
          `Based on your response to "${question}", you may not be eligible to donate. Please consult with a healthcare professional.`
        );
      }
    });

    if (!formData.eligibilityConfirmed) {
      newErrors.push("You must confirm that you meet all donation requirements.");
    }
    if (!formData.IdCard) {
      newErrors.push("Please upload an identification card.");
    }
    if (age < 18 && !formData.parentalConsent) {
      newErrors.push("Parental consent is required for donors under 18.");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setLoading(false);
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

    if (formData.IdCard) {
      formDataToSubmit.append("id_card", formData.IdCard);
    }

    try {
      const response = await axios.post(`${apiUrl}/api/blood_donation/`, formDataToSubmit, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 10000,
      });

      if (response.status === 201) {
        alert("Thank you for your willingness to donate blood!");
        setFormData({
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
          IdCard: null,
        });
        setFileName(null);
      }
    } catch (error) {
      let errorMessages: string[] = [];
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          errorMessages = ['Request timed out. Please check your internet connection and try again.'];
        } else if (error.response?.data) {
          if (typeof error.response.data === "object") {
            errorMessages = Object.entries(error.response.data).map(([field, messages]) => {
              const fieldName = field
                .replace(/_/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase());
              return `${fieldName}: ${Array.isArray(messages) ? messages.join(", ") : messages}`;
            });
          } else {
            errorMessages = [error.response.data.error || "Unknown server error"];
          }
        } else {
          errorMessages = ["Network error. Please check your connection and try again."];
        }
      } else {
        errorMessages = ["An unexpected error occurred. Please try again later."];
      }
      setErrors(errorMessages);
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
      className="bg-white text-gray-900 min-h-screen px-4 sm:px-6 lg:px-8 py-6 relative"
    >
      <Header />
      <main className="flex flex-col md:flex-row p-4 sm:p-6 lg:p-8 space-y-6 md:space-y-0 md:space-x-6 max-w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col space-y-4 p-4 sm:p-6 w-full md:w-1/3 items-center"
        >
          <div className="relative">
            <Image
              src={image || "/placeholder.jpg"}
              alt={name || "Hospital"}
              width={200}
              height={200}
              className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 object-cover rounded-full shadow-xl border-4 border-white bg-gray-100"
            />
            <div className="absolute inset-0 rounded-full ring-2 ring-gray-200 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-4 w-full">
            <p className="text-black text-center text-xl sm:text-2xl font-semibold p-4">{name || "Hospital Name"}</p>
            <p className="text-black text-sm py-2 pl-2">{description || "No description available"}</p>
            <p className="text-black text-sm flex items-center justify-center text-sm italic gap-2">
              <MapPin className="w-4 h-4 text-red-500" />
              <span>{location || "Unknown Location"}</span>
            </p>
          </div>
          {/* First Advertisement Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="w-full bg-gray-100 rounded-lg shadow-md p-4"
          >
            <a href="https://www.postermywall.com/index.php/art/template/a701f497da738ff788a6e0abd5aa7565/blood-donation-flyer-design-template" target="_blank" rel="noopener noreferrer">
              <Image
                src="/images/ad.jpg"
                alt="Blood Donation Campaign"
                width={300}
                height={100}
                className="w-full h-auto rounded-lg object-cover"
              />
              <p className="text-center text-sm text-gray-600 mt-2">Support Our Cause - Learn More!</p>
            </a>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-2/3 bg-white shadow-lg p-6 sm:p-8 rounded"
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-2xl sm:text-3xl font-bold mb-6 text-red-600"
          >
            BLOOD DONATION FORM
          </motion.h2>
          {errors.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
            >
              <p className="font-bold">Please correct the following errors:</p>
              <ul className="list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </motion.div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div>
              <label className="block font-medium">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                required
                placeholder="Enter your first name"
              />
            </motion.div>
            <motion.div>
              <label className="block font-medium">Middle Name</label>
              <input
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                placeholder="Enter your middle name"
              />
            </motion.div>
            <motion.div>
              <label className="block font-medium">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                required
                placeholder="Enter your last name"
              />
            </motion.div>
            <motion.div>
              <label className="block font-medium">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                required
                placeholder="Enter your full address"
              />
            </motion.div>
            <motion.div>
              <label className="block font-medium">Date of Birth</label>
              <input
                placeholder="YYYY-MM-DD"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                required
                max={new Date().toISOString().split("T")[0]}
              />
            </motion.div>
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                  required
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
                  required
                  placeholder="Enter your email"
                />
              </div>
            </motion.div>
            <motion.div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block font-medium">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                  required
                  placeholder="Enter your age"
                  min="16"
                  max="120"
                />
              </div>
              <div>
                <label className="block font-medium">Weight (lbs)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                  required
                  placeholder="Enter your weight in lbs"
                  min="110"
                  max="500"
                />
              </div>
              <div>
                <label className="block font-medium">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                  required
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
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                  required
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
              <label className="block font-medium">Last Blood Donation Date (Optional)</label>
              <input
                placeholder="YYYY-MM-DD"
                type="date"
                name="lastDonationDate"
                value={formData.lastDonationDate}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                max={new Date().toISOString().split("T")[0]}
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
                  placeholder="Upload your ID card"
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
              disabled={loading}
              className={`w-full py-3 rounded-lg transition duration-300 flex items-center justify-center ${
                loading ? "bg-red-400 cursor-not-allowed" : "bg-gradient-to-r from-red-600 to-red-800 hover:bg-red-600 text-white"
              }`}
            >
              {loading && (
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
              )}
              {loading ? "Submitting..." : "Submit"}
            </motion.button>
          </form>
        </motion.div>
        {/* Second Advertisement Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4, type: "spring", stiffness: 100 }}
          className="w-full bg-gradient-to-r from-red-500 to-red-700 rounded-lg shadow-xl p-4 sm:p-6 mt-6"
        >
          <a href="https://www.redcross.org/donate-blood.html" target="_blank" rel="noopener noreferrer">
            <Image
              src="/ad-lifesavers.jpg"
              alt="Join the Lifesavers Campaign"
              width={600}
              height={150}
              className="w-full h-auto rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <p className="text-center text-white text-lg font-bold mt-3">Join the Lifesavers: Donate Blood Today!</p>
            <p className="text-center text-sm text-white mt-1">Your donation can save up to 3 lives. Be a hero!</p>
          </a>
        </motion.div>
      </main>
    </motion.div>
  );
};

export default DonateFormContent;