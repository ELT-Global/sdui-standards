function formatNumber(input: UINumber): string {
  const { value, locale, rounding } = input;
  const options: Intl.NumberFormatOptions = {};

  if (typeof rounding === "number") {
    options.maximumFractionDigits = rounding;
  }

  switch (input.format) {
    case "plain":
      return new Intl.NumberFormat(locale, options).format(value);

    case "percent":
      return new Intl.NumberFormat(locale, {
        style: "percent",
        ...options,
      }).format(value);

    case "ordinal": {
      const rounded = Math.round(value);
      const suffix =
        locale.startsWith("en")
          ? (rounded % 10 === 1 && rounded % 100 !== 11 ? "st"
            : rounded % 10 === 2 && rounded % 100 !== 12 ? "nd"
            : rounded % 10 === 3 && rounded % 100 !== 13 ? "rd"
            : "th")
          : "";
      return `${new Intl.NumberFormat(locale).format(rounded)}${suffix}`;
    }

    case "currency":
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: input.currency,
        ...options,
      }).format(value + (input.gst ?? 0));

    case "duration": {
      const units = [
        { label: "day", seconds: 86400 },
        { label: "hour", seconds: 3600 },
        { label: "minute", seconds: 60 },
        { label: "second", seconds: 1 },
      ];

      const {
        compact = false,
        largestUnit = "days",
        maxParts = 2,
        suffix = "",
      } = input;

      const startIndex = units.findIndex(u => u.label === largestUnit);
      const applicableUnits = units.slice(startIndex);

      let remaining = Math.floor(value);
      const parts: string[] = [];

      for (const { label, seconds } of applicableUnits) {
        if (parts.length >= maxParts) break;
        const amount = Math.floor(remaining / seconds);
        if (amount > 0 || parts.length > 0) {
          parts.push(compact
            ? `${amount}${label[0]}`
            : `${amount} ${label}${amount !== 1 ? "s" : ""}`);
          remaining %= seconds;
        }
      }

      if (parts.length === 0) {
        // fallback if everything rounded to zero
        parts.push(compact ? `0s` : `0 seconds`);
      }

      return parts.join(compact ? " " : ", ") + (suffix ? ` ${suffix}` : "");
    }

    default:
      throw new Error("Unsupported format");
  }
}
