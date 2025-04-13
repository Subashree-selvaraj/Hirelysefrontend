import React, { useState, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import '../uploadResume.css';
import JobSuggestions from "../components/JobSuggestions"; // make sure this component exists

function UploadResume() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobText, setJobText] = useState("");
  const [parsedData, setParsedData] = useState(null);
  const [atsResult, setAtsResult] = useState(null);
  const [showJobs, setShowJobs] = useState(false); // properly placed
  const atsRef = useRef();

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!resumeFile) return;
    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      const res = await axios.post("http://localhost:5000/upload", formData);
      setParsedData(res.data);
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const handleAnalyze = async () => {
    if (!parsedData || !jobText) return;

    try {
      const res = await axios.post("http://localhost:5000/ats-gemini", {
        resumeText: parsedData.text,
        jobText: jobText,
      });
      setAtsResult(res.data);
    } catch (err) {
      console.error("Gemini ATS error:", err);
    }
  };

  const handleDownloadPDF = async () => {
    const input = atsRef.current;
    if (!input) return;

    try {
      const canvas = await html2canvas(input, { scale: 2, useCORS: true });

      const imgWidth = 210;
      const pageHeight = 297;
      const pxPerMm = canvas.width / imgWidth;
      const pageHeightPx = pageHeight * pxPerMm;
      const bottomMargin = 20 * pxPerMm;

      const pdf = new jsPDF("p", "mm", "a4");
      let position = 0;
      let pageIndex = 0;

      while (position < canvas.height) {
        const sliceHeight = Math.min(pageHeightPx - bottomMargin, canvas.height - position);
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = sliceHeight;

        const ctx = pageCanvas.getContext("2d");
        ctx.drawImage(canvas, 0, position, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);

        const imgData = pageCanvas.toDataURL("image/png");

        if (pageIndex === 0) {
          pdf.addImage(imgData, "PNG", 0, 0, imgWidth, sliceHeight / pxPerMm);
        } else {
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, 0, imgWidth, sliceHeight / pxPerMm);
        }

        position += sliceHeight;
        pageIndex++;
      }

      pdf.save("ATS_Report.pdf");
    } catch (error) {
      console.error("PDF generation failed:", error);
    }
  };

  return (
    <div style={{ 
      maxWidth: "800px",
      margin: "40px auto",
      padding: "30px",
      background: "linear-gradient(135deg, #fce4ec 0%, #ffe0e9 100%)",
      borderRadius: "20px",
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
      border: "1px solid #f8a5c2"
    }}>
      <h1 style={{ marginBottom: "10px" }}>Hirelyze</h1>

      <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 0 10px #eee" }}>
      <h2 style={{ 
    fontSize: "1.5rem", 
    color: "#333", 
    marginBottom: "15px", 
    textAlign: "center", 
    fontWeight: "bold" 
  }}>
    Upload Your Resume
  </h2>
  <input 
    type="file" 
    onChange={handleFileChange} 
    style={{ 
      display: "block", 
      margin: "10px auto", 
      padding: "8px", 
      border: "1px solid #ccc", 
      borderRadius: "6px", 
      width: "100%", 
      maxWidth: "400px" 
    }} 
  />
        <button 
    onClick={handleUpload} 
    style={{ 
      display: "block", 
      margin: "15px auto 0", 
      padding: "10px 20px", 
      backgroundColor: "#007bff", 
      color: "#fff", 
      border: "none", 
      borderRadius: "6px", 
      cursor: "pointer", 
      fontSize: "1rem", 
      transition: "background-color 0.3s ease" 
    }}
    onMouseOver={(e) => e.target.style.backgroundColor = "#0056b3"}
    onMouseOut={(e) => e.target.style.backgroundColor = "#007bff"}
  >
    Upload Resume
  </button>

  {parsedData && (
    <div style={{ 
      marginTop: "20px", 
      padding: "15px", 
      backgroundColor: "#fff", 
      borderRadius: "8px", 
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" 
    }}>
      <h3 style={{ 
        fontSize: "1.25rem", 
        color: "#555", 
        marginBottom: "10px" 
      }}>
        Resume Preview
      </h3>
      <p><strong>Name:</strong> {parsedData.name}</p>
      <p><strong>Email:</strong> {parsedData.email}</p>
      <p><strong>Phone:</strong> {parsedData.phone}</p>
    </div>
  )}

      <div style={{ marginTop: "30px", backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 0 10px #eee" }}>
        <h2>Paste Job Description</h2>
        <textarea
          placeholder="Paste job description here..."
          rows={10}
          value={jobText}
          onChange={(e) => setJobText(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginTop: "10px",
            resize: "vertical",
            fontSize: "14px",
          }}
        />
        <button onClick={handleAnalyze} style={{ marginTop: "10px", padding: "8px 16px", cursor: "pointer" }}>
          🚀 Analyze ATS Match
        </button>
        <button
          onClick={() => setShowJobs(!showJobs)}
          style={{ marginTop: "10px", padding: "8px 16px", cursor: "pointer", marginLeft: "10px" }}
        >
          💼 Job Suggestions
        </button>
      </div>

      {showJobs && (
  <div style={{ marginTop: "20px" }}>
    <JobSuggestions
      keywords={atsResult?.matched_keywords}
      summary={atsResult?.summary}
    />
  </div>
)}


      {atsResult && (
        <div style={{ marginTop: "30px", backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 0 10px #eee" }}>
          <h2>📊 ATS Analysis Result</h2>
          <button onClick={handleDownloadPDF} style={{ marginBottom: "15px", padding: "8px 16px", cursor: "pointer" }}>
            📥 Download PDF Report
          </button>
          <p><strong>Score:</strong> {atsResult.ats_score}</p>
          <p><strong>Matched Keywords:</strong> {atsResult.matched_keywords?.join(", ")}</p>
          <p><strong>Summary:</strong> {atsResult.summary}</p>

          {atsResult.recommendations?.length > 0 && (
            <div style={{ marginTop: "15px" }}>
              <h4>📌 Recommendations</h4>
              <ul>
                {atsResult.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Hidden ATS Report for PDF */}
      <div style={{ position: "fixed", top: "-9999px", left: "-9999px", width: "800px" }}>
        <div
          id="pdf-report"
          ref={atsRef}
          style={{
            padding: 20,
            fontSize: 12,
            backgroundColor: "white",
            width: "595px",
            color: "#000",
            fontFamily: "Arial",
          }}
        >
          <h1 style={{ textAlign: "center" }}>📋 ATS Resume Analysis Report</h1>
          <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>

          <h2>👤 Resume Overview</h2>
          <p><strong>Name:</strong> {parsedData?.name}</p>
          <p><strong>Email:</strong> {parsedData?.email}</p>
          <p><strong>Phone:</strong> {parsedData?.phone}</p>

          <h2>📄 Resume Text Snippet</h2>
          <p>{parsedData?.text?.slice(0, 600)}...</p>

          <h2>📝 Job Description Provided</h2>
          <p>{jobText?.slice(0, 1000)}...</p>

          <h2>📊 ATS Match Score</h2>
          <p><strong>Score:</strong> {atsResult?.ats_score} / 100</p>
          <p>
            <strong>Analysis:</strong>{" "}
            {atsResult?.ats_score > 80
              ? "Your resume is highly aligned with the job description. Great job!"
              : atsResult?.ats_score > 50
              ? "Moderate alignment. Improvements recommended."
              : "Low alignment. Major changes needed."}
          </p>

          <h2>✅ Matched Keywords</h2>
          <ul>
            {atsResult?.matched_keywords?.map((kw, idx) => (
              <li key={idx}>{kw}</li>
            ))}
          </ul>

          <h2>❌ Missing Keywords</h2>
          <ul>
            {atsResult?.missing_keywords?.length > 0 ? (
              atsResult?.missing_keywords.map((kw, idx) => <li key={idx}>{kw}</li>)
            ) : (
              <li>None</li>
            )}
          </ul>

          <h2>🧠 AI Summary of Resume vs JD</h2>
          <p>{atsResult?.summary}</p>

          <h2>🔍 Detailed Recommendations</h2>
          <ul>
            {atsResult?.recommendations?.length > 0 ? (
              atsResult.recommendations.map((rec, idx) => <li key={idx}>{rec}</li>)
            ) : (
              <li>No specific suggestions provided.</li>
            )}
          </ul>

          <hr />
          <p style={{ textAlign: "center", fontSize: 10 }}>
            Powered by Gemini AI | ATS Optimized Resume Insights
          </p>
        </div>
      </div>
    </div>
  </div>
  );

}



export default UploadResume;
