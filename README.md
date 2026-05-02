<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://aistudio.google.com/apps/feab5b21-eb49-4930-8b9b-e2550405e94f?showPreview=true&showAssistant=true&fullscreenApplet=true

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
=====================================================================================================================================================
**Project Architecture**
The application is a full-stack web application built with a modern, high-performance stack designed for scalability and seamless deployment.
**Frontend** (React + Vite + Tailwind CSS):
**Framework:** Built with React 18 using Vite for lightning-fast development and optimized production builds.
**Styling:** Uses Tailwind CSS for a utility-first, responsive design.
**Animations:** Powered by Motion (framer-motion) for smooth, hardware-accelerated transitions and interactions.
**State Management:** Utilizes React Hooks (useState, useEffect) for localized state and efficient data fetching.
**Backend** (Express + Node.js):
**Server:** A custom Express server (server.ts) handles API requests, static file serving, and integrates with Vite during development.
**Serverless Compatibility:** Includes an api/index.ts entry point specifically optimized for Vercel Functions, allowing the app to run in a serverless environment.
**API Layer:** Proxies requests to external services (like Google Sheets and Gemini AI) to keep API keys secure on the server side.
**Data Integration:**
**Google Sheets as a CMS:** The app dynamically fetches content (titles, descriptions, categories) from a Google Spreadsheet, making it easy to update content without redeploying code.
**Google Drive Image Hosting:** Images are pulled directly from Google Drive IDs, using optimized thumbnail URLs for faster loading.

**Core Features**
**Dynamic Gallery:** A responsive, category-filtered gallery that displays images and content directly from your Google Sheets data.
**AI Chat Assistant:** An integrated AI bot powered by Gemini 1.5 Flash. It handles real-time conversations via a secure backend proxy to protect your API keys.
**Intelligent Content Parsing:**
**Robust CSV Parsing:** Custom logic to handle complex Spreadsheet data, including quoted text and special characters.
**Metadata Extraction:** Advanced regex-based heuristics to extract file names and IDs from public Google Drive folders.
**Responsive UI/UX:**
**Sidebar Navigation:** A clean, collapsible sidebar for desktop and mobile navigation.
**Dark Mode Support:** Built-in styling for both light and dark themes.
**Staggered Animations:** Visual elements fade and slide into view for a polished, professional feel.
**Performance Optimized:**
**Lazy Loading:** Images use lazy loading and asynchronous decoding to improve initial page load times.
**Image Optimization:** Uses Google’s lh3.googleusercontent.com transformation parameters to serve correctly sized images based on the layout.

**Technical Stack Summary**
**Language:** TypeScript
**Frontend:** React, Tailwind CSS, Lucide-React (Icons), Motion (Animations)
**Backend:** Express + Node Js
**AI:** Google Gemini API
**Deployment:** Optimized for Vercel and Cloud Run architectures.
