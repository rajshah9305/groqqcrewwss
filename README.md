# Groq + CrewAI Full-Stack Platform

A production-ready, full-stack AI platform powered by **Groq's fast inference API** and **CrewAI's multi-agent orchestration**. This platform is designed for advanced Natural Language Processing tasks with real-time streaming and a modern React-based interface.

## 🚀 Features

### Core Capabilities
- **Text Summarization**: Condense lengthy documents into clear, concise summaries
- **Data Analysis**: Extract insights and identify patterns from complex data
- **Research & Analysis**: Comprehensive research with multi-agent collaboration
- **Content Generation**: Create engaging, well-structured content
- **Code Generation**: Generate clean, production-ready code with best practices
- **Translation**: Accurate translations preserving context and tone

### Technical Highlights
- **Real-Time Streaming**: Live progress updates during task execution via Groq API
- **Multi-Agent Processing**: CrewAI-powered collaborative AI agents
- **Type-Safe API**: Full-stack TypeScript with tRPC for end-to-end type safety
- **Modern UI**: Beautiful, responsive interface built with React 19 and Tailwind CSS
- **PostgreSQL Database**: Robust data persistence with Drizzle ORM

## 🛠 Tech Stack

### Backend
- **Node.js** with **Express** - Server runtime and framework
- **tRPC** - Type-safe API layer
- **Python 3.11+** - CrewAI agent orchestration
- **Groq SDK** - Fast LLM inference
- **Drizzle ORM** - Type-safe database queries
- **PostgreSQL/Neon** - Production database

### Frontend
- **React 19** with **TypeScript** - Modern UI framework
- **Tailwind CSS 4** - Utility-first styling
- **shadcn/ui** - High-quality component library
- **Wouter** - Lightweight routing
- **TanStack Query** - Powerful data synchronization
- **tRPC React** - Type-safe API client

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 22.x or higher
- **Python** 3.11 or higher
- **pnpm** package manager
- **PostgreSQL** database (or use [Neon](https://neon.tech/) for serverless PostgreSQL)
- **Groq API Key** ([Get from Groq Console](https://console.groq.com/keys))

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd groqqcrewwss
```

### 2. Install Dependencies

```bash
# Install Node.js dependencies
pnpm install

# Set up Python virtual environment
python3.11 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
# Groq API Configuration
GROQ_API_KEY=your_groq_api_key_here

# Database Configuration (PostgreSQL/Neon)
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

# Server Configuration
NODE_ENV=development
PORT=3000
```

**Note:** Get your Groq API key from the [Groq Console](https://console.groq.com/keys) and your PostgreSQL connection string from your database provider (e.g., [Neon](https://neon.tech/))

### 4. Set Up Database

```bash
# Push database schema to your PostgreSQL database
pnpm db:push
```

This will create all necessary tables in your database.

### 5. Start the Development Server

```bash
# Make sure your Python virtual environment is activated
source venv/bin/activate  # On macOS/Linux
# or
venv\Scripts\activate  # On Windows

# Start the development server
pnpm dev
```

The application will be available at `http://localhost:3000`

## 🏗 Project Structure

```
groqqcrewwss/
├── api/                    # Vercel serverless functions
│   └── trpc/              # tRPC API endpoint
├── client/                # Frontend React application
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable UI components
│   │   ├── lib/           # Utilities and tRPC client
│   │   └── App.tsx        # Main application component
│   └── public/            # Static assets
├── server/                # Backend Node.js application
│   ├── _core/             # Core server infrastructure
│   ├── db.ts              # Database operations
│   ├── routers.ts         # tRPC routers
│   ├── groq.ts            # Groq API integration
│   ├── crewai.ts          # CrewAI Node.js wrapper
│   └── crewai_service.py  # Python CrewAI service
├── drizzle/               # Database schema and migrations
│   └── schema.ts          # Database table definitions
└── shared/                # Shared types and constants
```

## 🔧 Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm check` - Type check without emitting files
- `pnpm format` - Format code with Prettier
- `pnpm test` - Run test suite (requires environment variables)
- `pnpm db:push` - Push database schema changes
- `pnpm db:generate` - Generate migration files
- `pnpm db:migrate` - Run database migrations

## 🚢 Deployment

This project is configured for Vercel deployment. Refer to the Vercel documentation for detailed setup, including setting environment variables for `DATABASE_URL` and `GROQ_API_KEY`.

---

**Groq + CrewAI Platform** - Built with ❤️ using modern web technologies.
