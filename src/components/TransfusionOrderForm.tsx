"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface TransfusionOrderFormProps {
  setError: (error: string | null) => void;
}

export default function TransfusionOrderForm({ setError }: TransfusionOrderFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    patientName: "",
    bloodProduct: "",
    amount: "",
    transfusionRate: "",
    reason: "",
  });

  // Check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem("access");
    console.log("Checking access token:", token);
    return !!token;
  };

  // Handle form input changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      setError("Please sign in to request blood.");
      setTimeout(() => {
        router.push("/signin");
      }, 2000);
      return;
    }

    // Add logic to submit the form data to your backend
    console.log("Form submitted:", formData);
    setError("Blood request submitted successfully!");
    setFormData({
      patientName: "",
      bloodProduct: "",
      amount: "",
      transfusionRate: "",
      reason: "",
    });
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto p-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <h2 className="text-2xl font-semibold mb-6">Transfusion Order Form</h2>
      <form onSubmit={handleFormSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="patientName" className="block text-gray-700 mb-2">
            Patient Name
          </label>
          <input
            type="text"
            id="patientName"
            name="patientName"
            value={formData.patientName}
            onChange={handleFormChange}
            placeholder="Enter patient's full name"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="bloodProduct" className="block text-gray-700 mb-2">
            Blood Product
          </label>
          <select
            id="bloodProduct"
            name="bloodProduct"
            value={formData.bloodProduct}
            onChange={handleFormChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          >
            <option value="">Select blood type</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="amount" className="block text-gray-700 mb-2">
            Amount (in units or mL)
          </label>
          <input
            type="text"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleFormChange}
            placeholder="e.g., 2 units or 500 mL"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="transfusionRate" className="block text-gray-700 mb-2">
            Transfusion Rate
          </label>
          <input
            type="text"
            id="transfusionRate"
            name="transfusionRate"
            value={formData.transfusionRate}
            onChange={handleFormChange}
            placeholder="e.g., 100 mL/hour"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="reason" className="block text-gray-700 mb-2">
            Reason for Transfusion
          </label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleFormChange}
            placeholder="Describe the medical reason for transfusion"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            rows={4}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Submit Order
        </button>
      </form>
    </motion.div>
  );
}