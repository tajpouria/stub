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

  const da = lang === 'fa' ? 'روز پیش' : 'Days ago';

  const elpDays = diffTime / (1000 * 60 * 60 * 24);
  if (elpDays >= 1) return `${Math.floor(elpDays)} ${da}`;

  const ha = lang === 'fa' ? 'ساعت پیش' : 'Days ago',
    jn = lang === 'fa' ? 'لحظاتی پیش' : 'Just Now';
  const elpHours = diffTime / 3600000;
  return elpHours <= 1 ? jn : `${Math.floor(elpHours)} ${ha}`;
}
