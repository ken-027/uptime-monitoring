# Uptime Monitoring - KSoftDev

A modern, real-time uptime monitoring service that helps you keep track of your websites and APIs with AI-powered analysis and instant alerts.

🌐 **Live Demo**: [https://uptime-monitoring.ksoftdev.site](https://uptime-monitoring.ksoftdev.site)

## ✨ Features

### 🔍 Real-time Monitoring
- **Flexible Check Intervals**: Hourly, 6-hour, 12-hour, or daily monitoring
- **Instant Status Updates**: Real-time UP/DOWN status tracking
- **Response Time Monitoring**: Track website performance metrics
- **Pause/Resume**: Control monitoring on demand

### 🤖 AI-Powered Analysis
- **Smart Site Analysis**: AI analyzes your websites on initial setup and status changes
- **Technology Detection**: Identifies frameworks, CMS, and technologies used
- **SEO Insights**: Detects SEO issues and broken links
- **Performance Analysis**: Evaluates site performance and security
- **Weekly Analysis**: Enterprise plan includes weekly comprehensive analysis

### 📊 Advanced Analytics
- **Visual Charts**: Beautiful line charts showing uptime trends
- **Historical Data**: Track performance over time
- **Response Time Graphs**: Monitor site speed and reliability
- **Status History**: Complete audit trail of all checks

### 🔔 Multi-Channel Alerts
- **Email Notifications**: Instant email alerts on status changes
- **Pushover Integration**: Mobile push notifications
- **Webhook Support**: Custom webhook integrations
- **Real-time Updates**: Immediate notification delivery

### 💳 Subscription Plans
- **Free Plan**: 2 monitors, basic features
- **Pro Plan**: 4 monitors, advanced features, ₱1,000
- **Enterprise Plan**: 6 monitors, AI analysis, ₱2,500

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Ant Design** - UI component library
- **Recharts** - Data visualization

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Better Auth** - Authentication system
- **Drizzle ORM** - Type-safe database queries
- **PostgreSQL** - Reliable database
- **Stripe** - Payment processing
- **MCP Server** - Model Context Protocol integration for AI tools

### Infrastructure
- **Vercel** - Hosting and deployment
- **Upstash QStash** - Background job processing
- **Pushover** - Push notifications
- **EmailJS** - Email notifications
- **Redis** - MCP server session storage

### Monitoring & Analysis
- **Axios** - HTTP client for monitoring
- **Agentic API** - AI-powered site analysis
- **Moment.js** - Date/time utilities

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Stripe account (for payments)
- Pushover account (for notifications)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/uptime-monitoring.git
   cd uptime-monitoring
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp sample.env .env
   ```
   or

   Create a `.env` file with the following variables:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/uptime_monitoring"

   # Authentication
   AUTH_SECRET="your-auth-secret"
   AUTH_URL="http://localhost:3000"

   # Stripe
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."

   # Pushover
   PUSHOVER_TOKEN="your-pushover-token"
   PUSHOVER_USER_KEY="your-pushover-user-key"

   # EmailJS
   EMAILJS_PUBLIC_KEY="your-emailjs-public-key"
   EMAILJS_PRIVATE_KEY="your-emailjs-private-key"
   EMAILJS_TEMPLATE_ID="your-template-id"
   EMAILJS_SERVICE_ID="your-service-id"

   # AI Analysis
   AGENTIC_API="https://your-agentic-api.com/analyze"

   # Upstash QStash
   QSTASH_TOKEN="your-qstash-token"
   QSTASH_CURRENT_SIGNING_KEY="your-signing-key"
   QSTASH_NEXT_SIGNING_KEY="your-next-signing-key"

   # Redis (for MCP server)
   REDIS_URL="redis://localhost:6379"
   ```

5. **Database Setup**
   ```bash
   # Generate database migrations
   npm run db:generate

   # Run migrations
   npm run db:migrate
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Protected routes
│   ├── api/               # API endpoints
│   ├── pricing/           # Pricing page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── client/           # Client-side components
│   └── server/           # Server-side components
├── config/               # Configuration files
├── db/                   # Database layer
│   ├── model/           # Data models
│   └── schema/          # Database schemas
├── lib/                  # Utility libraries
├── types/                # TypeScript types
├── util/                 # Utility functions
└── validation/           # Input validation
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:pull` - Pull database schema
- `npm run db:push` - Push database schema

## 🗄️ Database Schema

### Core Tables
- **users** - User authentication and profiles
- **monitors** - Website/API monitoring configurations
- **monitor_logs** - Historical monitoring data
- **subscriptions** - User subscription plans
- **site_analysis** - AI-generated site analysis

### Key Features
- **UUID Primary Keys** - Secure, unique identifiers
- **Timestamps** - Automatic created/updated tracking
- **Foreign Key Relationships** - Data integrity
- **Enums** - Type-safe status and plan values

## 🔐 Authentication

Built with **Better Auth** for secure authentication:
- Email/password authentication
- Session management
- Protected routes
- User profile management

## 💳 Payment Integration

**Stripe** integration for subscription management:
- Secure payment processing
- Subscription lifecycle management
- Webhook handling
- Plan upgrades/downgrades

## 📊 Monitoring Features

### Check Intervals
- **Hourly** (1 hour) - For critical services
- **Quarterly** (6 hours) - For important services
- **Half-day** (12 hours) - For regular monitoring
- **Daily** (24 hours) - For basic monitoring

### Status Types
- **UP** - Service is responding normally
- **DOWN** - Service is not responding
- **PAUSE** - Monitoring is paused
- **UNKNOWN** - Status cannot be determined

## 🤖 AI Analysis

The system uses AI to analyze websites:
- **Technology Detection** - Identifies frameworks and tools
- **SEO Analysis** - Finds SEO issues and opportunities
- **Performance Metrics** - Evaluates site speed
- **Security Assessment** - Checks for security issues
- **Broken Link Detection** - Finds broken links

## 🔧 MCP Server Integration

The application includes a **Model Context Protocol (MCP)** server that provides AI tools for monitoring management:

### Available MCP Tools
- **`monitor_list`** - Retrieve user's list of monitored URLs with details
- **`add_monitor`** - Add a new monitor with name, URL, and interval
- **`remove_monitor`** - Remove a monitor by ID

### MCP Features
- **Secure Authentication** - Integrated with Better Auth for user verification
- **Real-time Operations** - Direct database operations for immediate results
- **Type Safety** - Zod validation for all tool parameters
- **Session Management** - Redis-based session storage for MCP connections

### API Endpoint
- **Route**: `/api/v1/[transport]`
- **Methods**: GET, POST, DELETE
- **Authentication**: Required via Better Auth session
- **Transport**: Supports various MCP transport protocols

## 📈 Analytics & Reporting

- **Real-time Charts** - Visual uptime trends
- **Response Time Tracking** - Performance monitoring
- **Historical Data** - Long-term analysis
- **Status History** - Complete audit trail

## 🔔 Notification System

### Supported Channels
- **Email** - Instant email notifications
- **Pushover** - Mobile push notifications
- **Webhooks** - Custom integrations

### Notification Triggers
- Status changes (UP → DOWN, DOWN → UP)
- Response time thresholds
- Weekly analysis (Enterprise plan)
