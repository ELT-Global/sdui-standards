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

type UINumber = UIPlainNumber | UIPercentage | UIOrdinal | UIAmount;
```
