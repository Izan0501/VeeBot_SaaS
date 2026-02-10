🛠️ Tech Stack
Frontend
Framework: React 18 (Vite)

Styling: Tailwind CSS + Framer Motion (Animations)

State Management: React Hooks

HTTP Client: Axios / Fetch

Backend
Framework: FastAPI (Python 3.9+)

Database: MongoDB Atlas (Metadata & User Data)

Vector Database: Pinecone (Serverless)

LLM: Groq API (Llama-3.3-70b-versatile)

Embeddings: sentence-transformers/all-MiniLM-L6-v2 (Runs locally, Free)

Infrastructure
Containerization: Docker & Docker Compose

Storage: Local / Ephemeral (Easy to swap for S3)
<!-- -------------------------------------------- -->

🚀 Quick Start (Local Development)
Prerequisites:
Docker & Docker Compose (Recommended)
OR Node.js 18+ and Python 3.9+

Option A: Running with Docker (Recommended) 🐳
This is the fastest way to test the application.

Clone the repository:

git clone https://github.com/your-username/veebot-saas.git
cd veebot-saas
Configure Environment Variables: Create a .env file in the server/ directory (see Configuration below).

Run with Docker Compose:

docker-compose up --build

Frontend: http://localhost:5173

Backend: http://localhost:8000

Docs: http://localhost:8000/docs

Option B: Manual Installation
1. Backend Setup
Bash
cd server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
2. Frontend Setup
Bash
cd client
npm install
npm run dev
<!-- ------------------------------------------------------- -->

⚙️ Configuration
Create a file named .env inside the server/ folder.

Crucial: Ensure your Pinecone index dimension matches the embedding model.

If using sentence-transformers (Default): Dimension 384.

If using OpenAI: Dimension 1536.

# --- SERVER SETTINGS ---
PORT=8000
ENVIRONMENT=development

# --- DATABASE (MongoDB Atlas) ---
# Create a free cluster at mongodb.com
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
DB_NAME=veebot-db

# --- VECTOR DATABASE (Pinecone) ---
# Create a free serverless index (Dimension: 384, Metric: Cosine)
PINECONE_API_KEY=pcsk_xxxx_xxxx
PINECONE_INDEX_NAME=veebot-index
# Host is optional, the app auto-discovers it, but you can force it:
# PINECONE_HOST=https://veebot-index-xxxx.svc.us-east-1.pinecone.io

# --- AI & LLM (Groq) ---
# Get a free key at console.groq.com
GROQ_API_KEY=gsk_xxxx_xxxx

# --- SECURITY ---
# Generate a random string: openssl rand -hex 32
JWT_SECRET=super_secret_jwt_key_change_this
ACCESS_TOKEN_EXPIRE_MINUTES=1440
<!-- ---------------------------------------- -->

🏗️ Project Structure

veebot-saas/
├── 🐳 docker-compose.yml          # Orchestration for App, DB, and Vector services
├── 📄 README.md                   # Main documentation
│
├── 💻 client/                     # Frontend (React + Vite + Tailwind CSS)
│   ├── Dockerfile
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   ├── index.html
│   ├── postcss.config.js
│   └── src/
│       ├── 🌐 api/                # Network Layer (Modular Fetch Wrappers)
│       │   ├── auth.js            # Authentication, Profile & Registration 
│       │   ├── candidates.js      # Candidate CRUD & Multi-part Upload
│       │   ├── communications.js  # Email Template management
│       │   ├── config.js          # API Client configuration & Request Interceptors
│       │   ├── features.js        # AI Chat, Comparison & Analytics endpoints
│       │   └── payments.js        # Lemon Squeezy Checkout & Portal integration
│       │
│       ├── 🧩 components/         # Modular UI Feature Components
│       │   ├── analytics/         # Data visualization, Charts & KPIs
│       │   ├── auth/              # Login/Register UI & Auth Visuals
│       │   ├── common/            # Reusable Atomic UI (Buttons, Badges, Inputs)
│       │   ├── comparator/        # Versus AI logic & Comparison UI
│       │   ├── contact/           # Support forms & Contact visuals
│       │   ├── dashboard/         # Tables, Search filters & Chat widgets
│       │   ├── digital-twin/      # Neural simulation & Chat interface
│       │   ├── emails/            # Template editors & variable management
│       │   ├── export/            # Data formatting & Export cards
│       │   ├── faq/               # Knowledge base accordions
│       │   ├── landing/           # Landing page sections (Hero, Features, Pricing)
│       │   ├── privacy/           # Legal & privacy policy modules
│       │   ├── terms/             # Terms of service modules
│       │   ├── upgrade/           # Subscription tables & Trust badges
│       │   ├── Footer.jsx         # Global Footer
│       │   ├── Navbar.jsx         # Navigation system
│       │   ├── Sidebar.jsx        # Dashboard Sidebar
│       │   └── UploadModal.jsx    # Global File Ingestion Modal
│       │
│       ├── ⚡ context/            # Global State Management
│       │   ├── AuthContext.jsx    # User Session & RBAC (Role-Based Access Control)
│       │   └── ThemeContext.jsx   # Dark/Light Mode orchestration
│       │
│       ├── 📐 layouts/            # Page Structural Wrappers
│       │   ├── ProtectedLayout.jsx # Authenticated view wrapper (Sidebar + Logic)
│       │   └── SimpleLayout.jsx    # Public view wrapper (Navbar + Footer)
│       │
│       ├── 🚀 pages/              # View Orchestrators (Routes)
│       │   ├── Analytics.jsx      # Performance & Quality metrics
│       │   ├── Comparator.jsx     # AI Versus 1vs1 comparison
│       │   ├── Dashboard.jsx      # Talent management hub
│       │   ├── DataExport.jsx     # Database backup & Export system
│       │   ├── DigitalTwin.jsx    # LLM-powered candidate simulation
│       │   ├── EmailTemplates.jsx # Communication automation hub
│       │   ├── Login.jsx          # User authentication entry
│       │   └── Upgrade.jsx        # Subscription & Billing management
│       │
│       └── 🛠 utils/              # Pure Helper Functions
│           ├── analyticsUtils.js  # Statistical & Data-parsing logic
│           └── exportUtils.js     # Blob, CSV & JSON generation logic
│
└── 🖥️ server/                     # Backend (FastAPI + Python 3.10+)
    ├── Dockerfile
    ├── main.py                    # Entry point & Middleware orchestration
    ├── requirements.txt           # Dependency management
    │
    ├── 🛣️ routes/                 # API Routing Layer
    │   ├── auth.py                # JWT handling & User Lifecycle
    │   ├── candidates.py          # PDF Ingestion, Parsing & Metadata
    │   ├── chat.py                # RAG (Retrieval-Augmented Generation) Pipeline
    │   ├── communications.py      # Template persistence logic
    │   ├── email.py               # SMTP dispatching endpoints
    │   └── payments.py            # Webhook handling & Subscription logic
    │
    ├── 🧠 services/               # Core Business & AI Logic
    │   ├── ai_service.py          # Llama 3.3 Prompt Engineering & Inference
    │   ├── pdf_service.py         # OCR & Semantic Text Extraction
    │   ├── pinecone_service.py    # Vector Embeddings & Similarity Search
    │   └── email_service.py       # SMTP & Personalization Engine
    │
    ├── 🗄️ database.py             # MongoDB ODM & Connection pooling
    ├── 🔒 security.py             # Cryptography & Token validation
    ├── ⚙️ config.py               # Environment & Global settings
    ├── 📥 uploads/                # Temporary secure file storage
    └── 📜 init_db.py              # Database & Index initialization scripts
<!-- ---------------------------------------------- -->

🛡️ Database Management & Sync
This system implements a Dual-Sync Deletion Protocol. When a candidate or user is deleted via the Dashboard:

Vector Deletion: The system first removes the vector embeddings from Pinecone using the unique ID.

Metadata Deletion: Once confirmed, the document is removed from MongoDB.

File Cleanup: The PDF is removed from local storage.

Auto-Cleanup Scheduler: A background job runs every 24h to remove candidates older than 30 days to keep the free-tier databases clean and performant.
<!-- ------------------------------------------------------- -->

📦 Deployment Guide
Deploying to Render.com (Easiest)
Fork this repo to your GitHub.

Create a New Web Service on Render.

Select "Docker" as the runtime.

Add your Environment Variables in the Render Dashboard.

Render will auto-build the Docker image and deploy.

Database Initialization
Upon first deployment, or if you want to reset the infrastructure, you can run the initialization script inside the server container: python init_db.py
<!-- ----------------------------------------------------- -->

