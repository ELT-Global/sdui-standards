import 'package:intl/intl.dart';

class UIDate {
  final String value; // ISO8601
  final String locale;
  final String? timeZone; // Not directly supported in Dart
  final String? calendar; // Ignored unless custom calendar system implemented
  final bool? hour12;
  final String format; // "date", "time", "datetime", "weekday", etc.

  UIDate({
    required this.value,
    required this.locale,
    required this.format,
    this.timeZone,
    this.calendar,
    this.hour12,
  });
}

String formatDate(UIDate date) {
  final dateTime = DateTime.parse(date.value).toLocal(); // Fallback to local
  final use12Hour = date.hour12 ?? false;

  String formatPattern;

  switch (date.format) {
    case 'date':
      formatPattern = 'yMMMMd'; // e.g. May 19, 2025
      break;

    case 'time':
      formatPattern = use12Hour ? 'h:mm a' : 'HH:mm'; // 2:30 PM or 14:30
      break;

    case 'datetime':
      formatPattern = use12Hour ? 'yMMMMd h:mm a' : 'yMMMMd HH:mm';
      break;

    case 'weekday':
      formatPattern = 'EEEE'; // Monday
      break;

    case 'monthYear':
      formatPattern = 'yMMMM'; // May 2025
      break;

    case 'full':
      formatPattern = use12Hour ? 'EEEE, yMMMMd h:mm a' : 'EEEE, yMMMMd HH:mm';
      break;

    case 'relative':
      return _formatRelative(dateTime, date.locale);

    default:
      formatPattern = 'yMd H:mm'; // fallback
  }

  return DateFormat(formatPattern, date.locale).format(dateTime);
}

String _formatRelative(DateTime target, String locale) {
  final now = DateTime.now();
  final diff = target.difference(now);
  final seconds = diff.inSeconds;

  final absSeconds = seconds.abs();
  final Map<String, int> units = {
    'year': 31536000,
    'month': 2592000,
    'week': 604800,
    'day': 86400,
    'hour': 3600,
    'minute': 60,
    'second': 1,
  };

  for (final unit in units.entries) {
    final threshold = unit.value;
    if (absSeconds >= threshold || unit.key == 'second') {
      final value = (seconds / threshold).round();
      return _formatRelativePhrase(value, unit.key, locale);
    }
  }

  return DateFormat.yMd(locale).format(target);
}

String _formatRelativePhrase(int value, String unit, String locale) {
  final pluralUnit = value.abs() == 1 ? unit : '${unit}s';
  if (value < 0) {
    return Intl.message(
      '$value $pluralUnit ago',
      name: 'past_$unit',
      args: [value],
      locale: locale,
    );
  } else {
    return Intl.message(
      'in $value $pluralUnit',
      name: 'future_$unit',
      args: [value],
      locale: locale,
    );
  }
}
