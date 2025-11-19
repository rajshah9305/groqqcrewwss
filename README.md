# RAJAI PLATFORM

A production-ready, full-stack AI platform powered by Groq's fast inference API. This platform enables advanced Natural Language Processing tasks with real-time streaming, multi-agent collaboration via CrewAI, and a modern React-based interface.

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
- **Production Ready**: No mockups, no auth required, fully functional code

## 🛠 Tech Stack

### Backend
- **Node.js** with **Express** - Server runtime and framework
- **tRPC** - Type-safe API layer
- **Python 3.11+** - CrewAI agent orchestration
- **Groq SDK** - Fast LLM inference (using `openai/gpt-oss-120b` model)
- **Drizzle ORM** - Type-safe database queries
- **PostgreSQL/Neon** - Production database

### Frontend
- **React 19** with **TypeScript** - Modern UI framework
- **Tailwind CSS 4** - Utility-first styling
- **shadcn/ui** - High-quality component library
- **Wouter** - Lightweight routing
- **TanStack Query** - Powerful data synchronization
- **tRPC React** - Type-safe API client

### AI & NLP
- **Groq API** - Ultra-fast LLM inference
- **CrewAI** - Multi-agent orchestration framework
- **Multiple Agent Types**: Researcher, Writer, Analyst, Summarizer, Coder, Translator

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 22.x or higher ([Download](https://nodejs.org/))
- **Python** 3.11 or higher ([Download](https://www.python.org/downloads/))
- **pnpm** package manager ([Install](https://pnpm.io/installation))
- **PostgreSQL** database (or use [Neon](https://neon.tech/) for serverless PostgreSQL)
- **Groq API Key** ([Get from Groq Console](https://console.groq.com/keys))

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd rajai-platform
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

# OpenAI API Key (dummy to disable OpenAI usage)
OPENAI_API_KEY=dummy-key-to-disable-openai

# Server Configuration
NODE_ENV=development
PORT=3000
```

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

## 📖 Usage

### Creating an NLP Task

1. Navigate to the **Dashboard** at `http://localhost:3000/dashboard`
2. Fill in the task creation form:
   - **Title**: Descriptive name for your task
   - **Description**: What you want to accomplish
   - **Task Type**: Select from available NLP operations
   - **Input Text**: Paste your content to process
   - **Priority**: Set task priority (low/medium/high)
   - **Temperature**: Adjust creativity (0-100)
   - **Multi-Agent**: Enable collaborative processing
3. Click **Create & Execute** to start processing

### Viewing Results

- Tasks appear in the **All Tasks** tab with real-time status updates
- Click on any task to view detailed results
- Completed tasks show formatted output with markdown support
- Failed tasks display error messages for debugging

## 🏗 Project Structure

```
rajai-platform/
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
├── venv/                  # Python virtual environment (gitignored)
└── shared/                # Shared types and constants
```

## 🔧 Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm check` - Type check without emitting files
- `pnpm format` - Format code with Prettier
- `pnpm test` - Run test suite
- `pnpm db:push` - Push database schema changes
- `pnpm db:generate` - Generate migration files
- `pnpm db:migrate` - Run database migrations

## 🌐 API Reference

### tRPC Endpoints

#### NLP Operations
- `nlp.createTask` - Create a new NLP task
- `nlp.executeTask` - Execute task with CrewAI
- `nlp.streamTask` - Stream task execution with Groq
- `nlp.getTasks` - Retrieve user's tasks
- `nlp.getTask` - Get specific task details
- `nlp.deleteTask` - Delete a task
- `nlp.getTaskLogs` - View task execution logs

#### Agent Management
- `agents.createConfig` - Create agent configuration
- `agents.getUserConfigs` - Get user's configurations
- `agents.getPublicConfigs` - Browse public configurations
- `agents.incrementUsage` - Track configuration usage

#### User Preferences
- `preferences.get` - Retrieve user preferences
- `preferences.update` - Update preferences

#### Results Management
- `results.save` - Save task result
- `results.getUserResults` - Get saved results

## 🚢 Deployment

### Production Build

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

### Environment Configuration

Ensure all production environment variables are set:
- `DATABASE_URL` - PostgreSQL connection string
- `GROQ_API_KEY` - Your Groq API key
- `NODE_ENV=production` - Production mode
- `PORT` - Server port (optional, defaults to 3000)

### Database Migration

```bash
# Push schema changes
pnpm db:push
```

### Deploy to Vercel

This project is configured for Vercel deployment:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

The `vercel.json` file is already configured for optimal deployment.

## 🧪 Testing

Run the complete test suite:

```bash
pnpm test
```

## 🔒 Security

- **No Authentication Required**: This is a demo platform without auth
- **API Key Protection**: All API keys are server-side only
- **Input Validation**: Comprehensive input sanitization with Zod
- **SQL Injection Prevention**: Parameterized queries with Drizzle ORM

## 🐛 Troubleshooting

### Database Connection Issues

If you encounter database connection errors:

1. Verify your `DATABASE_URL` is correct
2. Ensure your database is accessible
3. Check SSL mode requirements (Neon requires `sslmode=require`)

### Python/CrewAI Issues

If CrewAI tasks fail:

1. Ensure Python virtual environment is activated
2. Verify all Python dependencies are installed: `pip install -r requirements.txt`
3. Check that `GROQ_API_KEY` is set in the environment
4. Verify the Python path in `server/crewai.ts` matches your setup

### Groq API Issues

If Groq API calls fail:

1. Verify your `GROQ_API_KEY` is valid
2. Check your Groq API quota/limits
3. Ensure you're using a supported model (`openai/gpt-oss-120b`)

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Groq** for ultra-fast LLM inference
- **CrewAI** for multi-agent orchestration
- **shadcn/ui** for beautiful components
- **tRPC** for type-safe APIs

## 🎨 Design

**RAJAI PLATFORM** uses a clean, modern design with:
- **Orange** for MVPs, highlights, and primary actions
- **Black** text for optimal readability
- **White** background for a clean, professional look

---

**RAJAI PLATFORM** - Built with ❤️ using Groq, CrewAI, and modern web technologies
