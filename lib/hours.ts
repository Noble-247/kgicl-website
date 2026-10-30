import { SITE, WEEKDAYS, type DayHours, type Weekday } from "@/data/site";

const SHORT_DAY: Record<Weekday, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

/** "07:00" becomes "7am", "22:00" becomes "10pm". */
export function formatTime(value: string): string {
  const [hourText, minuteText = "00"] = value.split(":");
  const hour = Number(hourText);
  const suffix = hour < 12 ? "am" : "pm";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return minuteText === "00"
    ? `${displayHour}${suffix}`
    : `${displayHour}:${minuteText}${suffix}`;
}

function hoursLabel(hours: DayHours): string {
  return hours ? `${formatTime(hours.opens)} to ${formatTime(hours.closes)}` : "closed";
}

/**
 * One plain-language line built from data/site.ts, for the enquiry panel:
 * "Open Mon to Fri 7am to 10pm, Sat 7am to 8pm."
 */
export function openingHoursLine(): string {
  const groups: { start: Weekday; end: Weekday; label: string }[] = [];

  for (const day of WEEKDAYS) {
    const hours = SITE.hours.days[day];
    if (!hours) continue;

    const label = hoursLabel(hours);
    const previous = groups[groups.length - 1];

    if (previous && previous.label === label) {
      previous.end = day;
    } else {
      groups.push({ start: day, end: day, label });
    }
  }

  const parts = groups.map((group) => {
    const days =
      group.start === group.end
        ? SHORT_DAY[group.start]
        : `${SHORT_DAY[group.start]} to ${SHORT_DAY[group.end]}`;
    return `${days} ${group.label}`;
  });

  return parts.length > 0 ? `Open ${parts.join(", ")}.` : "Opening hours on request.";
}
