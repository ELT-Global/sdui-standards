import 'package:intl/intl.dart';
import 'dart:math';

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

class UIDuration extends UINumber {
  final bool compact;
  final String? largestUnit; // "days", "hours", "minutes", "seconds"
  final int maxParts;
  final String? suffix;

  UIDuration(
    double value,
    String locale, {
    this.compact = false,
    this.largestUnit,
    this.maxParts = 2,
    this.suffix,
  }) : super(value, locale);
}

class UIFileSize extends UINumber {
  final bool binary;
  final String? unit; // B, KB, MB, ... or KiB, MiB, ...
  final String? suffix;

  UIFileSize(
    double value,
    String locale, {
    this.binary = false,
    this.unit,
    this.suffix,
    int? rounding,
  }) : super(value, locale, rounding);
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

  if (input is UIDuration) {
    final totalSeconds = input.value.floor();
    final parts = <String>[];
    int remaining = totalSeconds;

    final units = [
      {'label': 'day', 'abbr': 'd', 'seconds': 86400},
      {'label': 'hour', 'abbr': 'h', 'seconds': 3600},
      {'label': 'minute', 'abbr': 'm', 'seconds': 60},
      {'label': 'second', 'abbr': 's', 'seconds': 1},
    ];

    final startIndex = input.largestUnit != null
        ? units.indexWhere((u) => u['label'] == input.largestUnit)
        : 0;

    final filteredUnits = units.sublist(startIndex);

    for (final unit in filteredUnits) {
      if (parts.length >= input.maxParts) break;
      final int amount = remaining ~/ unit['seconds']!;
      if (amount > 0 || parts.isNotEmpty) {
        final formatted = input.compact
            ? '$amount${unit['abbr']}'
            : '$amount ${unit['label']}${amount != 1 ? 's' : ''}';
        parts.add(formatted);
        remaining %= unit['seconds']!;
      }
    }

    if (parts.isEmpty) {
      parts.add(input.compact ? '0s' : '0 seconds');
    }

    return parts.join(input.compact ? ' ' : ', ') +
        (input.suffix != null ? ' ${input.suffix}' : '');
  }

    if (input is UIFileSize) {
    final binary = input.binary;
    final unit = input.unit;
    final suffix = input.suffix ?? '';
    final base = binary ? 1024 : 1000;
    final roundingDigits = input.rounding ?? 2;

    final unitLabels = binary
        ? ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB']
        : ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

    double displayValue = input.value;
    String displayUnit = 'B';

    if (unit != null && unitLabels.contains(unit)) {
      // Forced unit
      final index = unitLabels.indexOf(unit);
      displayValue = input.value / (pow(base, index) as double);
      displayUnit = unit;
    } else {
      // Auto-scale
      int i = 0;
      while (displayValue >= base && i < unitLabels.length - 1) {
        displayValue /= base;
        i++;
      }
      displayUnit = unitLabels[i];
    }

    final rounded = displayValue.toStringAsFixed(roundingDigits);
    return '$rounded $displayUnit${suffix.isNotEmpty ? ' $suffix' : ''}';
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

