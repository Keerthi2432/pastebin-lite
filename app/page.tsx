"use client";
import { useState } from "react";

export default function Home() {
  const [result, setResult] = useState("");

  const createPaste = async () => {
    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: "Hello test",
        ttl_seconds: 60,
        max_views: 2,
      }),
    });

    const data = await res.json();
    setResult(data.url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-lg text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">Pastebin Lite</h1>
        <p className="text-gray-500 mb-6">
          Create and share text pastes instantly
        </p>

        <button
          onClick={createPaste}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl shadow-md transition duration-200"
        >
          Create Paste
        </button>

        {result && (
          <div className="mt-6 bg-gray-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Your Paste Link:</p>
            <a
              href={result}
              className="text-blue-600 font-medium break-all underline"
            >
              {result}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
