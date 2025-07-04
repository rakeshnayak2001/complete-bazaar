"use client";
import React from "react";
import Navbar from "@/components/Navbar";

export default function AboutPage() {
  return (
    <>
    <Navbar />
    <div className="min-h-screen px-4 md:px-20 py-16 bg-white text-gray-800">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">About CompleteBazar</h1>

        <p className="text-lg leading-relaxed mb-6 text-center">
          Welcome to <span className="font-semibold">CompleteBazar</span> – a fast, modern, and responsive eCommerce platform designed to make online shopping easier for everyone.
        </p>

        <p className="text-base leading-7 mb-4">
          CompleteBazar is built with a clear goal: to create a smooth and efficient shopping experience using modern web technologies. Whether you're browsing products, managing your cart, or checking out — everything is designed for speed and simplicity.
        </p>

        <p className="text-base leading-7 mb-4">
          Behind the scenes, this app uses powerful tools like React, Next.js, and secure backend integrations. We've focused on clean code, reusable components, and a mobile-first approach to ensure a great experience on any device.
        </p>

        <p className="text-base leading-7 mb-4">
          This project is not only a shopping platform — it’s a message to every developer: <span className="italic">Start small, build consistently, and share your work.</span>
        </p>

        <p className="text-base leading-7 mb-4">
          Thank you for visiting CompleteBazar. We hope you find inspiration in our journey — and maybe even start your own!
        </p>
      </div>
    </div>
    </>
  );
}


