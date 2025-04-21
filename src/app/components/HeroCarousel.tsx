"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const sections = [
  {
    title: "Welcome",
    description: "Find a location near you to donate blood and save lives.",
  },
  {
    title: "Why Donate Blood?",
    description:
      "Blood transfusions save millions of lives every year. Donated blood is used for surgeries, accident victims, and patients with medical conditions that require blood components.",
    image: "/images/why.png",
  },
  {
    title: "Eligibility Requirements",
    list: [
      "Must be in good health.",
      "At least 16 or 17 years old, depending on local laws.",
      "Minimum weight of 110 pounds (50 kg).",
      "Must pass a physical and health-history assessment.",
    ],
    image: "/images/eligible.png",
  },
  {
    title: "How to Prepare for Donation",
    list: [
      "Get plenty of sleep the night before.",
      "Eat a healthy meal and avoid fatty foods.",
      "Stay hydrated and drink plenty of water.",
      "Wear a shirt with sleeves that can be rolled up.",
    ],
    image: "/images/prep.png",
  },
  {
    title: "What to Expect",
    description:
      "Before donating, you will undergo a brief medical history check and a physical exam. A small blood sample is taken to check your hemoglobin levels. If you pass, you will proceed with the donation process.",
    image: "/images/expect.png",
  },
  {
    title: "After Donation Care",
    list: [
      "Drink extra fluids.",
      "Avoid heavy lifting for 24 hours.",
      "If lightheaded, lie down with feet elevated.",
      "Keep the bandage on for at least four hours.",
      "If bruising occurs, apply a cold pack.",
    ],
    image: "/images/after.png",
  },
  {
    title: "Blood Testing and Safety",
    description:
      "Donated blood is tested for blood type, Rh factor, and infectious diseases such as hepatitis and HIV. If tests are clear, the blood is distributed for medical use.",
    image: "/images/test.png",
  },
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(0); // Track slide direction

  // Auto-play functionality
  useEffect(() => {
    if (!isPaused) {
      const timer = setInterval(() => {
        setDirection(1);
        setCurrentSlide((prev) => (prev + 1) % sections.length);
      }, 3000); // Change slide every 5 seconds
      return () => clearInterval(timer);
    }
  }, [isPaused]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % sections.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + sections.length) % sections.length);
  };

  // Slide animation variants
  const slideVariants = {
    initial: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? 100 : -100,
      scale: 0.95,
    }),
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
    },
    exit: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? -100 : 100,
      scale: 0.95,
      transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
    }),
  };

  // Content animation variants
  const contentVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const imageVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const buttonVariants = {
    hover: { scale: 1.1, boxShadow: "0px 0px 8px rgba(255, 255, 255, 0.5)", rotate: 10 },
    tap: { scale: 0.95 },
  };

  const dotVariants = {
    active: { scale: 1.3, backgroundColor: "#ffffff" },
    inactive: { scale: 1, backgroundColor: "#9CA3AF" },
  };

  return (
    <div
      className="relative w-full h-64 md:h-80 overflow-hidden shadow-2xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-r from-red-600 to-red-800 bg-opacity-80 text-white p-6"
        >
          {currentSlide === 0 ? (
            <div className="text-center">
              <motion.h1
                variants={contentVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-6xl font-extrabold tracking-tight"
              >
                BLOOD DONATION CENTERS IN CEBU CITY
              </motion.h1>
              <motion.p
                variants={contentVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.4 }}
                className="text-lg md:text-xl mt-4 px-4 font-light"
              >
                {sections[currentSlide].description}
              </motion.p>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-center justify-center w-full h-full p-4 gap-6">
              <div className="flex-1 text-center md:text-left">
                <motion.h2
                  variants={contentVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 0.2 }}
                  className="text-2xl md:text-2xl font-bold mb-3"
                >
                  {sections[currentSlide].title}
                </motion.h2>
                {sections[currentSlide].description ? (
                  <motion.p
                    variants={contentVariants}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 0.4 }}
                    className="text-base md:text-lg max-w-md font-light"
                  >
                    {sections[currentSlide].description}
                  </motion.p>
                ) : (
                  <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.2, delay: 0.4 }}
                    className="text-base md:text-lg list-disc list-inside max-w-md space-y-2"
                  >
                    {sections[currentSlide].list?.map((item, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        {item}
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </div>
              {sections[currentSlide].image && (
                <motion.img
                  variants={imageVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                  src={sections[currentSlide].image}
                  alt={sections[currentSlide].title}
                  className="w-full md:w-1/2 h-48 md:h-full object-cover rounded-lg shadow-lg"
                />
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <motion.button
      onClick={prevSlide}
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-3 rounded-full shadow-lg"
      aria-label="Previous slide"
      >
      <ChevronLeft className="w-6 h-6" />
      </motion.button>

      <motion.button
      onClick={nextSlide}
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white  p-3 rounded-full shadow-lg"
      aria-label="Next slide"
      >
      <ChevronRight className="w-6 h-6" />
      </motion.button>

      {/* Dots for Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {sections.map((_, index) => (
          <motion.div
            key={index}
            className="w-2 h-2 rounded-full cursor-pointer"
            variants={dotVariants}
            animate={currentSlide === index ? "active" : "inactive"}
            whileHover={{ scale: 1.5 }}
            onClick={() => {
              setDirection(index > currentSlide ? 1 : -1);
              setCurrentSlide(index);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;