"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { setServers } from "dns";

interface TransfusionOrderFormProps {
  setError: (error: string | null) => void;
}

export default function TransfusionOrderForm({ setError }: TransfusionOrderFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    patient_name: "",
    blood_product: "",
    amount: "",
    transfusion_rate: "",
    reason: "",
    blood_type: "unknown",
    status: "Pending" // Added bloodType
  });

  // Success message state
  const [success, setSuccess] = useState<string | null>(null);

  const isAuthenticated = () => !!localStorage.getItem("access");

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated()) {
      setError("Please sign in to request blood.");
      setTimeout(() => {
        router.push("/signin");
      }, 2000);
      return;
    }

    const token = localStorage.getItem("access");

    try {
      const res = await fetch("http://localhost:8000/api/request-blood/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess("✅ Blood request submitted successfully!");
        setFormData({
          patient_name: "",
          blood_product: "",
          amount: "",
          transfusion_rate: "",
          reason: "",
          blood_type: "unknown",
          status: "Pending",
        });
      } else {
        const data = await res.json();
       
        setError(`❌ Error: ${data.detail || "Failed to submit request"}`);
      }
    } catch (error) {
      setError("❌ An error occurred while submitting the request.");
    }
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-6">Transfusion Order Form</h2>
      {success && (
        <div className="mb-4 text-green-700 bg-green-100 px-4 py-2 rounded">
          {success}
        </div>
      )}
      <form onSubmit={handleFormSubmit} className="space-y-4">

        <input
          type="text"
          name="patient_name"
          placeholder="Patient Name"
          value={formData.patient_name}
          onChange={handleFormChange}
          required
          className="w-full px-4 py-2 border rounded"
        />

        <input
          type="text"
          name="blood_product"
          placeholder="Blood Product (e.g. Whole Blood)"
          value={formData.blood_product}
          onChange={handleFormChange}
          required
          className="w-full px-4 py-2 border rounded"
        />

        <input
          type="number"
          name="amount"
          placeholder="Amount (ml)"
          value={formData.amount}
          onChange={handleFormChange}
          required
          className="w-full px-4 py-2 border rounded"
        />

        <input
          type="text"
          name="transfusion_rate"
          placeholder="Transfusion Rate"
          value={formData.transfusion_rate}
          onChange={handleFormChange}
          required
          className="w-full px-4 py-2 border rounded"
        />

        <textarea
          name="reason"
          placeholder="Reason for Transfusion"
          value={formData.reason}
          onChange={handleFormChange}
          required
          className="w-full px-4 py-2 border rounded h-24"
        />

        <select
          name="blood_type"
          value={formData.blood_type}
          onChange={handleFormChange}
          required
          className="w-full px-4 py-2 border rounded"
        >
          <option value="">Select Blood Type</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="unknown">Unknown</option>
        </select>

        <button
          type="submit"
          className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-2 rounded hover:bg-red-700 transition"
        >
          Submit Request
        </button>
      </form>
    </motion.div>
  );
}
function setSuccess(arg0: string) {
  throw new Error("Function not implemented.");
}

