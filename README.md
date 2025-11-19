# rajai platform

A production-ready web application for advanced Natural Language Processing powered by CrewAI multi-agent collaboration and Groq API integration.

## Features

### Core NLP Capabilities
- **Text Summarization**: Condense lengthy documents into clear, concise summaries
- **Data Analysis**: Extract insights and identify patterns from complex data
- **Research & Analysis**: Comprehensive research with multi-agent collaboration
- **Content Generation**: Create engaging, well-structured content
- **Code Generation**: Generate clean, production-ready code with best practices
- **Translation**: Accurate translations preserving context and tone

### Advanced Features
- **Multi-Agent Processing**: Collaborative AI agents working together
- **Real-Time Streaming**: Live progress updates during task execution
- **Task Management**: Complete task history and status tracking
- **Agent Configuration**: Customizable agent templates and settings
- **Result Export**: Save results in multiple formats (JSON, Markdown, Text, PDF)
- **User Preferences**: Personalized settings and configurations

### Technical Highlights
- **Full-Stack TypeScript**: Type-safe development with tRPC
- **Modern UI**: Gradient-based design with Tailwind CSS
- **Database Integration**: MySQL/TiDB with Drizzle ORM
- **Authentication**: Manus OAuth integration
- **Comprehensive Testing**: Full vitest coverage
- **Production-Ready**: Error handling, logging, and monitoring

## Tech Stack

### Backend
- **Node.js** with **Express**
- **tRPC** for type-safe API
- **Python** for CrewAI agent orchestration
- **Groq SDK** for LLM integration
- **Drizzle ORM** for database management
- **MySQL/TiDB** database

### Frontend
- **React 19** with **TypeScript**
- **Tailwind CSS 4** for styling
- **shadcn/ui** component library
- **Wouter** for routing
- **TanStack Query** for data fetching

### AI & NLP
- **CrewAI** for multi-agent workflows
- **Groq API** for fast LLM inference
- **Multiple Agent Types**: Researcher, Writer, Analyst, Summarizer, Coder, Translator

## Project Structure

```
crewai-nlp-platform/
├── client/                 # Frontend React application
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
│   ├── crewai_service.py  # Python CrewAI service
│   └── *.test.ts          # Vitest test files
├── drizzle/               # Database schema and migrations
│   └── schema.ts          # Database table definitions
├── venv/                  # Python virtual environment
└── shared/                # Shared types and constants
```

## Getting Started

### Prerequisites
- **Node.js** 22.x or higher
- **Python** 3.11 or higher
- **pnpm** package manager
- **MySQL** or **TiDB** database
- **Groq API Key** (get from https://console.groq.com/keys)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd crewai-nlp-platform
   ```

2. **Install Node.js dependencies**
   ```bash
   pnpm install
   ```

3. **Set up Python virtual environment**
   ```bash
   python3.11 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install crewai crewai-tools groq
   ```

4. **Configure environment variables**
   
   Create a `.env` file with the following:
   ```env
   # Database
   DATABASE_URL=mysql://user:password@host:port/database
   
   # Groq API
   GROQ_API_KEY=your_groq_api_key_here
   
   # Authentication (provided by platform)
   JWT_SECRET=your_jwt_secret
   OAUTH_SERVER_URL=oauth_server_url
   VITE_APP_ID=app_id
   OWNER_OPEN_ID=owner_open_id
   OWNER_NAME=owner_name
   ```

5. **Run database migrations**
   ```bash
   pnpm db:push
   ```

6. **Start the development server**
   ```bash
   pnpm dev
   ```

The application will be available at `http://localhost:3000`

## Usage

### Creating an NLP Task

1. Navigate to the **Dashboard** after signing in
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

### Agent Configuration

- Create custom agent configurations with specialized prompts
- Set temperature and token limits
- Share configurations publicly or keep them private
- Track usage statistics for each configuration

## API Reference

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

## Testing

Run the complete test suite:

```bash
pnpm test
```

Test coverage includes:
- ✅ NLP task management (CRUD operations)
- ✅ Agent configuration management
- ✅ User preferences
- ✅ Saved results
- ✅ Authentication and authorization
- ✅ Groq API integration
- ✅ Error handling and edge cases

## Deployment

### Production Build

```bash
pnpm build
```

### Environment Configuration

Ensure all production environment variables are set:
- Database connection string
- Groq API key
- OAuth credentials
- JWT secret

### Database Migration

```bash
pnpm db:push
```

### Start Production Server

```bash
pnpm start
```

## Architecture

### Multi-Agent Processing Flow

1. **Task Creation**: User submits NLP task through frontend
2. **Task Queuing**: Task stored in database with "pending" status
3. **Agent Selection**: Appropriate agents selected based on task type
4. **Execution**: Python CrewAI service orchestrates agent collaboration
5. **Streaming**: Results streamed back via Groq API
6. **Storage**: Completed results saved to database
7. **Notification**: User notified of completion

### Agent Types

- **Researcher**: Gathers comprehensive information
- **Analyst**: Identifies patterns and insights
- **Writer**: Creates engaging content
- **Summarizer**: Condenses information
- **Coder**: Generates production-ready code
- **Translator**: Provides accurate translations

## Performance

- **Fast Inference**: Groq API provides sub-second response times
- **Concurrent Processing**: Multiple tasks can run simultaneously
- **Efficient Caching**: Database-backed result storage
- **Optimistic Updates**: Instant UI feedback

## Security

- **Authentication**: OAuth-based user authentication
- **Authorization**: Row-level security for user data
- **API Key Protection**: Server-side API key management
- **Input Validation**: Comprehensive input sanitization
- **SQL Injection Prevention**: Parameterized queries with Drizzle ORM

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

## Acknowledgments

- **CrewAI** for multi-agent orchestration
- **Groq** for fast LLM inference
- **Manus** for platform infrastructure
- **shadcn/ui** for beautiful components

---

**Built with ❤️ using CrewAI and Groq**
