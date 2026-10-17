# CinePulse 🎬 — Entertainment News Portal

CinePulse is a modern, high-performance entertainment news portal aggregating real-time dispatches, critical reviews, box office tracking, and platform wire updates across Movies, Web Series, Anime, and K-Drama.

---

## 🌟 Key Features

- **Multi-Category Coverage**: Dedicated feeds and editorial noir sections for Movies, Web Series, Anime, and K-Drama.
- **Automated RSS Pipeline**: Multi-source RSS aggregation with XML parsing, canonical URL deduplication, and scheduler daemon.
- **Smart Image Discovery**: Robust multi-tiered image extraction supporting RSS media enclosures, inline HTML content scraping, and fallback Open Graph / Twitter Card metadata resolution.
- **Editorial Noir UI**: Next.js 14 frontend styled with Tailwind CSS, typography hierarchies, category-specific badges, and responsive layouts.
- **Prisma & SQLite/PostgreSQL**: Type-safe ORM data persistence with indexing on categories and timestamps.
- **Resilient API Layer**: Express backend with security headers, CORS origin verification, API rate limiting, and centralized error handling.

---

## 🏗️ Project Architecture

```
stitch_next.js_entertainment_news_portal/
├── app/                  # Next.js App Router (pages: home, movies, web-series, anime, k-drama, search)
├── components/           # Reusable UI components (ArticleCard, Header, Footer, CategoryHero, etc.)
├── data/                 # Static fallback news data
├── lib/                  # Frontend API client and utilities
├── types/                # Frontend TypeScript interfaces
├── backend/              # Node.js / Express backend service
│   ├── prisma/           # Prisma schema & SQLite database configuration
│   └── src/
│       ├── config/       # Environment and database configuration
│       ├── controllers/  # API route controllers
│       ├── middleware/   # Rate limiting and error handling
│       ├── routes/       # Express news API routes
│       ├── rss/          # Ingestion engine (fetcher, parser, normalizer, imageDiscovery, scheduler)
│       ├── services/     # Business logic & RSS synchronization service
│       └── utils/        # Slugify, logger, readTime calculators
├── .env.example          # Frontend environment template
└── .gitignore            # Git exclusion rules
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Generate Prisma Client & Run Database Migrations
npx prisma db push
# (Optional) Seed initial data:
npx tsx prisma/seed.ts

# Build and start the backend
npm run build
npm start
```
*The backend API will run on `http://localhost:5000`.*

### 3. Frontend Setup

```bash
# Return to root directory
cd ..

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Run the development server
npm run dev
```
*The CinePulse frontend will be available at `http://localhost:3000`.*

---

## 📡 RSS Feeds Integrated

- **Movies**: The Hollywood Reporter, Variety, Collider, Screen Rant, IndieWire, Deadline
- **Web Series**: Collider Television, Screen Rant TV, Variety TV
- **Anime**: Anime Corner, The Anime Daily, Otaku USA Magazine
- **K-Drama**: Soompi, Dramabeans, MyDramaList, Kdrama Kisses

---

## 🔒 Security & Privacy

Local `.env`, `.env.local`, SQLite databases, logs, and `node_modules/` are strictly ignored by `.gitignore`. Never commit API keys or production database credentials to version control.

---

## 📄 License

MIT
