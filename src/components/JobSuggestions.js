import React, { useEffect, useState } from "react";
import axios from "axios";

function JobSuggestions({ keywords = [], summary = "" }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState({});
  const [questions, setQuestions] = useState({});
  const [questionLoading, setQuestionLoading] = useState({});

  useEffect(() => {
    const fetchJobs = async () => {
      if (keywords.length === 0 && !summary) {
        setLoading(false);
        return;
      }

      const query = keywords.slice(0, 5).join(" ") || summary.slice(0, 100);

      const options = {
        method: 'GET',
        url: 'https://jsearch.p.rapidapi.com/search',
        params: {
          query: query || 'software engineer',
          page: '1',
          num_pages: '1'
        },
        headers: {
          'X-RapidAPI-Key': '5f0a45efc5msha459b3624abbf5fp178efejsn4ade39898509',
          'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
        }
      };

      try {
        const res = await axios.request(options);
        setJobs(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [keywords, summary]);

  const handlePracticeClick = async (role, index) => {
    const level = selectedLevel[index] || "Beginner";
    setQuestionLoading((prev) => ({ ...prev, [index]: true }));

    try {
      const res = await axios.post("http://localhost:5000/api/interview-questions", {
        job_role: role,
        level: level
      });
      setQuestions((prev) => ({ ...prev, [index]: res.data.questions }));
    } catch (err) {
      console.error("Error fetching questions", err);
      setQuestions((prev) => ({ ...prev, [index]: ["Failed to load questions."] }));
    } finally {
      setQuestionLoading((prev) => ({ ...prev, [index]: false }));
    }
  };

  return (
    <div style={{ marginTop: "20px", backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 0 10px #eee" }}>
      <h2>🔥 Job Suggestions</h2>
      {loading ? (
        <p>Loading job listings...</p>
      ) : jobs.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {jobs.map((job, index) => (
            <li key={index} style={{ marginBottom: "20px", borderBottom: "1px solid #ddd", paddingBottom: "15px" }}>
              <strong>{job.job_title}</strong><br />
              {job.employer_name} – {job.job_city}, {job.job_country}<br />
              <a href={job.job_apply_link} target="_blank" rel="noopener noreferrer">Apply Now</a>
              <br /><br />
              <label style={{ marginRight: "8px", fontWeight: "bold" }}>Practice Level:</label>
              <select
                value={selectedLevel[index] || "Beginner"}
                onChange={(e) => setSelectedLevel({ ...selectedLevel, [index]: e.target.value })}
                style={{
                  padding: "6px 10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  outline: "none",
                  fontSize: "14px"
                }}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <button
                onClick={() => handlePracticeClick(job.job_title, index)}
                style={{
                  marginLeft: "10px",
                  padding: "6px 12px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                Practice Now
              </button>

              {questionLoading[index] ? (
                <p>🔄 Generating questions...</p>
              ) : questions[index] && (
                <div
                  style={{
                    backgroundColor: "#f9f9f9",
                    marginTop: "10px",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #ddd"
                  }}
                >
                  <h4 style={{ marginBottom: "10px" }}>🧠 Interview Questions:</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {questions[index].map((q, i) => (
                      <div key={i} style={{ padding: "8px", backgroundColor: "#fff", border: "1px solid #eee", borderRadius: "5px" }}>
                         <span style={{ marginRight: "8px" }}>🔹</span>
                                <span>{q}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No job matches found based on your resume keywords.</p>
      )}
    </div>
  );
}

export default JobSuggestions;
