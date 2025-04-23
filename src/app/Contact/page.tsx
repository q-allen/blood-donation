"use client";
import React from "react";
import { motion } from "framer-motion";
import Header from "../../components/Header";

const ContactUs = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-white text-gray-900 min-h-screen px-10 py-6 relative"
    >
      {/* Header */}
      <Header />
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl flex"
        >
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="w-1/2 p-6"
          >
            <h2 className="text-4xl font-bold text-red-600 mb-4">Contact us</h2>
            <form>
              <div className="mb-4">
                <motion.input
                  whileFocus={{ scale: 1.05 }}
                  type="text"
                  placeholder="Name"
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="mb-4">
                <motion.input
                  whileFocus={{ scale: 1.05 }}
                  type="email"
                  placeholder="Email"
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="mb-4">
                <motion.textarea
                  whileFocus={{ scale: 1.05 }}
                  placeholder="Message"
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 h-24"
                ></motion.textarea>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="submit"
                className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600"
              >
                Send Message
              </motion.button>
            </form>
          </motion.div>
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="w-1/2 flex items-center justify-center p-6"
          >
            <motion.img
              src="/images/contact.png"
              alt="Contact Illustration"
              className="max-w-full"
              whileHover={{ scale: 1.1 }}
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ContactUs;