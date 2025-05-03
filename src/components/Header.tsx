"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Menu, X } from "lucide-react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, ""); // Remove trailing slash
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
        const res = await axios.get(`${apiUrl}/api/users/profile/`, {
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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="flex flex-col sm:flex-row justify-between items-center bg-white text-red-600 px-4 sm:px-10 py-4 sm:py-6">
      {/* Logo and Hamburger Menu */}
      <div className="flex justify-between items-center w-full sm:w-auto">
        <Image
          src="/images/logo.png"
          alt="Blood Logo"
          width={100}
          height={32}
          style={{ width: "auto", height: "32px" }}
          className="cursor-pointer"
          onClick={() => router.push("/")}
        />
        <button
          className="sm:hidden p-1"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className={`flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4 sm:mt-0 w-full sm:w-auto ${mobileMenuOpen ? "flex" : "hidden sm:flex"}`}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => router.push("/")}
          className="hover:underline text-lg sm:text-base"
        >
          Home
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => router.push("/Donate")}
          className="hover:underline text-lg sm:text-base"
        >
          Donate
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => router.push("/About")}
          className="hover:underline text-lg sm:text-base"
        >
          About
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => router.push("/Contact")}
          className="hover:underline text-lg sm:text-base"
        >
          Contact Us
        </motion.button>
      </div>

      {/* Profile Dropdown */}
      <div className="relative mt-4 sm:mt-0">
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