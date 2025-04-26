"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Header from "@/components/Header";
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

const EditProfile: React.FC = () => {
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
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access");
      console.log("🔍 Retrieved Token:", token);

      if (!token) {
        setError("No authentication token found. Please log in.");
        setTimeout(() => router.push("/signin"), 2000);
        return;
      }

      try {
        const res = await axios.get(`${apiUrl}/api/users/profile/`, {
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
          setError(
            err.response?.data?.detail ||
              "Failed to load user data. Please try again."
          );
        } else {
          console.error("Fetch User Failed:", err);
          setError("An unexpected error occurred. Please try again.");
        }
      }
    };
    fetchUser();
  }, [apiUrl, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  // Optional: Token refresh logic (uncomment to enable)
  /*
  const refreshToken = async () => {
    try {
      const refresh = localStorage.getItem("refresh");
      if (!refresh) throw new Error("No refresh token");
      const response = await axios.post(`${apiUrl}/api/users/token/refresh/`, {
        refresh,
      });
      localStorage.setItem("access", response.data.access);
      return response.data.access;
    } catch (err) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      setError("Session expired. Please log in again.");
      setTimeout(() => router.push("/signin"), 2000);
      throw err;
    }
  };
  */

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (
      !formData.email ||
      !formData.first_name ||
      !formData.last_name ||
      !formData.username ||
      !formData.contact ||
      !formData.address ||
      !formData.gender
    ) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    if (formData.first_name.length > 50) {
      setError("First name must be 50 characters or less.");
      setLoading(false);
      return;
    }
    if (formData.middle_name && formData.middle_name.length > 50) {
      setError("Middle name must be 50 characters or less.");
      setLoading(false);
      return;
    }
    if (formData.last_name.length > 50) {
      setError("Last name must be 50 characters or less.");
      setLoading(false);
      return;
    }
    if (formData.username.length > 50) {
      setError("Username must be 50 characters or less.");
      setLoading(false);
      return;
    }
    if (formData.contact.length > 15) {
      setError("Contact must be 15 characters or less.");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    const dataToSend = {
      first_name: formData.first_name,
      middle_name: formData.middle_name || null,
      last_name: formData.last_name,
      username: formData.username,
      contact: formData.contact,
      address: formData.address,
      gender: formData.gender,
      email: formData.email,
    };

    try {
      const token = localStorage.getItem("access");
      if (!token) {
        setError("No authentication token found. Please log in.");
        setTimeout(() => router.push("/signin"), 2000);
        setLoading(false);
        return;
      }

      console.log("Sending PATCH request to:", `${apiUrl}/api/users/profile/`);
      console.log("Payload:", dataToSend);

      const response = await axios.patch(
        `${apiUrl}/api/users/profile/`,
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          timeout: 5000,
        }
      );

      setSuccess("Profile updated successfully!");
      setFormData({
        first_name: response.data.user.first_name || "",
        middle_name: response.data.user.middle_name || "",
        last_name: response.data.user.last_name || "",
        username: response.data.user.username || "",
        contact: response.data.user.contact || "",
        address: response.data.user.address || "",
        gender: response.data.user.gender || "",
        email: response.data.user.email || "",
      });
      setTimeout(() => router.push("/Profile"), 2000);
    } catch (error) {
      let errorMessage = "Profile update failed. Please try again.";
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          // Optional: Uncomment to enable token refresh
          /*
          try {
            const newToken = await refreshToken();
            const response = await axios.patch(
              `${apiUrl}/api/users/profile/`,
              dataToSend,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${newToken}`,
                },
                timeout: 5000,
              }
            );
            setSuccess("Profile updated successfully!");
            setFormData({
              first_name: response.data.user.first_name || "",
              middle_name: response.data.user.middle_name || "",
              last_name: response.data.user.last_name || "",
              username: response.data.user.username || "",
              contact: response.data.user.contact || "",
              gender: response.data.user.gender || "",
              email: response.data.user.email || "",
            });
            setTimeout(() => router.push("/profile"), 2000);
            return;
          } catch (refreshError) {
            errorMessage = "Session expired. Please log in again.";
          }
          */
          errorMessage = "Session expired. Please log in again.";
          setTimeout(() => router.push("/signin"), 2000);
        } else if (error.response.data) {
          if (
            typeof error.response.data === "object" &&
            !error.response.data.detail
          ) {
            errorMessage = Object.entries(error.response.data)
              .map(([key, value]) =>
                `${key}: ${Array.isArray(value) ? value.join(", ") : value}`
              )
              .join("; ");
          } else {
            errorMessage =
              error.response.data.detail ||
              error.response.data.error ||
              JSON.stringify(error.response.data);
          }
        } else {
          errorMessage = `Server error: ${error.response.status}`;
        }
      } else {
        errorMessage = (error as Error).message || "Network error. Please check your connection.";
      }
      setError(errorMessage);
      console.error("Detailed profile update error:", {
        message: (error as Error).message,
        response: axios.isAxiosError(error) ? error.response?.data : undefined,
        status: axios.isAxiosError(error) ? error.response?.status : undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper to get initials from first and last name
  const getInitials = () => {
    const firstInitial = formData.first_name ? formData.first_name[0] : "";
    const lastInitial = formData.last_name ? formData.last_name[0] : "";
    return `${firstInitial}${lastInitial}`.toUpperCase();
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
          <p className="text-sm text-gray-500 mb-6">
            View and update your profile information
          </p>

          {error && (
            <p className="text-red-500 text-center text-sm mb-4">{error}</p>
          )}
          {success && (
            <p className="text-green-500 text-center text-sm mb-4">{success}</p>
          )}

          <div className="flex flex-col sm:flex-row sm:space-x-6">
            {/* Left Side: Avatar */}
            <div className="flex flex-col items-center sm:items-start">
              <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-2xl font-semibold mb-4">
                {getInitials()}
              </div>
            </div>

            {/* Right Side: Edit Form */}
            <div className="flex-1 mt-6 sm:mt-0">
              <form id="edit-profile-form" onSubmit={updateProfile} className="space-y-4">
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
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <motion.input
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        whileFocus={{ scale: 1.02 }}
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-gray-900"
                        placeholder={formData.first_name || "First Name"}
                        required
                      />
                      <motion.input
                        name="middle_name"
                        value={formData.middle_name}
                        onChange={handleChange}
                        whileFocus={{ scale: 1.02 }}
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-gray-900"
                        placeholder={formData.middle_name || "Middle Name"}
                      />
                      <motion.input
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        whileFocus={{ scale: 1.02 }}
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-gray-900"
                        placeholder={formData.last_name || "Last Name"}
                        required
                      />
                    </div>
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
                    <motion.input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      whileFocus={{ scale: 1.02 }}
                      type="email"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-gray-900"
                      placeholder={formData.email || "Email"}
                      required
                    />
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
                    <motion.input
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      whileFocus={{ scale: 1.02 }}
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-gray-900"
                      placeholder={formData.contact || "Contact"}
                      required
                    />
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
                      d="M17.657 16.243l-4.243-4.243m0 0L9.172 7.757m4.242 4.243L9.172 16.243m4.242-4.243L17.657 7.757"
                    ></path>
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Username</p>
                    <motion.input
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      whileFocus={{ scale: 1.02 }}
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-gray-900"
                      placeholder={formData.username || "Username"}
                      required
                    />
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
                      d="M17.657 16.243l-4.243-4.243m0 0L9.172 7.757m4.242 4.243L9.172 16.243m4.242-4.243L17.657 7.757"
                    ></path>
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Address</p>
                    <motion.input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      whileFocus={{ scale: 1.02 }}
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-gray-900"
                      placeholder={formData.address || "Address"}
                      required
                    />
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Gender</p>
                    <motion.select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      whileFocus={{ scale: 1.02 }}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-gray-900"
                      required
                    >
                      <option value="">
                        {formData.gender || "Select Gender"}
                      </option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </motion.select>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/Profile")}
              className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition font-medium"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              form="edit-profile-form"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
              className={`px-4 py-2 rounded-md transition font-medium flex items-center justify-center space-x-2 ${
                loading
                  ? "bg-red-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-gradient-to-r from-red-600 to-red-800 text-white"
              }`}
            >
              {loading && (
                <svg
                  className="animate-spin h-4 w-4 text-white"
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
              <span>{loading ? "Saving..." : "Save Changes"}</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EditProfile;