import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import { AnalyticsTracker } from './utils/analytics';

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <AnalyticsTracker />
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quiz/:course/:week" element={<QuizPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
