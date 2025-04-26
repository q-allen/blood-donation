"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Link from "next/link";
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
        } else {
          console.error("Fetch User Failed:", err);
        }
        setError("Failed to load user data. Please try again.");
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
      setTimeout(() => router.push("/profile"), 2000);
    } catch (error) {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-white text-red-900 min-h-screen px-10 py-6 relative"
    >
      <div className="w-full flex flex-col bg-white text-red-900">
        <Header />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-1 items-center justify-center min-h-screen px-4"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white w-full max-w-3xl flex rounded-lg shadow-xl overflow-hidden"
          >
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="hidden md:flex flex-col justify-center flex-1 px-12 bg-gradient-to-r from-red-600 to-red-800 text-white"
            >
              <h1 className="text-4xl font-bold">UPDATE YOUR PROFILE</h1>
              <p className="text-lg mt-2">Keep your information current</p>
              <p className="text-sm mt-4">
                Ensure your details are up to date to stay connected with our blood donation community.
              </p>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="flex-1 p-8 md:p-12"
            >
              <h2 className="text-2xl font-bold text-red-700">Edit Profile</h2>
              <p className="text-sm text-red-500 mt-1">Update your details below</p>
              {error && <p className="text-red-500 text-center text-sm mt-2">{error}</p>}
              {success && <p className="text-green-500 text-center text-sm mt-2">{success}</p>}
              <form className="mt-4 space-y-2" onSubmit={updateProfile}>
                <div className="grid grid-cols-2 gap-2">
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
                <div className="grid grid-cols-2 gap-2">
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
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => router.push("/profile")}
                    className="px-4 py-2 bg-white text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition font-medium"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: loading ? 1 : 1.05 }}
                    whileTap={{ scale: loading ? 1 : 0.95 }}
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 rounded-lg transition font-medium flex items-center justify-center space-x-2 ${
                      loading
                        ? "bg-red-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-red-600 to-red-800 text-white hover:bg-red-700"
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
              </form>
              <p className="text-center text-black text-xs mt-2">
                Back to{" "}
                <Link href="/profile" className="text-red-700 hover:underline">
                  Profile
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EditProfile;