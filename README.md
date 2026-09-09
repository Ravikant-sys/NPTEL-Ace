# 🐻 NPTEL Ace — A Multi-Course NPTEL Practice Platform

[![Live Site](https://img.shields.io/badge/Live%20Site-nptel--cloud--mcq.onrender.com-58cc02?style=for-the-badge&logo=render)](https://nptel-cloud-mcq.onrender.com/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff?style=for-the-badge&logo=vite)](https://vitejs.dev/)

A **Duolingo-inspired multi-course practice platform** for NPTEL courses — practice Cloud Computing, Blockchain, and Internet of Things (IoT) assignments with instant feedback, streak tracking, milestone celebrations, animated mascot videos, and a gamified learning experience.

<p align="center">
  <img src="public/logo.jpg" alt="NPTEL Ace Mascot" width="200" />
</p>

---

## ✨ Features

### 🎮 Duolingo-Style Quiz Flow
- **Single-Question Focus**: One question at a time with smooth animated transitions.
- **Tappable Option Cards**: Clean card design with keyboard & touch support (no tiny radio buttons).
- **Instant Solution Reveal**: Color-coded feedback banner explaining the concepts.
- **Dynamic Progress**: Real-time progress bar with question counter and streak indicator.

### 🔥 Gamification & Delighters
- **Streak Multiplier**: Consecutive correct answers light up the 🔥 streak badge.
- **Milestone Animations**: Full-screen celebration overlays popping up every 3 questions when on a roll.
- **Celebration Video**: Custom mascot completion video played at the end for scores > 50%.
- **Particle Confetti**: Joyful confetti explosions on correct answers and high scores.
- **Score Persistence**: Best scores recorded in local storage and displayed as badges on week dashboards.

### 🎨 Design & Architecture
- **React + Vite Architecture**: Lightning-fast hot reloading, modular component hierarchy, and declarative state machine.
- **Dark & Light Modes**: System-aware and manual theme switching with customized radial gradients.
- **Course-Specific Theming**: Indigo theme for Cloud Computing, Cyber Cyan theme for Blockchain, and Emerald Tech theme for IoT.
- **Responsive Layout**: Designed mobile-first for touch screens, tablets, and desktop browsers.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) |
| **Routing** | [React Router 6](https://reactrouter.com/) |
| **Styling** | Vanilla CSS (CSS variables, keyframe animations, glassmorphism) |
| **Data Format** | Modular JSON datasets (`cloud.json`, `blockchain.json`, `iot.json`) |
| **Deployment** | [Render](https://render.com/) Static Site (`render.yaml`) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Development
```bash
# Clone repository
git clone https://github.com/Ravikant-sys/nptel-cloud-mcq.git
cd nptel-cloud-mcq

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build
```bash
npm run build
```

---

## 📁 Project Structure

```
nptel-cloud-mcq/
├── public/
│   ├── logo.jpg               # Bear mascot logo
│   ├── celebration.mp4        # Mascot celebration animation
│   └── _redirects             # SPA routing fallback for Render / Netlify
├── src/
│   ├── components/
│   │   ├── Header.jsx         # Navigation bar with theme toggle & admin trigger
│   │   ├── Confetti.jsx       # Confetti particle burst effect
│   │   ├── MilestoneOverlay.jsx # Every-3-questions congratulatory overlay
│   │   ├── CelebrationVideo.jsx # Post-quiz video player
│   │   └── AdminToast.jsx     # Easter egg analytics panel
│   ├── data/
│   │   ├── cloud.json         # 12 weeks of Cloud Computing MCQs
│   │   ├── blockchain.json    # 11 weeks of Blockchain MCQs
│   │   └── iot.json           # 5 weeks of Internet of Things MCQs
│   ├── hooks/
│   │   ├── useTheme.jsx       # Dark/Light & Course theme provider
│   │   └── useScoreHistory.js # LocalStorage score storage
│   ├── pages/
│   │   ├── HomePage.jsx       # Course selection & week dashboard
│   │   └── QuizPage.jsx       # Complete Duolingo quiz flow & results
│   ├── utils/
│   │   └── shuffle.js         # Question randomization
│   ├── App.jsx                # Router & Theme Context setup
│   ├── index.css              # Design system & animations
│   └── main.jsx               # Application entry point
├── render.yaml                # Zero-config deployment on Render
└── vite.config.js
```

---

<p align="center">
  Built with ❤️ for NPTEL students everywhere
</p>
