import dotenv from "dotenv";
import { Scraper } from "agent-twitter-client";

dotenv.config();

const amount = Number(process.env.TWEET_CRAWL) || 10;

export async function crawlTweets(scraper: Scraper, listUsers: string[]) {
    if (listUsers.length === 0) {
        console.error("No users to crawl");
        return;
    }
    for (const user of listUsers) {
        console.log("Crawling tweets for user:", user);
        const tweets = scraper.getTweets(user, amount);
        for await (const tweet of tweets) {
            console.log("=".repeat(80));
            console.log("Tweet:", tweet.text);
            console.log("Tweet ID:", tweet.id);
            console.log("Tweet URL:", tweet.permanentUrl);
            console.log("Created at:", tweet.timeParsed);
            
            // Note: Use DEBUG_TWEET_PROPERTIES=true to see all available properties
            
            // Check for engagement metrics using the correct property names
            const tweetData = tweet as any; // Type assertion to access dynamic properties
            
            if (tweetData.likes !== undefined && tweetData.likes > 0) {
                console.log("❤️  Likes:", tweetData.likes);
            }
            if (tweetData.retweets !== undefined && tweetData.retweets > 0) {
                console.log("🔄 Retweets:", tweetData.retweets);
            }
            if (tweetData.replies !== undefined && tweetData.replies > 0) {
                console.log("💬 Replies:", tweetData.replies);
            }
            if (tweetData.views !== undefined && tweetData.views > 0) {
                console.log("👀 Views:", tweetData.views);
            }
            if (tweetData.bookmarkCount !== undefined && tweetData.bookmarkCount > 0) {
                console.log("🔖 Bookmarks:", tweetData.bookmarkCount);
            }
            if (tweetData.quoteCount !== undefined && tweetData.quoteCount > 0) {
                console.log("🗨️  Quotes:", tweetData.quoteCount);
            }
            
            // Check if there are photos/videos
            if (tweet.photos && tweet.photos.length > 0) {
                console.log("📸 Photos:", tweet.photos.length);
                tweet.photos.forEach((photo: any, index: number) => {
                    console.log(`   Photo ${index + 1}: ${photo.url}`);
                });
            }
            if (tweet.videos && tweet.videos.length > 0) {
                console.log("🎥 Videos:", tweet.videos.length);
                tweet.videos.forEach((video: any, index: number) => {
                    console.log(`   Video ${index + 1}: ${video.url}`);
                });
            }
            
            console.log("=".repeat(80));
        }
    }
}
