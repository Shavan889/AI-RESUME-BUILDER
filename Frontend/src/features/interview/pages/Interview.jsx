import React, { useState, useEffect } from "react";
import "../style/interview.scss";
import { useInterview } from "./../hooks/useInterview";
import { useNavigate, useParams } from "react-router";

const Interview = () => {
  const [activeTab, setActiveTab] = useState("technical");
  const [openQuestion, setOpenQuestion] = useState(0);
  const [error, setError] = useState(null);

  const { report, getReportById, loading, getResumePdf } = useInterview();
  const { interviewId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const loadReport = async () => {
      if (interviewId) {
        try {
          await getReportById(interviewId);
          setError(null);
        } catch (err) {
          setError("Failed to load interview report. Please go back and try again.");
        }
      }
    };
    loadReport();
  }, [interviewId]);

  if (loading) {
    return (
      <main>
        <div className="loader-container">
          <div className="loader"></div>
          <h1>Loading...</h1>
        </div>
      </main>
    );
  }

  if (error || !report) {
    return (
      <main>
        <div className="error-container" style={{ textAlign: "center", padding: "2rem" }}>
          <h1>Error</h1>
          <p>{error || "Interview report not found"}</p>
          <button onClick={() => navigate("/")} style={{ marginTop: "1rem", padding: "0.5rem 1rem", cursor: "pointer" }}>
            Go Back Home
          </button>
        </div>
      </main>
    );
  }

  const currentQuestions =
    activeTab === "technical"
      ? report.technicalQuestions
      : report.behavioralQuestions;

  const getSeverityClass = (severity) => {
    switch (severity) {
      case "high":
        return "severity-high";

      case "medium":
        return "severity-medium";

      case "low":
        return "severity-low";

      default:
        return "";
    }
  };

  return (
    <main className="interview-page">
      <div className="interview-layout">
        {/* LEFT SIDEBAR */}

        <aside className="left-sidebar">
          <div className="sidebar-card">
            <h3 className="sidebar-heading">SECTIONS</h3>

            <div className="sidebar-nav">
              <button
                className={`nav-item ${
                  activeTab === "technical" ? "active" : ""
                }`}
                onClick={() => setActiveTab("technical")}
              >
                Technical Questions
              </button>

              <button
                className={`nav-item ${
                  activeTab === "behavioral" ? "active" : ""
                }`}
                onClick={() => setActiveTab("behavioral")}
              >
                Behavioral Questions
              </button>

              <button
                className={`nav-item ${
                  activeTab === "roadmap" ? "active" : ""
                }`}
                onClick={() => setActiveTab("roadmap")}
              >
                Road Map
              </button>
            </div>
          </div>
          <div className="">
            <button
              onClick={() => {
                getResumePdf(interviewId);
              }}
              className="button primary-button"
            >
              Download AI generated Resume 🤖
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}

        <section className="interview-main">
          <div className="content-top">
            <h1>
              {activeTab === "technical"
                ? "Technical Questions"
                : activeTab === "behavioral"
                  ? "Behavioral Questions"
                  : "Preparation Roadmap"}
            </h1>

            {activeTab !== "roadmap" && (
              <span className="question-count">
                {currentQuestions.length} questions
              </span>
            )}
          </div>

          {activeTab !== "roadmap" ? (
            <div className="questions-container">
              {currentQuestions.map((q, index) => (
                <div className="question-card" key={index}>
                  <div
                    className="question-header"
                    onClick={() =>
                      setOpenQuestion(openQuestion === index ? null : index)
                    }
                  >
                    <div className="question-left">
                      <span className="question-number">Q{index + 1}</span>

                      <h3 className="question-text">{q.question}</h3>
                    </div>

                    <span className="expand-icon">
                      {openQuestion === index ? "−" : "+"}
                    </span>
                  </div>

                  {openQuestion === index && (
                    <div className="question-body">
                      <div className="detail-section">
                        <h4>INTENTION</h4>
                        <p>{q.intention}</p>
                      </div>

                      <div className="detail-section">
                        <h4>HOW TO ANSWER</h4>
                        <p>{q.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="roadmap-container">
              {report.preparationPlan.map((item) => (
                <div className="roadmap-card" key={item.day}>
                  <div className="roadmap-header">
                    <span>DAY {item.day}</span>

                    <h3>{item.focus}</h3>
                  </div>

                  <ul>
                    {item.tasks.map((task, idx) => (
                      <li key={idx}>{task}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* RIGHT SIDEBAR */}

        <aside className="right-sidebar">
          <div className="match-card">
            <h3>MATCH SCORE</h3>

            <div className="score-circle">
              <span className="score-number">{report.matchScore}</span>

              <span className="score-percent">%</span>
            </div>

            <p className="score-text">Strong match for this role</p>
          </div>

          <div className="skill-card">
            <h3>SKILL GAPS</h3>

            <div className="skills-list">
              {report.skillGaps.map((gap, index) => (
                <div
                  key={index}
                  className={`skill-pill ${getSeverityClass(gap.severity)}`}
                >
                  {gap.skill}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Interview;
