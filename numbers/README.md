```ts
type UIBaseNumber = {
   value: number;
   locale: string;  // IETF BCP 47 language tag, eg. en-US
   rounding?: number; // number of decimal places to round to, no rounding if undefined
}

type UIPlainNumber = UIBaseNumber & { format: "plain" } // eg. 36,200
type UIPercentage = UIBaseNumber & { format: "percent" }; // eg. 28%
type UIOrdinal = UIBaseNumber & { format: "ordinal" }; // eg. 3rd, 4th
type UIAmount = UIBaseNumber & { 
    format: "currency"; 
    currency: string;  // ISO 4217 currency string (eg. USD) or the symbol (eg. $)
    gst?: number;
} // eg. $2,000
type UIDuration = UIBaseNumber & {
   format: "duration";
   compact?: boolean; // if true, use "1h 2m" style; if false, "1 hour 2 minutes" [Default false]
   largestUnit?: "days" | "hours" | "minutes" | "seconds"; // restirct output's largest unit
   maxParts?: number; // max parts to show, e.g. 2 -> "1h 5m", not "1h 5m 30s" [Default 2]
   suffix?: string; // optional string to append (e.g "ago", "left")
} // eg. 1h 5m
type UIFileSize = UIBaseNumber & {
   format: "filesize";
   binary?: boolean;
   unit?: "B" | "KB" | "MB" | "GB" | "TB" | "PB" | "KiB" | "MiB" | "GiB" | "TiB" | "PiB";
   suffix?: string;
};

type UINumber = UIPlainNumber | UIPercentage | UIOrdinal | UIAmount | UIDuration | UIFileSize;
```
