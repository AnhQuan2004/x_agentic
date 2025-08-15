import dotenv from "dotenv";

// Scraper 
import { Scraper } from "agent-twitter-client";

// Gemini
import { GoogleGenerativeAI } from "@google/generative-ai";

// Functions
import { login } from "./src/login";
import { crawlTweets } from "./src/crawl";
import { enhancedCrawlTweets } from "./src/enhanced-crawl";
import { askGemini } from "./src/ask";
import { replyTweet } from "./src/reply";

dotenv.config();

const username = process.env.TWITTER_USERNAME || "";
const password = process.env.TWITTER_PASSWORD || "";
const email = process.env.TWITTER_EMAIL || "";
const fa = process.env.TWITTER_2FA_SECRET || "";
const apiKey = process.env.GEMINI_API_KEY || "";
const cmd = process.argv.slice(2)[0];

const scraper = new Scraper();
const genAI = new GoogleGenerativeAI(apiKey);

async function main() {
    await login(scraper, username, password, email, fa);
    console.log("Login successful!");

    if (cmd === "crawl") {
        const listUsers = process.argv.slice(3);
        crawlTweets(scraper, listUsers);
    } else if (cmd === "enhanced-crawl" || cmd === "ecrawl") {
        const listUsers = process.argv.slice(3);
        enhancedCrawlTweets(scraper, listUsers);
    } else if (cmd === "tweet") {
        try {
            const response = await askGemini(genAI, "tweet");
            console.log("Tweet generated:", response);
            await scraper.sendTweet(response);
        } catch (error) {
            console.error("Error create tweet:", error);
        }
    } else if (cmd === "reply") {
        replyTweet(genAI, scraper, username);
    } else if (cmd === "help" || cmd === "--help" || cmd === "-h") {
        showHelp();
        return;
    } else {
        console.log("❌ Unknown command. Use 'npm start help' to see available commands.");
        return;
    }
}

function showHelp() {
    console.log(`
🤖 Twitter AI Agent - Help

📋 Available Commands:
  
  🔍 Crawling Commands:
    npm start crawl [username1] [username2] ...     - Basic tweet crawling
    npm start enhanced-crawl [username1] ...        - Enhanced crawling with full metrics
    npm start ecrawl [username1] ...                - Short alias for enhanced-crawl
  
  🤖 AI Commands:
    npm start tweet                                  - Generate and post an AI tweet
    npm start reply                                  - Auto-reply to mentions
  
  ❓ Help:
    npm start help                                   - Show this help message

📊 Enhanced Crawl Features:
  - Tweet engagement metrics (views, likes, retweets, replies)
  - Media detection (photos, videos)
  - Formatted output with emojis
  - Better readability

🔧 Environment Variables:
  - TWEET_CRAWL: Number of tweets to crawl (default: 10)
  - DEBUG_TWEET_PROPERTIES: Set to 'true' for debug info
  
📝 Examples:
  npm start enhanced-crawl ethereum vitalikbuterin
  npm start crawl elonmusk
  npm start tweet
  npm start reply

💡 Tip: Use 'enhanced-crawl' for better formatted output with engagement metrics!
    `);
}

main().catch(console.error);
