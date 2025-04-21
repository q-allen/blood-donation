"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { X } from "lucide-react";
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
  const [isOpen, setIsOpen] = useState(false);
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
  const [loading, setLoading] = useState(false);
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
      } catch (err: any) {
        console.error("Fetch User Failed:", err.response?.data || err.message);
        setError("Failed to load user data. Please try again.");
      }
    };
    fetchUser();
  }, []);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

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
      const response = await axios.put(
        "http://localhost:8000/api/users/",
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          timeout: 5000,
        }
      );
      alert("Profile updated successfully!");
      setFormData({
        first_name: response.data.first_name || "",
        middle_name: response.data.middle_name || "",
        last_name: response.data.last_name || "",
        username: response.data.username || "",
        contact: response.data.contact || "",
        address: response.data.address || "",
        gender: response.data.gender || "",
        email: response.data.email || "",
      });
      handleClose();
      router.refresh();
    } catch (error: any) {
      let errorMessage = "Profile update failed. Please try again.";
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.data) {
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
        errorMessage = error.message || "Network error. Please check your connection.";
      }
      setError(errorMessage);
      console.error("Detailed profile update error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleOpen}
        className="bg-gradient-to-r from-red-600 to-red-800 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700 transition"
      >
        Edit Profile
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-8 relative"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              className="absolute top-4 right-4 text-red-600 hover:text-red-800"
            >
              <X size={24} />
            </motion.button>

            <h2 className="text-2xl font-bold text-red-700 mb-4">
              Edit Your Profile
            </h2>
            {error && (
              <p className="text-red-500 text-center text-sm mb-4">{error}</p>
            )}
            <form onSubmit={updateProfile} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <motion.input
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  whileFocus={{ scale: 1.05 }}
                  type="text"
                  className="w-full p-2 border rounded bg-red-50 text-red-700 text-sm"
                  placeholder="First Name"
                  required
                />
                <motion.input
                  name="middle_name"
                  value={formData.middle_name}
                  onChange={handleChange}
                  whileFocus={{ scale: 1.05 }}
                  type="text"
                  className="w-full p-2 border rounded bg-red-50 text-red-700 text-sm"
                  placeholder="Middle Name"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <motion.input
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  whileFocus={{ scale: 1.05 }}
                  type="text"
                  className="w-full p-2 border rounded bg-red-50 text-red-700 text-sm"
                  placeholder="Last Name"
                  required
                />
                <motion.input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  whileFocus={{ scale: 1.05 }}
                  type="text"
                  className="w-full p-2 border rounded bg-red-50 text-red-700 text-sm"
                  placeholder="Username"
                  required
                />
              </div>
              <motion.input
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                whileFocus={{ scale: 1.05 }}
                type="text"
                className="w-full p-2 border rounded bg-red-50 text-red-700 text-sm"
                placeholder="Contact"
                required
              />
              <motion.input
                name="email"
                value={formData.email}
                onChange={handleChange}
                whileFocus={{ scale: 1.05 }}
                type="email"
                className="w-full p-2 border rounded bg-red-50 text-red-700 text-sm"
                placeholder="Email"
                required
              />
              <motion.input
                name="address"
                value={formData.address}
                onChange={handleChange}
                whileFocus={{ scale: 1.05 }}
                type="text"
                className="w-full p-2 border rounded bg-red-50 text-red-700 text-sm"
                placeholder="Address"
                required
              />
              <motion.select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                whileFocus={{ scale: 1.05 }}
                className="w-full p-2 border rounded bg-red-50 text-red-700 text-sm"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </motion.select>
              <div className="flex justify-end space-x-3 mt-4">
                <motion.button
                  type="button"
                  onClick={handleClose}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </motion.button>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.05 }}
                  whileTap={{ scale: loading ? 1 : 0.95 }}
                  className={`px-4 py-2 rounded transition font-semibold ${
                    loading
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  } text-white flex items-center justify-center space-x-2`}
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
                  <span>{loading ? "Updating..." : "Update"}</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ProfileEditPopup;