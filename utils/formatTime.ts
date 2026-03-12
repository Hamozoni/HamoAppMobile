/**
 * Formats time in seconds to a string in MM:SS format.
 * @param seconds The time in seconds.
 * @returns A formatted string.
 */
export const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const formatMessageTime = (createdAt: string): string => {
    const date = new Date(createdAt);
    return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};
