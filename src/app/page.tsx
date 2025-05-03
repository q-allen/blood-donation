"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Header from "@/components/Header"; // Ensure your navbar component is imported
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
    className="bg-white text-gray-900 min-h-screen py-6 relative" // Set z-index to 0 for background
  >
    {/* Header */}
    <header className="fixed top-0 left-0 w-full z-50 bg-white">
      <div className="relative z-10"> {/* Header on top with higher z-index */}
        <Header />
      </div>
    </header>

    {/* Main Content */}
    <div className="flex flex-col md:flex-row items-center px-4 sm:px-6 lg:px-10 mt-16 sm:mt-20 lg:mt-24 relative z-0 pt-16 sm:pt-16 lg:pt-20"> {/* Content stays behind */}
      {/* Left Section */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="md:w-1/2 text-center md:text-left relative"
      >
        <h2 className="text-6xl md:text-7xl font-extrabold text-red-600">
          Donate Blood, <span className="text-yellow-500">Save Lives</span>
        </h2>
        <p className="text-xl text-gray-700 mt-4">
          Your blood donation can be the difference between life and death for someone in need. Join us in making a real impact.
        </p>

        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: "#b91c1c", color: "#fff" }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
          type="button"
          onClick={() => { router.push("/Donate"); alert("Redirecting to Donation Page"); }}
          className="bg-gradient-to-r from-red-600 to-red-800 text-white font-bold px-6 py-3 rounded-full mt-8 hover:bg-red-700 transition"
        >
          DONATE NOW
        </motion.button>
      </motion.div>

      {/* Right Section */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="md:w-1/2 flex flex-col items-center mt-10 md:mt-0 relative"
      >
        {/* Blood Donation Image (Fade-in with Slight Rotation) */}
        <motion.div
          initial={{ opacity: 0, rotate: -5, scale: 0.9 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          transition={{ duration: 1 }}
          whileHover={{ scale: 1.05, rotate: 3 }}
          className="rounded-2xl mt-5 w-full max-w-sm sm:max-w-md lg:max-w-lg"
        >
          <Image
            src="/images/home.png"  // Replace with actual blood donation image
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
  <HeroCarousel />
  <About />
  <Footer />
  {/* Footer */}
    <div className="absolute bottom-0 left-0 w-full">
      <Footer />
    </div>
  </motion.div>
);
}
