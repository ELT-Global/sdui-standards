```ts
type UIBaseDate = {
    type: "date";
    value: string;        // ISO 8601 date string (e.g. "2025-05-19T14:30:00Z")
    locale: string;       // IETF BCP 47 language tag (e.g. "en-US", "fr-FR")
    timeZone?: string;    // Optional IANA time zone string (e.g. "Asia/Kolkata", "UTC")
    calendar?: string;    // Optional calendar identifier (e.g. "gregory", "buddhist", "iso8601")
    hour12?: boolean;     // Explicit toggle for 12-hour or 24-hour time display
}

// Display format variants
type UIDateOnly = UIBaseDate & { format: "date" };                // e.g. "May 19, 2025"
type UITimeOnly = UIBaseDate & { format: "time" };                // e.g. "2:30 PM"
type UIDateTime = UIBaseDate & { format: "datetime" };            // e.g. "May 19, 2025 at 2:30 PM"
type UIRelativeDate = UIBaseDate & { format: "relative" };        // e.g. "2 days ago", "in 3 hours"
type UIRelativeDays = UIBaseDate & { format: "relativeDays" };    // e.g. "5" (days left until date, 0 if past)
type UIWeekday = UIBaseDate & { format: "weekday" };              // e.g. "Monday"
type UIMonthYear = UIBaseDate & { format: "monthYear" };          // e.g. "May 2025"
type UIShortMonthYear = UIBaseDate & { format: "shortMonthYear" }; // e.g. "01 Jun '25"
type UIFull = UIBaseDate & { format: "full" };                    // e.g. "Monday, May 19, 2025 at 2:30 PM IST"
type UIShort = UIBaseDate & { format: "short" };                  // e.g. "07/03/2025"

export type UIDate = UIDateOnly | UITimeOnly | UIDateTime | UIRelativeDate | UIRelativeDays | UIWeekday | UIMonthYear | UIShortMonthYear | UIFull | UIShort;
```
