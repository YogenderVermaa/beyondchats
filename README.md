# BeyondChats Assignment – Full Stack + GenAI
 🔗 https://beyondchats-kappa.vercel.app/

This repository contains the complete implementation of the BeyondChats technical assignment, structured as a mono-repository.

The project is divided into three main parts:
1. Backend (Laravel + MySQL/PostgreSQL)
2. Scraper (Node.js + Google Search + GenAI)
3. Frontend (React)

Each part corresponds directly to the phases described in the assignment.

---

## 📁 Repository Structure

BEYONDCHATS/
│
├── backend/ # Laravel backend (Phase 1)
├── scraper/ # Node.js scraper + GenAI rewrite (Phase 2)
├── frontend/ # React frontend (Phase 3)
└── README.md



---

## ✅ Phase 1 – Backend (Laravel)

- Scrapes the **5 oldest articles** from the last pages of https://beyondchats.com/blogs/
- Stores articles in a relational database
- Provides full CRUD APIs for articles

**Tech Stack**
- Laravel
- MySQL (local) / PostgreSQL (production)
- REST APIs

➡️ Details: see `backend/README.md`

---

## 🤖 Phase 2 – Scraper + GenAI

- Fetches latest article from Laravel API
- Searches the article title on Google (real search via SerpAPI)
- Fetches top 2 ranking external articles
- Scrapes competitor content
- Uses **Google Gemini (GenAI)** to rewrite the article
- Publishes updated article back via Laravel API
- Adds reference links at the bottom

**Tech Stack**
- Node.js
- Axios
- Cheerio
- SerpAPI (Google Search)
- Google GenAI (Gemini)

➡️ Details: see `scraper/README.md`

---

## 🎨 Phase 3 – Frontend (React)

- Fetches articles from Laravel APIs
- Displays original and updated articles
- Clean, responsive UI

**Tech Stack**
- React
- Axios
- Vite

➡️ Details: see `frontend/README.md`

---

## 🚀 Running the Project Locally

### Backend
```bash
cd backend
composer install
php artisan migrate
php artisan serve
