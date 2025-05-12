import 'package:intl/intl.dart';

abstract class UINumber {
  final double value;
  final String locale;
  final int? rounding;

  UINumber(this.value, this.locale, [this.rounding]);
}

class UIPlainNumber extends UINumber {
  UIPlainNumber(double value, String locale, [int? rounding])
      : super(value, locale, rounding);
}

class UIPercentage extends UINumber {
  UIPercentage(double value, String locale, [int? rounding])
      : super(value, locale, rounding);
}

class UIOrdinal extends UINumber {
  UIOrdinal(double value, String locale) : super(value, locale);
}

class UIAmount extends UINumber {
  final String currency;
  UIAmount(double value, String locale, this.currency, [int? rounding])
      : super(value, locale, rounding);
}

String formatNumber(UINumber input) {
  final value = input.value;
  final locale = _normalizeLocale(input.locale);
  final rounding = input.rounding;
  final maxDigits = rounding ?? 20;

  if (input is UIPlainNumber) {
    final formatter = NumberFormat.decimalPattern(locale)
      ..maximumFractionDigits = maxDigits;
    return formatter.format(value);
  }

  if (input is UIPercentage) {
    final formatter = NumberFormat.percentPattern(locale)
      ..maximumFractionDigits = maxDigits;
    return formatter.format(value);
  }

  if (input is UIOrdinal) {
    final int rounded = value.round();
    final suffix = _getOrdinalSuffix(rounded, locale);
    final formatter = NumberFormat.decimalPattern(locale);
    return '${formatter.format(rounded)}$suffix';
  }

  if (input is UIAmount) {
    final formatter = NumberFormat.currency(
      locale: locale,
      symbol: input.currency.length <= 3 ? null : input.currency,
      name: input.currency.length <= 3 ? input.currency : null,
    )..maximumFractionDigits = maxDigits;
    return formatter.format(value);
  }

  throw ArgumentError('Unsupported format');
}

String _normalizeLocale(String raw) {
  return raw.replaceAll('-', '_');
}

String _getOrdinalSuffix(int number, String locale) {
  if (!locale.startsWith('en')) return '';
  if (number % 10 == 1 && number % 100 != 11) return 'st';
  if (number % 10 == 2 && number % 100 != 12) return 'nd';
  if (number % 10 == 3 && number % 100 != 13) return 'rd';
  return 'th';
}

