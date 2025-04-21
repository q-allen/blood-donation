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
      <img src="/images/logo.png" alt="Blood Logo" className="h-8 cursor-pointer" onClick={() => router.push("/")} />

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
                transition={{ duration: 0.3 }}
                className="absolute right-0 mt-2 w-40 bg-gray-800 rounded shadow-lg"
              >
                <button
                  onClick={() => router.push("/Profile")} // Profile -> /profile
                  className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700"
                >
                  Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700"
                >
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
    </header>
  );
}
