export function formatTime(time: UITime): string {
  const timeObj = new Date(time.timestamp);
  const locale = time.locale || 'en-US';

  const baseOptions: Intl.DateTimeFormatOptions = {
    hour12: time.hour12,
    ...(time.timeZone ? { timeZone: time.timeZone } : {}),
  };

  switch (time.format) {
    case 'plain':
      return new Intl.DateTimeFormat(locale, {
        ...baseOptions,
        hour: 'numeric',
        minute: '2-digit',
      }).format(timeObj);

    case 'range': {
      const startTime = new Intl.DateTimeFormat(locale, {
        ...baseOptions,
        hour: 'numeric',
        minute: '2-digit',
      }).format(timeObj);

      const endTime = new Intl.DateTimeFormat(locale, {
        ...baseOptions,
        hour: 'numeric',
        minute: '2-digit',
      }).format(new Date(time.endTimestamp)); 

      if (time.output === 'start') {
        return startTime;
      }

      if (time.output === 'end') {
        return endTime;
      }

      const separator = time.separator || ' - ';
      let result = `${startTime}${separator}${endTime}`;

      if (time.showDuration) {
        const durationMs = time.endTimestamp - time.timestamp;
        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
        
        const durationParts: string[] = [];
        if (hours > 0) {
          durationParts.push(`${hours}h`);
        }
        if (minutes > 0) {
          durationParts.push(`${minutes}m`);
        }
        
        if (durationParts.length > 0) {
          result += ` (${durationParts.join(' ')})`;
        }
      }

      return result;
    }

    case 'timer': {
      const now = time.serverTimestamp ? new Date(time.serverTimestamp) : new Date();
      let diff = now.getTime() - timeObj.getTime();
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
      let diff = timeObj.getTime() - now.getTime();
      diff = Math.max(0, diff); // No negative countdowns

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      diff -= days * (1000 * 60 * 60 * 24);
      const hours = Math.floor(diff / (1000 * 60 * 60));
      diff -= hours * (1000 * 60 * 60);
      const minutes = Math.floor(diff / (1000 * 60));
      diff -= minutes * (1000 * 60);
      const seconds = Math.floor(diff / 1000);

      const parts: string[] = [];
      if (time.lowestUnit === 'days' || (!time.lowestUnit && days > 0)) {
        parts.push(days.toString().padStart(2, '0'));
      }
      if (time.lowestUnit === 'hours' || (!time.lowestUnit && (parts.length > 0 || hours > 0))) {
        parts.push(hours.toString().padStart(2, '0'));
      }
      if (time.lowestUnit === 'minutes' || (!time.lowestUnit && (parts.length > 0 || minutes > 0))) {
        parts.push(minutes.toString().padStart(2, '0'));
      }
      if (time.lowestUnit === 'seconds' || (!time.lowestUnit && (parts.length > 0 || seconds > 0))) {
        parts.push(seconds.toString().padStart(2, '0'));
      }

      return parts.join(':');
    }

    default:
      return timeObj.toLocaleTimeString(locale, baseOptions);
  }
}
