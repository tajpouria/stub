/**
 * Retrieve elapsed time from specified timestamp in format ... days ago or ... hours ago
 * @param timestamp
 * @param lang Language format
 */
export function getUIElapsedDuration(
  timestamp: number,
  lang: 'en' | 'fa' = 'en',
) {
  const target = +new Date(timestamp);
  const now = +new Date();
  const diffTime = now - target;

  const elpDays = diffTime / (1000 * 60 * 60 * 24);

  if (elpDays >= 1) {
    return lang === 'fa'
      ? `حدودا ${Math.floor(elpDays)} روز پیش`
      : `~ ${Math.floor(elpDays)} Days ago`;
  }

  const elpHours = diffTime / 3600000;

  const jn = lang === 'fa' ? 'لحظاتی پیش' : 'Just Now';
  if (elpHours <= 1) return jn;

  return lang === 'fa'
    ? `حدودا ${Math.floor(elpHours)} ساعت پیش  `
    : `~ ${Math.floor(elpHours)} Hours ago`;
}
