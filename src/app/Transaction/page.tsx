"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Header from "@/components/Header";

interface Hospital {
  name: string;
  description: string;
  location: string;
  contact_number: string;
  image?: string;
}

interface Donation {
  id: number;
  hospital: Hospital;
  blood_type: string;
  status: "pending" | "appointed" | "completed";
  created_at?: string;
}

interface BloodRequest {
  id: number;
  blood_type: string;
  request_date: string;
  status: "Pending" | "Approved" | "Declined";
  patient_name: string;
}

export default function Transactions() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"donations" | "requests">("donations");

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("access");
      if (!token) throw new Error("User not authenticated.");

      const response = await axios.get("http://127.0.0.1:8000/api/appointed-records/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { appointed_donations, appointed_requests } = response.data;

      setDonations(appointed_donations || []);
      setRequests(appointed_requests || []);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.detail || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const formatStatus = (status: string) => {
    const lower = status.toLowerCase();
    if (lower === "completed" || lower === "approved")
      return "bg-green-100 text-green-700";
    if (lower === "pending") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white text-gray-900 min-h-screen pt-6"
    >
      <header className="fixed top-0 left-0 w-full z-50 bg-white shadow">
        <Header />
      </header>

      <div className="max-w-6xl mx-auto pt-20 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6 text-center">My Transactions</h1>

        {/* Toggle Tabs */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setActiveTab("donations")}
            className={`px-6 py-2 font-medium rounded-l-full border ${
              activeTab === "donations"
                ? "bg-red-600 text-white border-red-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            Donations
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-6 py-2 font-medium rounded-r-full border ${
              activeTab === "requests"
                ? "bg-red-600 text-white border-red-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            Requests
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <p className="text-center text-gray-600">Loading transactions...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <>
            {activeTab === "donations" ? (
              <section>
                {donations.length === 0 ? (
                  <p className="text-gray-500 text-center">No donations found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg shadow-md">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Hospital Details</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Blood Type</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {donations.map((donation, index) => (
                          <motion.tr
                            key={donation.id}
                            className="border-b hover:bg-gray-100 transition"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-start space-x-4">
                                {donation.hospital.image && (
                                  <img
                                    src={`http://127.0.0.1:8000${donation.hospital.image}`}
                                    alt={donation.hospital.name}
                                    className="w-20 h-20 rounded object-cover border"
                                  />
                                )}
                                <div>
                                  <p className="font-semibold text-lg">{donation.hospital.name}</p>
                                  <p className="text-sm text-gray-600">{donation.hospital.description}</p>
                                  <p className="text-sm text-gray-500 mt-1">
                                    📍 {donation.hospital.location}
                                  </p>
                                  <p className="text-sm text-gray-500">📞 {donation.hospital.contact_number}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">{donation.blood_type}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${formatStatus(
                                  donation.status
                                )}`}
                              >
                                {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                              </span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            ) : (
              <section>
                {requests.length === 0 ? (
                  <p className="text-gray-500 text-center">No requests found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg shadow-md">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Patient Name</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Blood Type</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {requests.map((req, index) => (
                          <motion.tr
                            key={req.id}
                            className="border-b hover:bg-gray-100 transition"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                          >
                            <td className="px-4 py-3">{req.patient_name}</td>
                            <td className="px-4 py-3">{req.blood_type}</td>
                            <td className="px-4 py-3">
                              {new Date(req.request_date).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${formatStatus(
                                  req.status
                                )}`}
                              >
                                {req.status}
                              </span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </div>
    </motion.main>
  );
}
