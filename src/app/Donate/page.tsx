// BloodDonationCenters.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Header from "../components/Header";
import { useRouter } from "next/navigation";
import axios from "axios";
import HeroCarousel from "../components/HeroCarousel"; // Adjust the path based on your file structure

interface Hospital {
  id: number;
  name: string;
  description: string;
  location: string;
  image: string;
}

export default function BloodDonationCenters() {
  const [centers, setCenters] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://127.0.0.1:8000/api/hospitals/");
        setCenters(response.data);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  const handleClick = (center: Hospital) => {
    const query = new URLSearchParams({
      id: center.id.toString(),
      name: center.name,
      description: center.description,
      location: center.location,
      image: center.image,
    }).toString();
  
    router.push(`/DonateForm?${query}`);
  };
  return (
    <motion.main
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white text-gray-900 min-h-screen py-6 relative"
    >
      <div className="relative z-10"> {/* Header on top with higher z-index */}
            <Header />
      </div>
      <HeroCarousel />

      {/* Centers Grid */}
      <motion.div
        className="max-w-8xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 p-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {centers.map((center, index) => (
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
        ))}
      </motion.div>
    </motion.main>
  );
}