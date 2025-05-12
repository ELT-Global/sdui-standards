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
        locale.startsWith("en") ?
          (rounded % 10 === 1 && rounded % 100 !== 11 ? "st" :
           rounded % 10 === 2 && rounded % 100 !== 12 ? "nd" :
           rounded % 10 === 3 && rounded % 100 !== 13 ? "rd" : "th") :
          "";
      return `${new Intl.NumberFormat(locale).format(rounded)}${suffix}`;
    }

    case "currency":
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: input.currency,
        ...options,
      }).format(value);

    default:
      throw new Error("Unsupported format");
  }
}
