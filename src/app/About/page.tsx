"use client";

import React from "react";
import { motion } from "framer-motion";
import Header from "../../components/Header";
import Footer from "@/components/footer";
import Image from "next/image";

const About: React.FC = () => {
  const renderTextWithHover = (text: string) => {
    return text.split(" ").map((word, index) => (
      <motion.span
        key={index}
        className="inline-block mr-1.5 text-gray-700"
        whileHover={{
          scale: 1.2,
          color: "#e02424",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: "50%",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          zIndex: 10,
          transition: { duration: 0.3, ease: "easeInOut" },
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
      >
        {word}
      </motion.span>
    ));
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white">
        <div className="relative z-10">
          <Header />
        </div>
      </header>

      {/* Main Content */}
      <motion.main
        className="flex-grow px-10 py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row items-center max-w-6xl mx-auto p-6 md:p-12">
          <motion.div
            className="w-full md:w-1/2 relative"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
          >
            <Image
              src="/images/about.png"
              alt="Blood Donation"
              quality={100}
              width={600}
              height={200}
              className="rounded-lg"
            />
          </motion.div>
          <motion.div
            className="w-full md:w-1/2 md:pl-10"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-extrabold mb-4 text-red-600">ABOUT US</h1>
            <p className="text-lg text-gray-700 mb-4">
              {renderTextWithHover(
                "Blood donation is a voluntary procedure that saves millions of lives each year. Our mission is to raise awareness and encourage more people to become donors."
              )}
            </p>
            <p className="text-lg text-gray-700">
              {renderTextWithHover(
                "Every donation can help patients in need of surgery, trauma care, and chronic illness treatment. We believe in the power of community and giving back."
              )}
            </p>
          </motion.div>
        </div>
      </motion.main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default About;