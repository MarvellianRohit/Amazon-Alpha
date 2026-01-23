# Amazon-Alpha

A multi-vendor e-commerce platform built for the agentic future.

## Tech Stack
- **Frontend**: Next.js 15 (App Router), Tailwind CSS, Shadcn/UI
- **Backend / API**: FastAPI (Python), Pydantic
- **Database / Auth**: Supabase (PostgreSQL, GoTrue)
- **Smart Contracts**: Solidity (Polygon/Ethereum)

## Structure
- `apps/web`: Next.js Frontend Application
- `apps/api`: FastAPI Backend Service
- `apps/smart_contracts`: Blockchain interactions and contracts
- `supabase`: Supabase configuration and cloud function definitions
- `docker`: Docker configuration files

## 🌌 High-Fidelity Alpha Features

This prototype includes experimental, high-end features designed to wow:

- **🔬 Alpha Holodeck**: A 3D product inspection laboratory powered by Three.js. Teleport any item into the "Holodeck" for a 360-degree interactive scan with sci-fi HUD overlays.
- **📱 Web Device Simulator**: A built-in testing environment at `/simulator` with high-fidelity frames for iPhone 15 Pro, Pixel 8, and Samsung Tab S11 Ultra.
- **⭕ Circle-to-Search**: Enter "Visual Intelligence" mode from the Navbar to draw selection circles on any product for instant Store/Google recognition.
- **✨ Immersive UI**: Experience 3D mouse-parallax heroes, scroll-reveal grids, magnetic buttons, and a global cursor follower.
- **🤖 Jarvis Mode**: Advanced voice command integration with live canvas audio visualization and context-aware responses.
- **🎉 Delta-Checkout**: A high-friction success flow featuring "Alpha-Cloud" processing simulations and celebratory confetti explosions.

## Prerequisites
- Node.js 18+
- Python 3.10+
- Docker & Docker Compose
- Supabase CLI (optional, for local development interactions)

## Getting Started

### 1. Environment Setup
Copy the example environment file and update it with your credentials:
```bash
cp .env.example .env
```
> [!IMPORTANT]
> Ensure you update `JWT_SECRET`, `SERVICE_ROLE_KEY`, and other critical secrets in `.env` before deploying.

### 2. Run with Docker Compose
To start the entire stack (Database, API, etc.):
```bash
docker-compose up -d
```

### 3. Manual Development

#### Web (Frontend)
```bash
cd apps/web
npm install
npm run dev
# Runs on http://localhost:3000
```

#### API (Backend)
```bash
cd apps/api
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
# Runs on http://localhost:8000
```

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
[MIT](LICENSE)
