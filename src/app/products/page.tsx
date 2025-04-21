"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Header from "../components/Header";
import { useRouter } from "next/navigation";

export default function BloodDonationCenters() {
  const [centers, setCenters] = useState([
    {
      id: 1,
      name: "Cebu City Medical Center",
      description: "A government hospital with a blood donation facility.",
      location: "N. Bacalso Avenue, Cebu City",
      image: "/images/ccmc.png",
    },
    {
      id: 2,
      name: "Vicente Sotto Memorial Medical Center",
      description: "Offers blood donation services and a well-equipped blood bank.",
      location: "B. Rodriguez St, Cebu City",
      image: "/images/vic.png",
    },
    {
      id: 3,
      name: "Chong Hua Hospital",
      description: "A private hospital providing blood donation services.",
      location: "Don Mariano Cui St, Cebu City",
      image: "/images/hua.png",
    },
    {
      id: 4,
      name: "Philippine Red Cross Cebu Chapter",
      description: "A major blood donation center in Cebu City.",
      location: "Osmeña Blvd, Cebu City",
      image: "/images/red cross.jpg",
    },
  ]);
  const router = useRouter();

  const handleClick = (id: number) => {
    router.push(`/Donate?hospitalId=${id}`);
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white text-black min-h-screen"
    >
      <Header />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full h-64 md:h-80"
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-600 bg-opacity-40 text-white">
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            BLOOD DONATION CENTERS IN CEBU CITY
          </motion.h1>
          <motion.p
            className="text-center text-white text-lg max-w-2xl mt-2 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Find a location near you to donate blood and save lives.
          </motion.p>
        </div>
      </motion.div>

      {/* Centers Grid */}
      <motion.div
        className="max-w-8xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 p-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {centers.map((center, index) => (
          
            <motion.div key={center.id}
             onClick={() => handleClick(center.id)}
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
