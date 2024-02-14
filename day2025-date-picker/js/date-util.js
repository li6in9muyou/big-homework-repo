export function daysBetween(a, b) {
  const aa = a instanceof Date ? a : new Date(a);
  const bb = b instanceof Date ? b : new Date(b);

  function resetToMidnight(d) {
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);
  }

  resetToMidnight(aa);
  resetToMidnight(bb);

  return Math.abs(aa.getTime() - bb.getTime()) / (24 * 60 * 60 * 1000);
}
