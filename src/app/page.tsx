"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Header from "@/components/Header";
import HeroCarousel from "../components/HeroCarousel";
import About from "../components/about";
import Footer from "@/components/footer";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-white text-gray-900 min-h-screen py-6 relative"
    >
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <div className="relative z-10">
          <Header />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row items-center px-4 sm:px-6 lg:px-10 mt-16 lg:mt-20 relative z-0">
        {/* Left Section */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-full lg:w-1/2 text-center lg:text-left relative mb-8 lg:mb-0"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-red-600">
            Donate Blood, <span className="text-yellow-500">Save Lives</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-700 mt-4 max-w-md mx-auto lg:mx-0">
            Your blood donation can be the difference between life and death for someone in need. Join us in making a real impact.
          </p>

          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "#b91c1c", color: "#fff" }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
            type="button"
            onClick={() => {
              router.push("/Donate");
              alert("Redirecting to Donation Page");
            }}
            className="bg-gradient-to-r from-red-600 to-red-800 text-white font-bold px-4 py-2 sm:px-6 sm:py-3 rounded-full mt-6 hover:bg-red-700 transition"
          >
            DONATE NOW
          </motion.button>
        </motion.div>

        {/* Right Section */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-full lg:w-1/2 flex justify-center lg:justify-end mt-8 lg:mt-0 relative"
        >
          {/* Blood Donation Image */}
          <motion.div
            initial={{ opacity: 0, rotate: -5, scale: 0.9 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            transition={{ duration: 1 }}
            whileHover={{ scale: 1.05, rotate: 3 }}
            className="rounded-2xl w-full max-w-sm sm:max-w-md lg:max-w-lg"
          >
            <Image
              src="/images/home.png"
              alt="Blood Donation"
              quality={100}
              width={500}
              height={600}
              className="rounded-2xl object-cover w-full h-auto z-10"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 500px"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Other Components */}
      <div className="px-4 sm:px-6 lg:px-10">
        <HeroCarousel />
        <About />
      </div>

      {/* Footer */}
      <Footer />
    </motion.div>
  );
}