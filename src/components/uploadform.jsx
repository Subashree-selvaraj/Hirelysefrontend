import React, { useState } from 'react';

function UploadForm() {
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResumeText(data.text);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Upload Your Resume (PDF)</h2>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginLeft: "10px" }}>Upload</button>

      <div style={{ marginTop: "20px" }}>
        <h3>Extracted Resume Text:</h3>
        <pre style={{ background: "#f0f0f0", padding: "15px", borderRadius: "6px", whiteSpace: "pre-wrap" }}>
          {resumeText}
        </pre>
      </div>
    </div>
  );
}

export default UploadForm;
