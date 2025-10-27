export function formatDate(date: UIDate): string {
  const dateObj = new Date(date.value);
  const locale = date.locale || 'en-US';
  const timeZone = date.timeZone;

  const baseOptions: Intl.DateTimeFormatOptions = {
    calendar: date.calendar,
    hour12: date.hour12,
    ...(date.timeZone ? { timeZone: date.timeZone } : {}),
  };

  switch (date.format) {
    case 'short':
      return new Intl.DateTimeFormat(locale, {
        ...baseOptions,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(dateObj).replace(/[-/]/g, '/');

    case 'date':
      return new Intl.DateTimeFormat(locale, {
        ...baseOptions,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(dateObj);

    case 'time':
      return new Intl.DateTimeFormat(locale, {
        ...baseOptions,
        hour: 'numeric',
        minute: '2-digit',
      }).format(dateObj);

    case 'datetime':
      return new Intl.DateTimeFormat(locale, {
        ...baseOptions,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }).format(dateObj);

    case 'weekday':
      return new Intl.DateTimeFormat(locale, {
        ...baseOptions,
        weekday: 'long',
      }).format(dateObj);

    case 'monthYear':
      return new Intl.DateTimeFormat(locale, {
        ...baseOptions,
        year: 'numeric',
        month: 'long',
      }).format(dateObj);

    case 'shortMonthYear': {
      const day = new Intl.DateTimeFormat(locale, {
        ...baseOptions,
        day: '2-digit',
      }).format(dateObj);
      const month = new Intl.DateTimeFormat(locale, {
        ...baseOptions,
        month: 'short',
      }).format(dateObj);
      const year = new Intl.DateTimeFormat(locale, {
        ...baseOptions,
        year: '2-digit',
      }).format(dateObj);
      return `${day} ${month} '${year}`;
    }

    case 'full':
      return new Intl.DateTimeFormat(locale, {
        ...baseOptions,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }).format(dateObj);

    case 'relative': {
      const now = new Date();
      const diff = dateObj.getTime() - now.getTime();
      const absDiff = Math.abs(diff);

      const units: Intl.RelativeTimeFormatUnit[] = [
        'year', 'month', 'week', 'day', 'hour', 'minute', 'second',
      ];
      const thresholds = {
        year: 1000 * 60 * 60 * 24 * 365,
        month: 1000 * 60 * 60 * 24 * 30,
        week: 1000 * 60 * 60 * 24 * 7,
        day: 1000 * 60 * 60 * 24,
        hour: 1000 * 60 * 60,
        minute: 1000 * 60,
        second: 1000,
      };

      for (const unit of units) {
        const threshold = thresholds[unit as keyof typeof thresholds];
        if (absDiff >= threshold || unit === 'second') {
          const value = Math.round(diff / threshold);
          return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(value, unit);
        }
      }
    }

    case 'relativeDays': {
      const now = new Date();
      const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const targetDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());

      const diffInMs = targetDate.getTime() - currentDate.getTime();
      const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

      // Use Intl.NumberFormat for consistent number formatting
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(diffInDays);
    }

    case 'timer': {
      const now = date.serverTimestamp ? new Date(date.serverTimestamp) : new Date();
      let diff = now.getTime() - dateObj.getTime();
      const isPast = diff >= 0;
      diff = Math.abs(diff);

      const hours = Math.floor(diff / (1000 * 60 * 60));
      diff -= hours * (1000 * 60 * 60);
      const minutes = Math.floor(diff / (1000 * 60));
      diff -= minutes * (1000 * 60);
      const seconds = Math.floor(diff / 1000);

      return `${isPast ? '' : '-'}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    case 'countdown': {
        const now = new Date();
        let diff = dateObj.getTime() - now.getTime();
        diff = Math.max(0, diff); // No negative countdowns
    
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        diff -= days * (1000 * 60 * 60 * 24);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        diff -= hours * (1000 * 60 * 60);
        const minutes = Math.floor(diff / (1000 * 60));
        diff -= minutes * (1000 * 60);
        const seconds = Math.floor(diff / 1000);
    
        const parts: string[] = [];
        if (date.lowestUnit === 'days' || (!date.lowestUnit && days > 0)) {
            parts.push(days.toString().padStart(2, '0'));
        }
        if (date.lowestUnit === 'hours' || (!date.lowestUnit && (parts.length > 0 || hours > 0))) {
            parts.push(hours.toString().padStart(2, '0'));
        }
        if (date.lowestUnit === 'minutes' || (!date.lowestUnit && (parts.length > 0 || minutes > 0))) {
            parts.push(minutes.toString().padStart(2, '0'));
        }
        if (date.lowestUnit === 'seconds' || (!date.lowestUnit && (parts.length > 0 || seconds > 0))) {
            parts.push(seconds.toString().padStart(2, '0'));
        }
    
        return parts.join(':');
    }

    default:
      return dateObj.toLocaleString(locale, baseOptions);
  }
}