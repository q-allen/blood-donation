"use client";
import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "../components/Header";
import axios from "axios";
import { useRouter } from "next/navigation";

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const formVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.2 } },
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/api/users/signin/", {
        email,
        password,
      });

      localStorage.setItem("access", res.data.access);
      alert("Successfully logged in!");
      router.push("/");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.error || "Invalid email or password.");
      } else {
        setError("Something went wrong. Please try again.");
      }
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="bg-white text-red-900 min-h-screen px-10 py-6 relative"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={pageVariants}
    >
      <Header />

      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <motion.div
          className="bg-white w-full max-w-4xl flex rounded-lg shadow-xl overflow-hidden"
          initial="hidden"
          animate="visible"
          variants={formVariants}
        >
          <motion.div
            className="hidden md:flex flex-col justify-center flex-1 px-12 bg-gradient-to-r from-red-600 to-red-800 text-white"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.7 } }}
          >
            <h1 className="text-4xl font-bold">DONATE BLOOD, SAVE LIVES</h1>
            <p className="text-lg mt-2">Every drop counts</p>
            <p className="text-sm mt-4">
              Join our community of blood donors and make a difference today.
            </p>
          </motion.div>

          <motion.div
            className="flex-1 p-8 md:p-12"
            initial="hidden"
            animate="visible"
            variants={formVariants}
          >
            <h2 className="text-2xl font-bold text-red-700">Sign in</h2>
            <p className="text-sm text-red-500 mt-1">Enter your details below</p>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <form className="mt-6" onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-red-700 text-sm mb-1">Email</label>
                <motion.div
                  className="flex items-center border border-red-400 rounded-lg px-3 py-2 bg-red-50"
                  whileFocus={{ scale: 1.05 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaUser className="text-red-500" />
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full outline-none bg-transparent ml-2"
                    placeholder="Enter your email"
                    required
                  />
                </motion.div>
              </div>

              <div className="mb-4">
                <label className="block text-red-700 text-sm mb-1">Password</label>
                <motion.div
                  className="flex items-center border border-red-400 rounded-lg px-3 py-2 bg-red-50"
                  whileFocus={{ scale: 1.05 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaLock className="text-red-500" />
                  <input
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full outline-none bg-transparent ml-2"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="text-red-700 text-sm font-semibold"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? "HIDE" : "SHOW"}
                  </button>
                </motion.div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white font-semibold py-3 rounded-lg mt-4 hover:bg-red-700 transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? "Logging in..." : "Sign in"}
              </motion.button>

              <p className="text-center text-black text-sm mt-4">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-red-700 hover:underline">
                  Sign up
                </Link>
              </p>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}