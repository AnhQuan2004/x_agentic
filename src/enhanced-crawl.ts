import dotenv from "dotenv";
import { Scraper } from "agent-twitter-client";

dotenv.config();

const amount = Number(process.env.TWEET_CRAWL) || 10;

// Function to extract engagement metrics from aria-label
function parseEngagementMetrics(ariaLabel: string): {
    replies?: number;
    reposts?: number;
    likes?: number;
    bookmarks?: number;
    views?: number;
} {
    const metrics: any = {};
    
    if (!ariaLabel) return metrics;
    
    // Parse patterns like "4 replies, 1 repost, 8 likes, 2 bookmarks, 1255 views"
    const patterns = [
        { key: 'replies', regex: /(\d+)\s+repl(?:y|ies)/i },
        { key: 'reposts', regex: /(\d+)\s+repost/i },
        { key: 'likes', regex: /(\d+)\s+like/i },
        { key: 'bookmarks', regex: /(\d+)\s+bookmark/i },
        { key: 'views', regex: /(\d+)\s+view/i }
    ];
    
    patterns.forEach(({ key, regex }) => {
        const match = ariaLabel.match(regex);
        if (match) {
            metrics[key] = parseInt(match[1], 10);
        }
    });
    
    return metrics;
}

// Function to format large numbers
function formatNumber(num: number): string {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

export async function enhancedCrawlTweets(scraper: Scraper, listUsers: string[]) {
    if (listUsers.length === 0) {
        console.error("No users to crawl");
        return;
    }
    
    for (const user of listUsers) {
        console.log(`\n🔍 Crawling tweets for user: @${user}`);
        console.log("=".repeat(80));
        
        const tweets = scraper.getTweets(user, amount);
        let tweetCount = 0;
        
        for await (const tweet of tweets) {
            tweetCount++;
            console.log(`\n📝 Tweet #${tweetCount}`);
            console.log("-".repeat(50));
            
            // Basic tweet info
            console.log("📄 Content:", tweet.text?.substring(0, 200) + ((tweet.text?.length || 0) > 200 ? "..." : ""));
            console.log("🆔 Tweet ID:", tweet.id);
            console.log("🔗 URL:", tweet.permanentUrl);
            console.log("📅 Posted:", tweet.timeParsed?.toLocaleString() || 'Unknown');
            
            // Standard engagement metrics from the API using correct property names
            const tweetData = tweet as any; // Type assertion to access dynamic properties
            const engagement = {
                likes: tweetData.likes || 0,
                retweets: tweetData.retweets || 0,
                replies: tweetData.replies || 0,
                views: tweetData.views || 0,
                bookmarks: tweetData.bookmarkCount || 0,
                quotes: tweetData.quoteCount || 0
            };
            
            // Display engagement metrics
            console.log("\n📊 Engagement Metrics:");
            if (engagement.views > 0) console.log(`   👀 Views: ${formatNumber(engagement.views)}`);
            if (engagement.likes > 0) console.log(`   ❤️  Likes: ${formatNumber(engagement.likes)}`);
            if (engagement.retweets > 0) console.log(`   🔄 Retweets: ${formatNumber(engagement.retweets)}`);
            if (engagement.replies > 0) console.log(`   💬 Replies: ${formatNumber(engagement.replies)}`);
            if (engagement.quotes > 0) console.log(`   🗨️  Quotes: ${formatNumber(engagement.quotes)}`);
            if (engagement.bookmarks > 0) console.log(`   🔖 Bookmarks: ${formatNumber(engagement.bookmarks)}`);
            
            // Media content
            if (tweet.photos && tweet.photos.length > 0) {
                console.log(`\n📸 Photos (${tweet.photos.length}):`);
                tweet.photos.forEach((photo: any, index: number) => {
                    console.log(`   ${index + 1}. ${photo.url}`);
                });
            }
            
            if (tweet.videos && tweet.videos.length > 0) {
                console.log(`\n🎥 Videos (${tweet.videos.length}):`);
                tweet.videos.forEach((video: any, index: number) => {
                    console.log(`   ${index + 1}. ${video.url}`);
                });
            }
            
            // Additional tweet properties for debugging
            if (process.env.DEBUG_TWEET_PROPERTIES === 'true') {
                console.log("\n🔧 Debug - Available properties:", Object.keys(tweet));
                console.log("🔧 Debug - Full tweet object:", JSON.stringify(tweet, null, 2));
            }
            
            console.log("-".repeat(50));
        }
        
        console.log(`\n✅ Finished crawling ${tweetCount} tweets from @${user}`);
    }
}

// Export both functions
export { crawlTweets } from './crawl';
