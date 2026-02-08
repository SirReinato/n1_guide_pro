export function parseInlineText(text) {
    if (!text) return [];

    const regex =
        /(https?:\/\/[^\s)]+)|(\\\\[a-zA-Z0-9._-]+\\[^\s]+)|(['"])(.*?)\3/g;

    const parts = [];
    let lastIndex = 0;

    text.replace(regex, (match, url, path, quote, quotedText, offset) => {
        // Texto antes do match
        if (offset > lastIndex) {
            parts.push({
                type: "text",
                value: text.slice(lastIndex, offset),
            });
        }

        // URL
        if (url) {
            parts.push({
                type: "url",
                value: url,
            });
        }

        // UNC path
        else if (path) {
            parts.push({
                type: "path",
                value: path,
            });
        }

        // Texto entre aspas
        else if (quote) {
            parts.push({
                type: "quoted",
                value: quotedText,
                quote,
            });
        }

        lastIndex = offset + match.length;
    });

    // Texto restante
    if (lastIndex < text.length) {
        parts.push({
            type: "text",
            value: text.slice(lastIndex),
        });
    }

    return parts;
}
