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

export function daysBetweenInclusive(a, b) {
  return daysBetween(a, b) + 1;
}

export function daysInMonth(year, monthIdxStartFromOne) {
  return new Date(parseInt(year), parseInt(monthIdxStartFromOne), 0).getDate();
}

export function weekDayOfFirstDayInMonthWeekStartFromSunday(
  year,
  monthIdxStartFromOne,
) {
  return new Date(parseInt(year), monthIdxStartFromOne - 1, 1).getDay() + 1;
}

export function weekDayOfFirstDayInMonthWeekStartFromMonday(
  year,
  monthIdxStartFromOne,
) {
  const i = new Date(parseInt(year), monthIdxStartFromOne - 1, 1).getDay();
  const isSunday = i === 0;
  if (isSunday) {
    return 7;
  } else {
    return i;
  }
}

export function getYearMonthString(year, monthIdxStartFromOne) {
  return new Date(year, monthIdxStartFromOne - 1).toLocaleDateString(
    navigator.language ?? "zh-CN",
    { year: "numeric", month: "numeric" },
  );
}

export function isOnSameDate(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
