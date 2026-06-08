# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# 🚀 SmartCareer: AI-Powered Career Hub

SmartCareer is a full-stack AI platform designed to optimize resumes, identify skill gaps, and prepare candidates for technical interviews.

## 🛠️ Tech Stack
- **Frontend:** React.js, Tailwind CSS, Lucide Icons, Recharts
- **Backend:** Python (Flask), SQLite3
- **AI Engine:** OpenAI GPT-4o-mini
- **Tools:** PDF.js (Parsing), jsPDF & Dom-to-Image (Reporting)

---

## ⚙️ Installation & Setup

### 1. Clone the Project
```bash
git clone <your-repository-url>
cd smartcareer-app


// frontend setup

# Install dependencies
npm install

# Setup Environment Variables
# Create a .env file in the root and add:
VITE_OPENAI_KEY=your_openai_api_key_here

# Start React
npm run dev


// backend setup
cd backend

# Install Python dependencies
pip install flask flask-cors

# Start the Python server
python app.py