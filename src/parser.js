export const parseChat = (text) => {
    const lines = text.split('\n');
    const messages = [];

    // Regex patterns
    // 1. Android/General: 24/12/2024, 11:30 - Sender: Message
    // 2. iOS: [24/12/2024, 11:30:12] Sender: Message
    // 3. US: 12/24/24, 11:30 AM - Sender: Message

    // We look for a line starting with a date.
    // Common denominator: Starts with digits or bracket then digits.

    const dateRegex = /^\[?(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4})[,\s]+(\d{1,2}:\d{2}(?::\d{2})?(?:\s?[AP]M)?)\]?(?:\s-\s)?\s(.+?):\s(.+)/i;

    // System messages (encryption, group changes) - capture but mark as system
    const systemRegex = /^\[?(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4})[,\s]+(\d{1,2}:\d{2}(?::\d{2})?(?:\s?[AP]M)?)\]?(?:\s-\s)?\s(.+)/i;

    let currentMessage = null;

    lines.forEach((line) => {
        // Clean invisible chars
        line = line.replace(/[\u200e\u200f]/g, "").trim();

        if (!line) return;

        const match = line.match(dateRegex);

        if (match) {
            // It's a new valid message
            const [_, dateStr, timeStr, sender, content] = match;

            // Parse Date
            // We accept DD/MM/YYYY or MM/DD/YYYY based on basic heuristics or system locale assumptions.
            // For now, we store string, but ideally we parse to Date object.
            // Quick parser helper needed later if we want real time stats.

            const dateTime = parseDateTime(dateStr, timeStr);

            currentMessage = {
                date: dateTime,
                author: sender,
                content: content,
                isSystem: false
            };
            messages.push(currentMessage);
        } else {
            // Check for system message if standard match failed
            const sysMatch = line.match(systemRegex);
            if (sysMatch && !currentMessage) {
                // Start of file system message
                // Often system messages don't have a colon separator for sender
                // e.g. "Messages to this chat and calls are now secured..."
                // We might or might not want these. Let's ignore strictly system messages without authors for stats validity.
            } else if (currentMessage) {
                // It's a continuation of the previous message
                currentMessage.content += '\n' + line;
            }
        }
    });

    console.log(`Parsed ${messages.length} messages.`);
    return messages;
};

// Helper: Attempt to handle the chaos of date formats
function parseDateTime(dateStr, timeStr) {
    // Normalize separators
    const d = dateStr.replace(/[-.]/g, '/');
    const t = timeStr.replace(/[\[\]]/g, '');

    // Heuristic: If first part > 12, it's definitely Day.
    // If not, it's ambiguous (US vs ROW).
    // Most exports use the phone's locale.
    // We'll create a generic date object or timestamp.

    // For wrapped, we mostly care about "Time of day" and "Day of week".
    // Let's try native Date parsing first.
    let combined = `${d} ${t}`;
    let validDate = new Date(combined);

    if (isNaN(validDate.getTime())) {
        // Try to manual parse DD/MM/YYYY
        const parts = d.split('/');
        if (parts.length === 3) {
            // Try assumption DD/MM/YYYY
            // month is 0-indexed in JS
            // Date(year, monthIndex, day, hours, minutes)
            // This is getting complex due to AM/PM logic.
            // Let's rely on string timestamps for simple processing if possible, 
            // but for Timeline we need valid Date.

            // Fallback: Return raw string or null to skip time analysis for broken rows
            return null;
        }
    }

    return validDate;
}
