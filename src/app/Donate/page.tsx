"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Header from "../../components/Header";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import HeroCarousel from "../../components/HeroCarousel";
import Footer from "@/components/footer";
import TransfusionOrderForm from "@/components/TransfusionOrderForm";
import { FaTimes, FaExclamationCircle } from "react-icons/fa";

interface Hospital {
  id: number;
  name: string;
  description: string;
  location: string;
  image: string;
}

// Separate component to handle useSearchParams
function BloodDonationCentersContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "request" ? "request" : "donate";
  const [activeTab, setActiveTab] = useState<"donate" | "request">(initialTab);
  const [centers, setCenters] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem("access");
    return !!token;
  };

  // Fetch hospital data
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${apiUrl}api/hospitals/`);
        setCenters(response.data);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
        setError("Failed to load donation centers. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHospitals();
  }, [apiUrl]); // Added apiUrl as dependency

  // Update activeTab when query parameter changes
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "request" || tab === "donate") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleClick = (center: Hospital) => {
    if (!isAuthenticated()) {
      setError("Please sign in to proceed with donation.");
      setTimeout(() => {
        router.push("/signin");
      }, 2000);
      return;
    }

    const query = new URLSearchParams({
      id: center.id.toString(),
      name: center.name,
      description: center.description,
      location: center.location,
      image: center.image,
    }).toString();

    setError(null);
    router.push(`/DonateForm?${query}`);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white text-gray-900 min-h-screen py-6 relative"
    >
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white">
        <div className="relative z-10"> {/* Header on top with higher z-index */}
          <Header />
        </div>
      </header>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="max-w-4xl mx-auto p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-md mb-6 flex items-center justify-between"
        >
          <div className="flex items-center">
            <FaExclamationCircle className="text-red-500 mr-3 text-lg" />
            <span className="font-semibold">{error}</span>
          </div>
          <button
            onClick={clearError}
            className="text-red-500 hover:text-red-700 transition-colors"
            aria-label="Dismiss error"
          >
            <FaTimes className="text-lg" />
          </button>
        </motion.div>
      )}

      {/* Add margin-top to push HeroCarousel below the Header */}
      <div className="mt-20"> {/* Adjust mt-20 (80px) based on Header height */}
        <HeroCarousel />
      </div>

      <div className="max-w-8xl mx-auto mt-6">
        <div className="flex justify-start space-x-4">
          <button
            onClick={() => {
              setActiveTab("donate");
              router.push("/Donate?tab=donate");
            }}
            className={`px-4 py-2 font-semibold ${
              activeTab === "donate" ? "border-b-2 border-red-500 text-gray-900" : "text-gray-600"
            }`}
          >
            Donate
          </button>
          <button
            onClick={() => {
              setActiveTab("request");
              router.push("/Donate?tab=request");
            }}
            className={`px-4 py-2 font-semibold ${
              activeTab === "request" ? "border-b-2 border-red-500 text-gray-900" : "text-gray-600"
            }`}
          >
            Request Blood
          </button>
        </div>
      </div>

      {activeTab === "donate" ? (
        <motion.div
          className="max-w-8xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 p-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {isLoading ? (
            <p>Loading centers...</p>
          ) : centers.length === 0 ? (
            <p>No donation centers available.</p>
          ) : (
            centers.map((center, index) => (
              <motion.div
                key={center.id}
                onClick={() => handleClick(center)}
                className="bg-white p-6 rounded-xl shadow-xl cursor-pointer"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  ease: "easeOut",
                  delay: index * 0.1,
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <Image
                    src={center.image}
                    alt={center.name}
                    width={200}
                    height={200}
                    className="w-full h-64 object-contain rounded-lg"
                  />
                </motion.div>

                <h2 className="text-xl font-semibold mt-4">{center.name}</h2>
                <p className="text-gray-600 mt-2 text-sm line-clamp-2">{center.description}</p>
                <p className="text-black text-sm font-semibold px-3 py-1">{center.location}</p>
              </motion.div>
            ))
          )}
        </motion.div>
      ) : (
        <TransfusionOrderForm setError={setError} />
      )}
      <Footer />
      {/* Footer */}
        <div className="absolute bottom-0 left-0 w-full">
          <Footer />
        </div>
    </motion.main>
  );
}

export default function BloodDonationCenters() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BloodDonationCentersContent />
    </Suspense>
  );
}