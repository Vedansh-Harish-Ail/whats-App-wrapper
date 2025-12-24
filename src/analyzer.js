export const analyzeChat = (messages) => {
    // Filter out invalid dates
    const validMessages = messages.filter(m => m.date && !isNaN(m.date.getTime()));

    if (validMessages.length === 0) return null;

    // 1. Total Messages
    const totalMessages = validMessages.length;

    // 2. Authors Stats
    const authors = {};
    validMessages.forEach(msg => {
        authors[msg.author] = (authors[msg.author] || 0) + 1;
    });

    const sortedAuthors = Object.entries(authors)
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({ name, count }));

    // 3. Hourly Activity (0-23)
    const hours = new Array(24).fill(0);
    validMessages.forEach(msg => {
        const h = msg.date.getHours();
        hours[h]++;
    });

    // 4. Monthly/Daily Stats
    // Identify the most active day

    // 5. Emoji Analysis
    const emojiRegex = /\p{Emoji_Presentation}/gu;
    const emojiCounts = {};

    validMessages.forEach(msg => {
        const matches = msg.content.match(emojiRegex);
        if (matches) {
            matches.forEach(emoji => {
                emojiCounts[emoji] = (emojiCounts[emoji] || 0) + 1;
            });
        }
    });

    const topEmojis = Object.entries(emojiCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([emoji, count]) => ({ emoji, count }));

    // 6. First and Last Message
    const firstMessage = validMessages[0];
    const lastMessage = validMessages[validMessages.length - 1];

    // Duration in days
    const durationMs = lastMessage.date - firstMessage.date;
    const durationDays = Math.floor(durationMs / (1000 * 60 * 60 * 24));

    return {
        totalMessages,
        authors: sortedAuthors,
        hours,
        topEmojis,
        durationDays,
        firstDate: firstMessage.date,
        lastDate: lastMessage.date
    };
};
