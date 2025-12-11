```ts
type UIBaseTime = {
    type: "time";
    timestamp: string;    // Unix timestamp string in milliseconds (e.g. "1715761800000")
    locale: string;       // IETF BCP 47 language tag (e.g. "en-US", "fr-FR")
    timeZone?: string;    // Optional IANA time zone string (e.g. "Asia/Kolkata", "UTC")
    hour12?: boolean;     // Explicit toggle for 12-hour or 24-hour time display
}

// Display format variants
type UIPlainTime = UIBaseTime & { format: "plain" };                // e.g. "2:30 PM"
type UITimeRange = UIBaseTime & { 
    format: "range";
    output: "both" | "start" | "end";
    showDuration?: boolean; // Whether to show duration alongside time range, eg. " (1h 30m)"
    separator?: string; // default is " - "
}; // e.g. "10:00am - 11:00am"
type UITimer = UIBaseTime & { format: "timer", serverTimestamp?: number; }; // e.g. timer from date to now
type UICountdown = UIBaseTime & { 
    format: "countdown";
    lowestUnit?: "days" | "hours" | "minutes" | "seconds";    
}; // e.g. countdown in days, hours, minutes, seconds to date

export type UIDate = UIPlainTime | UITimeRange | UITimer | UICountdown;
```