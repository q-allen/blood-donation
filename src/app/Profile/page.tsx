"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Header from "../components/Header";
import { useRouter } from "next/navigation";

interface UserDetails {
  first_name: string;
  middle_name?: string;
  last_name: string;
  username: string;
  contact: string;
  address: string;
  gender: string;
  email: string;
}

const ProfileEditPopup: React.FC = () => {
  const [formData, setFormData] = useState<UserDetails>({
    first_name: "",
    middle_name: "",
    last_name: "",
    username: "",
    contact: "",
    address: "",
    gender: "",
    email: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access");
      console.log("🔍 Retrieved Token:", token);

      if (!token) {
        setError("No authentication token found. Please log in.");
        return;
      }

      try {
        const res = await axios.get("http://localhost:8000/api/users/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData({
          first_name: res.data.first_name || "",
          middle_name: res.data.middle_name || "",
          last_name: res.data.last_name || "",
          username: res.data.username || "",
          contact: res.data.contact || "",
          address: res.data.address || "",
          gender: res.data.gender || "",
          email: res.data.email || "",
        });
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error("Fetch User Failed:", err.response?.data || err.message);
        } else {
          console.error("Fetch User Failed:", err);
        }
        setError("Failed to load user data. Please try again.");
      }
    };
    fetchUser();
  }, []);

  // Helper to get initials from first and last name
  const getInitials = () => {
    const firstInitial = formData.first_name ? formData.first_name[0] : "";
    const lastInitial = formData.last_name ? formData.last_name[0] : "";
    return `${firstInitial}${lastInitial}`.toUpperCase() || "JD";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-white text-gray-900 min-h-screen px-4 sm:px-6 lg:px-8 py-6"
    >
      <Header />
      <div className="flex items-center justify-center py-12">
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 sm:p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">My Profile</h2>
          <p className="text-sm text-gray-500 mb-6">View and update your profile information</p>

          {error && (
            <p className="text-red-500 text-center text-sm mb-4">{error}</p>
          )}

          <div className="flex flex-col sm:flex-row sm:space-x-6">
            {/* Left Side: Avatar and Edit Button */}
            <div className="flex flex-col items-center sm:items-start">
              <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-2xl font-semibold mb-4">
                {getInitials()}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/Profile/edit")}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L15.232 5.232z"
                  ></path>
                </svg>
                <span>Edit Profile</span>
              </motion.button>
            </div>

            {/* Right Side: Profile Details */}
            <div className="flex-1 mt-6 sm:mt-0">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="text-gray-900 font-medium border border-gray-200 rounded-md p-2">
                      {formData.first_name} {formData.middle_name} {formData.last_name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900 font-medium border border-gray-200 rounded-md p-2">
                      {formData.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    ></path>
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="text-gray-900 font-medium border border-gray-200 rounded-md p-2">
                      {formData.contact}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfileEditPopup;