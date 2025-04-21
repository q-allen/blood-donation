"use client";

import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    username: "",
    contact: "",
    address: "",
    gender: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const registerUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Client-side validation
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (!formData.email || !formData.password || !formData.first_name || !formData.last_name || !formData.username || !formData.contact || !formData.address || !formData.gender) {
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
    if (formData.password.length > 128) {
      setError("Password must be 128 characters or less.");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }


    try {
      alert("Registration successful!");
      setFormData({
        first_name: "",
        middle_name: "",
        last_name: "",
        username: "",
        contact: "",
        address: "",
        gender: "",
        email: "",
        password: "",
        confirm_password: "",
      });
      router.push("/SignIn");
    } catch (error) {
      let errorMessage = "Registration failed. Please try again.";
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.data) {
          if (typeof error.response.data === "object" && !error.response.data.detail) {
            errorMessage = Object.entries(error.response.data)
              .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
              .join("; ");
          } else {
            errorMessage = error.response.data.detail || error.response.data.error || JSON.stringify(error.response.data);
          }
        } else {
          errorMessage = `Server error: ${error.response.status}`;
        }
      } else {
        errorMessage = (error as Error).message || "Network error. Please check your connection.";
      }
      setError(errorMessage);
      console.error("Detailed registration error:", {
        message: (error as Error).message,
        response: axios.isAxiosError(error) ? error.response?.data : null,
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
                    <h1 className="text-4xl font-bold">DONATE BLOOD, SAVE LIVES</h1>
                    <p className="text-lg mt-2">Every drop counts</p>
                    <p className="text-sm mt-4">
                        Join our community of blood donors and make a difference today.
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ x: 50, opacity: 0 }} 
                    animate={{ x: 0, opacity: 1 }} 
                    transition={{ duration: 0.7 }}
                    className="flex-1 p-8 md:p-12"
                >
                    <h2 className="text-2xl font-bold text-red-700">Join as a Blood Donor</h2>
                    <p className="text-sm text-red-500 mt-1">Enter your details below</p>
                    {error && <p className="text-red-500 text-center text-sm mt-2">{error}</p>}
                    <form className="mt-4 space-y-2" onSubmit={registerUser}>
                        <div className="grid grid-cols-2 gap-2">
                            <motion.input name="first_name" value={formData.first_name} onChange={handleChange} whileFocus={{ scale: 1.05 }} type="text" className="w-full p-2 border rounded bg-red-50 text-red-700 text-sm" placeholder="First Name" required />
                            <motion.input name="middle_name" value={formData.middle_name} onChange={handleChange} whileFocus={{ scale: 1.05 }} type="text" className="w-full p-2 border rounded bg-red-50 text-red-700 text-sm" placeholder="Middle Name" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <motion.input name="last_name" value={formData.last_name} onChange={handleChange} whileFocus={{ scale: 1.05 }} type="text" className="w-full p-2 border rounded bg-red-50 text-red-700 text-sm" placeholder="Last Name" required />
                            <motion.input name="username" value={formData.username} onChange={handleChange} whileFocus={{ scale: 1.05 }} type="text" className="w-full p-2 border rounded bg-red-50 text-red-700 text-sm" placeholder="Username" required />
                        </div>
                        <motion.input name="contact" value={formData.contact} onChange={handleChange} whileFocus={{ scale: 1.05 }} type="text" className="w-full p-2 border rounded bg-red-50 text-red-700 text-sm" placeholder="Contact" required />
                        <motion.input name="email" value={formData.email} onChange={handleChange} whileFocus={{ scale: 1.05 }} type="email" className="w-full p-2 border rounded bg-red-50 text-red-700 text-sm" placeholder="Email" required />
                        <motion.input name="address" value={formData.address} onChange={handleChange} whileFocus={{ scale: 1.05 }} type="text" className="w-full p-2 border rounded bg-red-50 text-red-700 text-sm" placeholder="Address" required />
                        <motion.select name="gender" value={formData.gender} onChange={handleChange} whileFocus={{ scale: 1.05 }} className="w-full p-2 border rounded bg-red-50 text-red-700 text-sm" required>
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </motion.select>
                        <motion.input name="password" value={formData.password} onChange={handleChange} whileFocus={{ scale: 1.05 }} type="password" className="w-full p-2 border rounded bg-red-50 text-red-700 text-sm" placeholder="Password" required />
                        <motion.input name="confirm_password" value={formData.confirm_password} onChange={handleChange} whileFocus={{ scale: 1.05 }} type="password" className="w-full p-2 border rounded bg-red-50 text-red-700 text-sm" placeholder="Confirm Password" required />
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" disabled={loading} className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white font-semibold py-2 rounded-lg mt-2 hover:bg-red-700 transition">
                          {loading ? "Signing Up..." : "Sign Up"}
                        </motion.button>
                        <p className="text-center text-black text-xs mt-2">Already have an account? <Link href="/signin" className="text-red-700 hover:underline">Sign In</Link></p>
                    </form>
                </motion.div>
            </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SignupPage;