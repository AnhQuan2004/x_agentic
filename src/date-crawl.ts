import dotenv from "dotenv";
import { Scraper, SearchMode } from "agent-twitter-client";

dotenv.config();

const amount = Number(process.env.TWEET_CRAWL) || 10;

// Function to format date to YYYY-MM-DD
function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
}

// Function to parse date string (supports multiple formats)
function parseDate(dateStr: string): Date {
    // Handle different date formats
    const formats = [
        // YYYY-MM-DD
        /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
        // MM/DD/YYYY
        /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
        // DD/MM/YYYY  
        /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
        // YYYY/MM/DD
        /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/
    ];

    // Try to parse as ISO date first
    let parsedDate = new Date(dateStr);
    if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
    }

    // Try different formats
            for (let i = 0; i < formats.length; i++) {
        const match = dateStr.match(formats[i]);
        if (match) {
            let year: number, month: number, day: number;
            
            if (i === 0 || i === 3) { // YYYY-MM-DD or YYYY/MM/DD
                year = parseInt(match[1]);
                month = parseInt(match[2]) - 1; // JavaScript months are 0-indexed
                day = parseInt(match[3]);
            } else if (i === 1) { // MM/DD/YYYY (US format)
                month = parseInt(match[1]) - 1;
                day = parseInt(match[2]);
                year = parseInt(match[3]);
            } else if (i === 2) { // DD/MM/YYYY (EU format)
                day = parseInt(match[1]);
                month = parseInt(match[2]) - 1;
                year = parseInt(match[3]);
            } else {
                continue; // Skip if no format matches
            }
            
            parsedDate = new Date(year, month, day);
            if (!isNaN(parsedDate.getTime())) {
                return parsedDate;
            }
        }
    }

    throw new Error(`Invalid date format: ${dateStr}. Use YYYY-MM-DD, MM/DD/YYYY, or DD/MM/YYYY`);
}

// Function to validate date range
function validateDateRange(startDate: Date, endDate?: Date): void {
    const now = new Date();
    
    if (startDate > now) {
        throw new Error("Start date cannot be in the future");
    }
    
    if (endDate && endDate > now) {
        console.warn("⚠️  End date is in the future, using current date instead");
    }
    
    if (endDate && startDate > endDate) {
        throw new Error("Start date cannot be after end date");
    }
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

// Enhanced date-based crawling function
export async function crawlTweetsByDate(
    scraper: Scraper, 
    usernames: string[], 
    startDateStr: string, 
    endDateStr?: string
) {
    if (usernames.length === 0) {
        console.error("❌ No usernames provided");
        return;
    }

    try {
        // Parse and validate dates
        const startDate = parseDate(startDateStr);
        const endDate = endDateStr ? parseDate(endDateStr) : new Date();
        
        validateDateRange(startDate, endDate);
        
        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);
        
        console.log(`\n📅 Date Range: ${formattedStartDate} to ${formattedEndDate}`);
        console.log("=".repeat(80));
        
        for (const username of usernames) {
            console.log(`\n🔍 Crawling tweets from @${username} (${formattedStartDate} to ${formattedEndDate})`);
            console.log("-".repeat(60));
            
            // Build search query with date filters
            const query = `from:${username} since:${formattedStartDate}${endDateStr ? ` until:${formattedEndDate}` : ''}`;
            console.log(`🔎 Search query: ${query}`);
            
            try {
                // Use search instead of getTweets for date filtering
                const searchResults = await scraper.fetchSearchTweets(query, amount, SearchMode.Latest);
                const tweets = searchResults.tweets;
                
                if (tweets.length === 0) {
                    console.log(`📭 No tweets found for @${username} in the specified date range`);
                    continue;
                }
                
                console.log(`📊 Found ${tweets.length} tweets from @${username}\n`);
                
                let tweetCount = 0;
                for (const tweet of tweets) {
                    tweetCount++;
                    
                    // Skip retweets if specified (optional feature)
                    const tweetData = tweet as any;
                    const isRetweet = tweetData.isRetweet || tweet.text?.startsWith('RT @');
                    
                    console.log(`📝 Tweet #${tweetCount} ${isRetweet ? '(Retweet)' : ''}`);
                    console.log(`📄 Content: ${tweet.text?.substring(0, 200)}${(tweet.text?.length || 0) > 200 ? '...' : ''}`);
                    console.log(`🆔 ID: ${tweet.id}`);
                    console.log(`🔗 URL: ${tweet.permanentUrl}`);
                    console.log(`📅 Posted: ${tweet.timeParsed?.toLocaleString() || 'Unknown'}`);
                    
                    // Engagement metrics
                    const engagement = {
                        likes: tweetData.likes || 0,
                        retweets: tweetData.retweets || 0,
                        replies: tweetData.replies || 0,
                        views: tweetData.views || 0,
                        bookmarks: tweetData.bookmarkCount || 0,
                        quotes: tweetData.quoteCount || 0
                    };
                    
                    const metrics = [];
                    if (engagement.views > 0) metrics.push(`👀 ${formatNumber(engagement.views)} views`);
                    if (engagement.likes > 0) metrics.push(`❤️ ${formatNumber(engagement.likes)} likes`);
                    if (engagement.retweets > 0) metrics.push(`🔄 ${formatNumber(engagement.retweets)} retweets`);
                    if (engagement.replies > 0) metrics.push(`💬 ${formatNumber(engagement.replies)} replies`);
                    if (engagement.bookmarks > 0) metrics.push(`🔖 ${formatNumber(engagement.bookmarks)} bookmarks`);
                    
                    if (metrics.length > 0) {
                        console.log(`📊 ${metrics.join(' • ')}`);
                    }
                    
                    // Media content
                    if (tweet.photos && tweet.photos.length > 0) {
                        console.log(`📸 Photos: ${tweet.photos.length}`);
                    }
                    if (tweet.videos && tweet.videos.length > 0) {
                        console.log(`🎥 Videos: ${tweet.videos.length}`);
                    }
                    
                    console.log("-".repeat(50));
                }
                
                console.log(`✅ Completed crawling ${tweetCount} tweets from @${username}`);
                
            } catch (searchError) {
                console.error(`❌ Error searching tweets for @${username}:`, searchError);
            }
        }
        
        console.log(`\n🎉 Date-based crawling completed!`);
        
    } catch (error) {
        console.error(`❌ Date parsing error:`, (error as Error).message);
        console.log(`\n💡 Supported date formats:`);
        console.log(`   • YYYY-MM-DD (e.g., 2025-01-15)`);
        console.log(`   • MM/DD/YYYY (e.g., 01/15/2025)`);
        console.log(`   • DD/MM/YYYY (e.g., 15/01/2025)`);
        console.log(`   • YYYY/MM/DD (e.g., 2025/01/15)`);
    }
}

// Function for relative date crawling (last N days)
export async function crawlTweetsLastDays(
    scraper: Scraper, 
    usernames: string[], 
    days: number
) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const startDateStr = formatDate(startDate);
    const endDateStr = formatDate(endDate);
    
    console.log(`📅 Crawling tweets from the last ${days} days`);
    
    await crawlTweetsByDate(scraper, usernames, startDateStr, endDateStr);
}
