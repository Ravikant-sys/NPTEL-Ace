import React, { useState, useEffect } from 'react';

export default function FeedbackSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [course, setCourse] = useState('general');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success'
  const [saveLocation, setSaveLocation] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setStatus('submitting');
    const feedbackItem = {
      course,
      rating,
      name: name.trim() || 'Anonymous Student',
      message: message.trim(),
      date: new Date().toLocaleString(),
      timestamp: new Date().toISOString(),
    };

    let savedOnDisk = false;

    // 1. Try to post to local Vite API (stores directly in feedback.json on PC)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackItem),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          savedOnDisk = true;
        }
      }
    } catch {
      savedOnDisk = false;
    }

    // 2. Always back up in localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('nptel_feedbacks') || '[]');
      existing.push(feedbackItem);
      localStorage.setItem('nptel_feedbacks', JSON.stringify(existing));
    } catch {
      // ignore localStorage errors
    }

    if (savedOnDisk) {
      setSaveLocation('Saved directly inside the feedback/ folder on your PC! 💻');
    } else {
      setSaveLocation('Saved to your browser storage! (Click below to export to PC) 💾');
    }

    setStatus('success');
    setMessage('');
    setName('');
  };

  const handleDownloadAll = () => {
    const localFeedbacks = JSON.parse(localStorage.getItem('nptel_feedbacks') || '[]');
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(localFeedbacks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `nptel_feedback_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <>
      {/* Small Floating Feedback Trigger Button on Main Page */}
      <button
        type="button"
        id="feedback-trigger-btn"
        className="feedback-floating-btn"
        onClick={() => {
          setIsOpen(true);
          setStatus('idle');
        }}
        aria-label="Open Feedback Form"
        title="Give Feedback & Suggestions"
      >
        <span className="feedback-btn-icon">💬</span>
        <span className="feedback-btn-label">Feedback</span>
      </button>

      {/* Inline Subtle Link on Homepage below courses */}
      <div className="feedback-inline-bar">
        <span>Have feedback or noticed a typo?</span>
        <button
          type="button"
          className="feedback-inline-trigger"
          onClick={() => {
            setIsOpen(true);
            setStatus('idle');
          }}
        >
          💬 Give Feedback
        </button>
      </div>

      {/* Modal Backdrop and Popup Form */}
      {isOpen && (
        <div
          className="feedback-modal-backdrop"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="feedback-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="feedback-modal-header">
              <div className="feedback-header-left">
                <span className="feedback-modal-badge">💬 Feedback & Suggestions</span>
                <h3 className="feedback-modal-title">Help Us Improve NPTEL Ace</h3>
              </div>
              <button
                type="button"
                className="feedback-modal-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close Feedback Form"
              >
                ✕
              </button>
            </div>

            {status === 'success' ? (
              <div className="feedback-success-state">
                <div className="feedback-success-icon">🎉</div>
                <h4>Thank you for your feedback!</h4>
                <p className="feedback-save-badge">{saveLocation}</p>
                <div className="feedback-success-actions">
                  <button
                    type="button"
                    className="feedback-btn-secondary"
                    onClick={() => setStatus('idle')}
                  >
                    Send Another
                  </button>
                  <button
                    type="button"
                    className="feedback-btn-download"
                    onClick={handleDownloadAll}
                    title="Download all stored feedback as a JSON file to your PC"
                  >
                    💾 Export All to PC (.json)
                  </button>
                  <button
                    type="button"
                    className="feedback-btn-secondary"
                    onClick={() => setIsOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="feedback-form">
                <p className="feedback-card-sub">
                  Found a question typo, wrong solution, or have a feature idea? It saves right to the feedback/ folder on your PC!
                </p>

                <div className="feedback-row">
                  <div className="feedback-field">
                    <label htmlFor="fb-course">Course / Category</label>
                    <select
                      id="fb-course"
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      className="feedback-select"
                    >
                      <option value="general">🌐 General / Website</option>
                      <option value="cloud">☁️ Cloud Computing</option>
                      <option value="iot">📡 Introduction to IoT</option>
                      <option value="blockchain">⛓️ Blockchain & Applications</option>
                      <option value="entrepreneurship">🚀 Entrepreneurship</option>
                    </select>
                  </div>

                  <div className="feedback-field">
                    <label>Rating</label>
                    <div className="feedback-stars" role="radiogroup" aria-label="Rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={`star-btn ${star <= (hoverRating || rating) ? 'active' : ''}`}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          aria-label={`${star} star`}
                        >
                          ★
                        </button>
                      ))}
                      <span className="star-text">
                        {rating === 5 && '😍 Loved it!'}
                        {rating === 4 && '😊 Great'}
                        {rating === 3 && '🙂 Good'}
                        {rating === 2 && '😐 Needs work'}
                        {rating === 1 && '🙁 Needs fix'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="feedback-field">
                  <label htmlFor="fb-name">Your Name / Roll No. (Optional)</label>
                  <input
                    id="fb-name"
                    type="text"
                    placeholder="e.g. Rahul / Anonymous"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="feedback-input"
                    maxLength={60}
                  />
                </div>

                <div className="feedback-field">
                  <label htmlFor="fb-message">
                    Your Feedback / Suggestion <span className="required">*</span>
                  </label>
                  <textarea
                    id="fb-message"
                    rows={3}
                    placeholder="e.g. In IoT Week 7 Question 4, option B has a small typo... or Please add Week 9!"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="feedback-textarea"
                    required
                    maxLength={800}
                  />
                </div>

                <div className="feedback-actions">
                  <button
                    type="submit"
                    className="feedback-submit-btn"
                    disabled={status === 'submitting' || !message.trim()}
                  >
                    {status === 'submitting' ? (
                      <>
                        <span className="fb-spinner"></span> Saving...
                      </>
                    ) : (
                      <>🚀 Submit Feedback</>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
