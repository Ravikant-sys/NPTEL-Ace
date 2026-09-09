import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useScoreHistory } from '../hooks/useScoreHistory';
import cloudData from '../data/cloud.json';
import blockchainData from '../data/blockchain.json';
import iotData from '../data/iot.json';
import entrepreneurshipData from '../data/entrepreneurship.json';

const COURSES = [
  {
    id: 'cloud',
    name: 'Cloud Computing',
    desc: 'Distributed Systems, Virtualization & Azure/GCP',
    icon: '☁️',
    data: cloudData,
  },
  {
    id: 'blockchain',
    name: 'Blockchain & Applications',
    desc: 'Cryptography, Consensus & Cryptocurrency',
    icon: '⛓️',
    data: blockchainData,
  },
  {
    id: 'iot',
    name: 'Introduction to IoT',
    desc: 'Sensors, Actuators, Wireless Networks & IoT Protocols',
    icon: '📡',
    data: iotData,
  },
  {
    id: 'entrepreneurship',
    name: 'Entrepreneurship',
    desc: 'Ideation, Prototyping, Disruption & Business Strategies',
    icon: '🚀',
    data: entrepreneurshipData,
  },
];

export default function HomePage() {
  const { setCourseTheme } = useTheme();
  const { getBest } = useScoreHistory();
  const [selectedCourse, setSelectedCourse] = useState(() => {
    return localStorage.getItem('selectedCourse') || null;
  });

  useEffect(() => {
    setCourseTheme(selectedCourse);
    if (selectedCourse) {
      localStorage.setItem('selectedCourse', selectedCourse);
    } else {
      localStorage.removeItem('selectedCourse');
    }
  }, [selectedCourse, setCourseTheme]);

  const activeCourseObj = COURSES.find(c => c.id === selectedCourse);

  const handleSelectCourse = (courseId) => {
    setSelectedCourse(courseId);
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
  };

  return (
    <main className="main-content">
      {!selectedCourse ? (
        <div id="view-courses">
          <div className="hero-section">
            <img src="/logo.jpg" alt="NPTEL Ace Mascot" className="hero-mascot" />
            <h1 className="hero-title">
              NPTEL <span className="highlight">Ace</span>
            </h1>
            <p className="hero-subtitle">Pick a course to start practicing</p>
          </div>

          <div className="course-grid">
            {COURSES.map(course => {
              const weekKeys = Object.keys(course.data);
              const weeksCount = weekKeys.length;
              const questionsCount = weekKeys.reduce(
                (acc, w) => acc + (course.data[w]?.length || 0),
                0
              );

              return (
                <div
                  key={course.id}
                  className="course-card"
                  id={`card-${course.id}`}
                  onClick={() => handleSelectCourse(course.id)}
                >
                  <div className="course-icon">{course.icon}</div>
                  <div className="course-info">
                    <h3>{course.name}</h3>
                    <p>{course.desc}</p>
                    <div className="course-stats">
                      <span className="course-stat">📅 {weeksCount} weeks</span>
                      <span className="course-stat">❓ {questionsCount} questions</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div id="view-dashboard" className="view-transition">
          <div className="dashboard-header">
            <h2 className="dashboard-title">{activeCourseObj?.name}</h2>
            <button className="back-to-courses" onClick={handleBackToCourses}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Courses
            </button>
          </div>

          <div className="dashboard-grid">
            {activeCourseObj &&
              Object.keys(activeCourseObj.data)
                .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                .map(week => {
                  const best = getBest(selectedCourse, week);
                  return (
                    <Link
                      key={week}
                      to={`/quiz/${selectedCourse}/${week}`}
                      className="week-card"
                    >
                      <span className="week-number">{week}</span>
                      <span className="week-label">Week</span>
                      {best && (
                        <span className="week-score-badge">
                          Best: {best.score}/{best.total}
                        </span>
                      )}
                    </Link>
                  );
                })}

            {/* Grand Test Card */}
            {activeCourseObj && (
              <Link
                to={`/quiz/${selectedCourse}/grand`}
                className="week-card grand-test-card"
              >
                <span className="week-number">🏆</span>
                <span className="week-label">Grand Test — All Weeks</span>
                {(() => {
                  const grandBest = getBest(selectedCourse, 'grand');
                  return grandBest ? (
                    <span className="week-score-badge">
                      Best: {grandBest.score}/{grandBest.total}
                    </span>
                  ) : null;
                })()}
              </Link>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
