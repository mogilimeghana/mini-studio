# ✨ Mini Studio – AI-Powered Product Image Generator

Mini Studio is an AI-powered product image generation platform that transforms ordinary product photos into professional marketing visuals using Artificial Intelligence.

Users can upload a product reference image, provide product details, and generate visually appealing product images.

🌐 **Live Demo:** https://mini-content-engine-frontend.onrender.com/

## 🚀 Features

- **AI Image Generation:** Generate professional product visuals using Pollinations AI.
- **AI Prompt Enhancement:** Improve product descriptions and prompts using Groq AI.
- **Image Upload:** Upload product reference images.
- **Live Preview:** View generated images directly in the application.
- **Download Images:** Download generated product visuals.
- **Generation History:** View previous image generation jobs.
- **Job Status Tracking:** Track processing, completed, and failed jobs.
- **Database Integration:** Store generation history using MySQL.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend |
| Vite | Frontend development |
| CSS | Styling and UI |
| Node.js | Backend runtime |
| Express.js | Backend framework |
| MySQL | Database |
| Groq API | AI prompt enhancement |
| Pollinations AI | Image generation |
| Axios | API communication |
| Render | Deployment |

## ⚙️ How It Works

1. Enter the product name and description.
2. Upload a reference product image.
3. Click **Generate with AI**.
4. Groq AI helps enhance the product prompt.
5. Pollinations AI generates the product visual.
6. The backend stores the generation job and its status in MySQL.
7. View, download, and access previously generated images.

## 📁 Project Structure

```text
mini-studio/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── ...
│   ├── package.json
│   └── ...
│
└── README.md
```

## 💻 Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/mogilimeghana/mini-studio.git
cd mini-studio
```

### 2. Setup the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder and configure:

```env
PORT=5000
DB_HOST=your_database_host
DB_PORT=your_database_port
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
GROQ_API_KEY=your_groq_api_key
POLLINATIONS_API_KEY=your_pollinations_secret_key
```

Start the backend:

```bash
npm run dev
```

### 3. Setup the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL provided by Vite in your browser.

## 🔐 Environment Variables

Keep API keys and database credentials private.

Never commit your `.env` file to GitHub.

## 🌍 Deployment

- **Frontend:** Render
- **Backend:** Render
- **Database:** Aiven MySQL

## 👩‍💻 Author

**Meghana Mogili**

GitHub: https://github.com/mogilimeghana

---

⭐ If you find this project interesting, consider giving the repository a star!
