"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Image from "next/image";

interface Users {
  id: number;
  username: string;
  email: string;
  avatar?: string;
}

export default function Header() {
  const [users, setUser] = useState<Users | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access");

      console.log("🔍 Retrieved Token:", token);

      if (!token) {
        setUser(null);
        return;
      }

      try {
        const res = await axios.get("http://localhost:8000/api/users/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error("❌ Fetch User Failed:", err.response?.data || err.message);
        } else {
          console.error("❌ Fetch User Failed:", err);
        }
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const handleProfileClick = () => {
    const token = localStorage.getItem("access");

    if (!token) {
      alert("Please log in first!");
      router.push("/signin");
    } else {
      setDropdownOpen(!dropdownOpen);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    setUser(null);
    setDropdownOpen(false);
    router.push("/signin");
  };

  return (
    <header className="flex  justify-between items-center bg-white text-red-600 px-10 py-6">
      {/* Logo */}
      <Image
        src="/images/logo.png"
        alt="Blood Logo"
        width={100}
        height={32}
        style={{ width: "auto", height: "32px" }}
        className="cursor-pointer"
        onClick={() => router.push("/")}
      />

      {/* Navigation Links */}
      <div className="flex gap-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => router.push("/")} // Home -> /
          className="hover:underline"
        >
          Home
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => router.push("/Donate")} // Donate -> /donate
          className="hover:underline"
        >
          Donate
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => router.push("/About")} // About -> /about
          className="hover:underline"
        >
          About
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => router.push("/Contact")} // Contact Us -> /contact
          className="hover:underline"
        >
          Contact Us
        </motion.button>
      </div>

      {/* Profile Dropdown */}
      <div className="relative">
          <motion.button
            type="button"
            className="p-2 hover:text-gray-400 flex items-center"
            whileHover={{ scale: 1.2 }}
            onClick={handleProfileClick}
          >
            <User className="w-6 h-6" />
            {users && <span className="text-sm font-medium ml-2">{users.username}</span>}
          </motion.button>

          <AnimatePresence>
          {dropdownOpen && users && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-xl border border-gray-700/50 z-50"
            >
              <div className="py-1">
                <button
                  onClick={() => router.push("/Profile")}
                  className="flex items-center w-full text-left px-4 py-2 text-gray-100 hover:bg-gray-800 hover:text-white transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-4 py-2 text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
    </header>
  );
}
