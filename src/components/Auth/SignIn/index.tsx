"use client";

import Link from "next/link";
import { useContext, useState } from "react";
import SocialSignIn from "../SocialSignIn";
import Logo from "@/components/Layout/Header/Logo";
import Loader from "@/components/Common/Loader";
import toast, { Toaster } from "react-hot-toast";
import AuthDialogContext from "@/app/context/AuthDialogContext";
import { API_BASE } from "@/utils/api";

const Signin = ({ signInOpen }: { signInOpen?: any }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const authDialog = useContext(AuthDialogContext);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      console.log("API_BASE =", API_BASE);

      const url = `${API_BASE}/auth/login`;
      console.log("LOGIN URL =", url);

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("LOGIN STATUS =", response.status);

      // Try to parse JSON safely
      let data: any = null;
      const text = await response.text();
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = null;
      }

      if (!response.ok) {
        const msg =
          data?.error ||
          data?.message ||
          `Login failed (status ${response.status})`;
        throw new Error(msg);
      }

      // ✅ store JWT + user
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setSuccessMsg("Signed in successfully. Redirecting...");
      toast.success("Signed in successfully");

      setTimeout(() => {
        if (signInOpen) signInOpen(false);

        authDialog?.setIsSuccessDialogOpen(true);

        const adminEmail = "admin@gmail.com";
        const loggedEmail = (data.user?.email || "").toLowerCase().trim();

        if (loggedEmail === adminEmail) {
          window.location.href = "/inbox";
        } else {
          window.location.href = "/";
        }
      }, 1000);
    } catch (err: any) {
      const message =
        err?.message ||
        "Failed to fetch (CORS / wrong API url / backend down)";
      setErrorMsg(message);
      toast.error(message);

      authDialog?.setIsFailedDialogOpen(true);
      setTimeout(() => {
        authDialog?.setIsFailedDialogOpen(false);
      }, 1100);

      console.error("LOGIN ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-10 text-center mx-auto inline-block max-w-[160px]">
        <Logo />
      </div>

      <SocialSignIn />

      <span className="relative my-8 block text-center">
        <span className="absolute left-0 top-1/2 block h-px w-full bg-border dark:bg-dark_border"></span>
        <span className="relative inline-block px-4 py-1 text-xs font-semibold rounded-full border border-border dark:border-dark_border bg-[#071333] text-white">
          OR
        </span>
        <Toaster />
      </span>

      <form onSubmit={handleSubmit}>
        <div className="mb-[22px]">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border px-5 py-3"
          />
        </div>

        <div className="mb-[22px]">
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border px-5 py-3"
          />
        </div>

        <div className="mb-9">
          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-md bg-primary px-5 py-3 text-white"
          >
            Sign In
            {loading && <Loader />}
          </button>
        </div>
      </form>

      {successMsg && <p className="text-green-500">{successMsg}</p>}
      {errorMsg && <p className="text-red-500">{errorMsg}</p>}

      <Link href="/" className="block mt-4">
        Forget Password?
      </Link>
    </>
  );
};

export default Signin;
