import React from "react";

export default function HowToRegisterSection() {
  return (
    <section className="max-w-full mx-auto py-16 p-6 bg-white rounded-xl shadow-md text-center">
      <h2 className="text-3xl font-semibold text-[#7C0902] mb-4">
        How to Register on Our App
      </h2>
      <p className="text-gray-700 mb-6 px-4 sm:px-12">
        Watch this quick video to learn how easy it is to register and start
        using our application. Follow the step-by-step guide to get started
        smoothly.
      </p>
      <a
        href="https://www.youtube.com/watch?v=YOUR_VIDEO_ID"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-[#7C0902] hover:bg-[#600601] text-white font-semibold px-6 py-3 rounded-lg shadow transition"
      >
        Watch Video Tutorial
      </a>
    </section>
  );
}
