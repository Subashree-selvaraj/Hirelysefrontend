import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import mermaid from "mermaid";

mermaid.initialize({ startOnLoad: true, theme: "default" });

const RoadmapGenerator = () => {
  const [role, setRole] = useState("");
  const [roadmap, setRoadmap] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const chartRef = useRef(null);

  const fetchRoadmap = async () => {
    if (!role.trim()) {
      setError("Please enter a role.");
      return;
    }

    setError("");
    setLoading(true);
    setRoadmap("");

    try {
      const response = await axios.post("http://localhost:5000/generate-roadmap", { role });
      const code = response.data.roadmap;

      if (!code) {
        setError("Received empty roadmap from the server.");
        return;
      }

      setRoadmap(code);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const renderMermaid = async () => {
      if (roadmap && chartRef.current) {
        try {
          const { svg } = await mermaid.render("roadmapChart", roadmap);
          chartRef.current.innerHTML = svg;
        } catch (err) {
          console.error("Mermaid render error:", err);
          setError("Failed to render roadmap. Please check input or try again.");
        }
      }
    };

    renderMermaid();
  }, [roadmap]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 bg-[#f8f9fc] rounded-xl shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#1f2d3d]">
        🎯 Career Roadmap Generator
      </h2>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Enter your desired role (e.g., Backend Developer)"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full sm:flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={fetchRoadmap}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {roadmap && !error && (
        <div
          ref={chartRef}
          className="mt-8 bg-white p-4 rounded-md shadow border overflow-auto"
        />
      )}
    </div>
  );
};

export default RoadmapGenerator;
