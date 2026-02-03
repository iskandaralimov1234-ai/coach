# MCC AI Coach

An MCC-level (Master Certified Coach) AI coaching application built with React, Vite, and DeepSeek AI.

## Features
- **MCC Persona**: The AI is prompted to act as a Master Certified Coach, focusing on active listening and powerful questioning rather than giving advice.
- **DeepSeek Integration**: Uses the `deepseek-chat` model for intelligent, human-like responses.
- **Minimalist Design**: A clean, white-themed UI designed for focus and clarity.
- **Glassmorphism**: Modern UI elements with subtle transparency and blur effects.

## Setup Locally

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your DeepSeek API key:
   ```env
   VITE_DEEPSEEK_API_KEY=your_api_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Deploy to Vercel

1. **Import Project**: Go to [Vercel](https://vercel.com/new), log in, and import this repository from GitHub.
2. **Environment Variables**: passing the **Environment Variables** section is CRITICAL.
   - Add a new variable named: `VITE_DEEPSEEK_API_KEY`
   - Paste your API key as the value.
3. **Deploy**: Click "Deploy". The app will be live in less than a minute.
