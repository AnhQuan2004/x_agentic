# X Agentic - Twitter AI Agent 🤖

A powerful TypeScript-based Twitter bot that combines web scraping, AI-powered content generation, and automated social media management. Built with Google Gemini AI and advanced Twitter crawling capabilities.

## 🌟 Features

### 🔍 **Advanced Tweet Crawling**
- **Basic Crawling**: Extract tweets with engagement metrics from any user
- **Enhanced Crawling**: Beautiful formatted output with comprehensive analytics
- **Engagement Metrics**: Views, likes, retweets, replies, bookmarks, and quotes
- **Media Detection**: Automatic detection and listing of photos/videos
- **Batch Processing**: Crawl multiple users simultaneously

### 🤖 **AI-Powered Content Generation**
- **Smart Tweet Creation**: Generate contextual tweets using Google Gemini AI
- **Character-Based Personas**: Customizable AI personality through JSON configuration
- **Auto-Reply System**: Intelligent responses to mentions and interactions
- **Conversation Context**: Maintains thread context for relevant replies

### 🔐 **Robust Authentication**
- **Cookie Caching**: Persistent login sessions to avoid repeated authentication
- **2FA Support**: Full two-factor authentication compatibility
- **Session Management**: Automatic session refresh and error handling

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Twitter account credentials
- Google Gemini API key

### Installation

1. **Clone and setup**
```bash
git clone <repository-url>
cd x_agentic
npm install
```

2. **Environment Configuration**
Create a `.env` file in the project root:

```env
# Twitter Credentials
TWITTER_USERNAME=your_twitter_username
TWITTER_PASSWORD=your_twitter_password
TWITTER_EMAIL=your_email@example.com
TWITTER_2FA_SECRET=your_2fa_secret_key

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash

# Configuration Options
TWEET_CRAWL=10                    # Number of tweets to crawl (default: 10)
TWEET_CHAR_LIMIT=200              # Character limit for generated tweets
REPLY_LATEST_TWEET=5              # Number of latest mentions to check
DEBUG_TWEET_PROPERTIES=false      # Enable debug mode for tweet properties
```

### 🎭 Character Configuration

Customize your AI agent's personality by editing `character/main.json`:

```json
{
    "agent": "Your_Agent_Name",
    "bio": [
        "Brief description of your agent",
        "Key personality traits",
        "Background information"
    ],
    "knowledge": [
        "Areas of expertise",
        "Relevant experience",
        "Specific knowledge domains"
    ]
}
```

## 📖 Usage Guide

### Basic Commands

```bash
# Start the application
npm start

# Show help and available commands
npm start help
```

### 🔍 Crawling Commands

**Basic Tweet Crawling**
```bash
npm start crawl [username1] [username2] ...
```
Example:
```bash
npm start crawl elonmusk vitalikbuterin
```

**Enhanced Crawling (Recommended)**
```bash
npm start enhanced-crawl [username1] [username2] ...
# or use the short alias
npm start ecrawl [username1] [username2] ...
```
Example:
```bash
npm start enhanced-crawl ethereum solana web3
```

### 🤖 AI Commands

**Generate and Post Tweet**
```bash
npm start tweet
```

**Auto-Reply to Mentions**
```bash
npm start reply
```

## 📊 Enhanced Crawling Features

The enhanced crawling mode provides:

- **📈 Formatted Metrics**: Clean, emoji-rich display of engagement data
- **📱 Media Content**: Automatic detection of photos and videos
- **🔢 Smart Formatting**: Human-readable number formatting (1.2K, 3.4M)
- **📅 Timestamp Display**: Localized date and time information
- **🎯 Content Preview**: Truncated content with full context preservation

### Sample Enhanced Output
```
🔍 Crawling tweets for user: @ethereum

📝 Tweet #1
--------------------------------------------------
📄 Content: The future of decentralized finance is here...
🆔 Tweet ID: 1234567890
🔗 URL: https://twitter.com/ethereum/status/1234567890
📅 Posted: 12/15/2023, 2:30:15 PM

📊 Engagement Metrics:
   👀 Views: 125.3K
   ❤️  Likes: 2.1K
   🔄 Retweets: 456
   💬 Replies: 89
   🗨️  Quotes: 23
   🔖 Bookmarks: 167

📸 Photos (2):
   1. https://pbs.twimg.com/media/example1.jpg
   2. https://pbs.twimg.com/media/example2.jpg
```

## 🛠️ Technical Architecture

### Core Components

- **`index.ts`**: Main application entry point and command router
- **`src/login.ts`**: Authentication and session management
- **`src/crawl.ts`**: Basic tweet crawling functionality
- **`src/enhanced-crawl.ts`**: Advanced crawling with rich formatting
- **`src/ask.ts`**: Google Gemini AI integration
- **`src/reply.ts`**: Automated reply system

### Dependencies

| Package | Purpose |
|---------|---------|
| `agent-twitter-client` | Twitter API and web scraping |
| `@google/generative-ai` | Google Gemini AI integration |
| `@elizaos/core` | Agent framework foundation |
| `dotenv` | Environment variable management |
| `typescript` | Type-safe development |

## 🔧 Configuration Options

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `TWEET_CRAWL` | Number of tweets to crawl per user | 10 |
| `TWEET_CHAR_LIMIT` | Character limit for AI-generated tweets | 200 |
| `REPLY_LATEST_TWEET` | Number of latest mentions to process | 5 |
| `GEMINI_MODEL` | Google AI model to use | gemini-1.5-flash |
| `DEBUG_TWEET_PROPERTIES` | Enable detailed tweet debugging | false |

### Debug Mode

Enable debug mode to see all available tweet properties:
```bash
DEBUG_TWEET_PROPERTIES=true npm start enhanced-crawl username
```

## 📁 Project Structure

```
x_agentic/
├── character/
│   └── main.json          # AI agent personality configuration
├── src/
│   ├── ask.ts            # AI content generation
│   ├── crawl.ts          # Basic tweet crawling
│   ├── enhanced-crawl.ts # Advanced crawling with metrics
│   ├── login.ts          # Authentication management
│   └── reply.ts          # Automated reply system
├── cookies.json          # Cached authentication cookies
├── replied.json          # Track replied-to tweets
├── index.ts              # Main application entry
├── package.json          # Project dependencies
└── tsconfig.json         # TypeScript configuration
```

## 🔒 Security & Privacy

- **Cookie Security**: Authentication cookies are stored locally and automatically managed
- **Rate Limiting**: Built-in protections against API rate limits
- **Error Handling**: Comprehensive error handling for network and API failures
- **Session Validation**: Automatic session validation and renewal

## 🐛 Troubleshooting

### Common Issues

**Authentication Failed**
```bash
# Clear cached cookies and retry
rm cookies.json
npm start login
```

**Rate Limited**
- Wait 15-30 minutes before retrying
- Reduce the number of tweets being crawled
- Check your API usage limits

**Missing Environment Variables**
```bash
# Verify your .env file contains all required variables
cat .env
```

### Debug Mode

Enable comprehensive debugging:
```bash
DEBUG_TWEET_PROPERTIES=true npm start enhanced-crawl username
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## ⚠️ Disclaimer

This tool is for educational and research purposes. Please ensure compliance with Twitter's Terms of Service and applicable laws. Use responsibly and respect rate limits and user privacy.

---

**Built with ❤️ using TypeScript, Google Gemini AI, and modern web scraping techniques.**