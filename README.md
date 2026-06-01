<div align="center">
  <h1>SensAI 🧠</h1>
  <p>An AI-powered technical skill evaluation and coaching platform.</p>
</div>

## 🚀 Overview

SensAI is a modern, full-stack application designed to analyze developers' technical skills, track knowledge retention, and provide actionable, AI-driven coaching. By integrating with GitHub and utilizing the Google Gemini API, SensAI offers dynamic skill decay tracking and generates tailored coding challenges to help engineers stay sharp.

## ✨ Key Features

- **🧠 AI Coaching Engine**: Powered by Google Gemini, generates highly relevant, hands-on micro-projects targeting specific technologies.
- **📊 Skill Decay Tracking**: A proprietary algorithm that monitors technical knowledge retention over time based on project activity.
- **🔍 GitHub Integration**: Seamlessly connects to GitHub to scan repositories, analyze code complexity, and extract genuine skill evidence.
- **🎯 Role Matchmaker**: Matches your dynamic skill profile against real-world roles and generates STAR-format resume bullets.
- **🎨 Modern UI/UX**: Built with React, Tailwind CSS, and Framer Motion for a sleek, responsive, and dynamic dashboard experience.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion, Recharts
- **Backend**: Node.js, Express (Vercel Serverless Functions)
- **AI Integration**: Google Gemini API (`@google/genai`)
- **Authentication**: Supabase
- **Deployment**: Vercel

## 💻 Running Locally

### Prerequisites
- Node.js (v18+)
- A GitHub Access Token (Classic)
- Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/maheshprasad7/sensAI-2.git
   cd sensAI-2
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add your keys:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   GITHUB_TOKEN=your_github_access_token_here
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The application will run locally with Vite serving the frontend and Express handling the API routes.

## ☁️ Deployment (Vercel)

This project is configured to deploy seamlessly on Vercel using Serverless Functions for the backend API.

1. Connect your repository to Vercel.
2. In the Vercel dashboard, go to Settings > Environment Variables and add your keys (`GEMINI_API_KEY`, `GITHUB_TOKEN`, etc.).
3. Deploy! Vercel will automatically use the `vercel.json` configuration to serve the React frontend and route `/api/*` requests to the serverless backend.
