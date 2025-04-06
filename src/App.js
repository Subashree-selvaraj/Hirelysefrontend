import React from "react";
import UploadResume from "./pages/UploadResume";
//@import url('https://fonts.googleapis.com/css2?family=Satisfy&display=swap');
function App() {
  return (
    
    <div className="App">
  <div className="resume-hero">
    <div className="hero-content">
    
    <header className="navbar">
  <div className="navbar-container">
    <div className="navbar-brand" style={{ textAlign: "left", fontWeight: "bold", fontSize: "1.5rem" }}>
      Hirelyze
    </div>
    
  </div>
</header>
<div style={{
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "50px",
  background: "#f9faff",
  borderRadius: "20px",
  margin: "40px auto",
  height: "500px" ,
  maxWidth: "1100px",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.05)"
}}>
  {/* Left Side Text */}
  <div style={{ flex: 1, paddingRight: "40px" }}>
    <h3 style={{ color: "#1a73e8", fontWeight: "600" }}>Fast. Easy. Effective.</h3>
    <h1 style={{ fontSize: "38px", color: "#1f2d3d", marginTop: "10px" }}>
      Hirelyze. The Smart Resume Tool.
    </h1>
    <p style={{ fontSize: "16px", marginTop: "20px", color: "#4a4a4a" }}>
      Build or analyze your resume in seconds. Get insights, feedback, and tips to boost your resume's performance.
    </p>

    <div style={{ marginTop: "30px", display: "flex", gap: "20px" }}>
      <button style={{
        backgroundColor: "#ffb347",
        color: "#fff",
        padding: "12px 24px",
        borderRadius: "30px",
        border: "none",
        fontWeight: "bold",
        fontSize: "16px",
        cursor: "pointer"
      }}>
        Create New Resume
      </button>

      <button style={{
        border: "2px solid #1a73e8",
        color: "#1a73e8",
        padding: "12px 24px",
        borderRadius: "30px",
        background: "transparent",
        fontWeight: "bold",
        fontSize: "16px",
        cursor: "pointer"
      }}>
        Improve Existing Resume
      </button>
    </div>
  </div>

  {/* Right Side Image */}
  <div style={{ flex: 1 }}>
    <img
      src="https://media.istockphoto.com/id/1427943275/vector/resume-writing-service-abstract-concept-vector-illustration.jpg?s=612x612&w=0&k=20&c=fuiOaA1PtHx36oNCbenAeM4Vrgh9ZHi5Xq9X9Tu6mBw=" // Replace with your actual image path
      alt="Resume Preview"
      style={{
        width: "100%",
        maxWidth: "480px",
        borderRadius: "20px",
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)"
      }}
    />
  </div>
</div>

    </div>
    <div className="hero-blob"></div>
  </div>

  <section className="upload-section">
    <UploadResume />
  </section>
</div>

  );
}

export default App;