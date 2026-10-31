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

const WEEKDAY_BY_NAME: Record<string, Weekday> = {
  Monday: "monday",
  Tuesday: "tuesday",
  Wednesday: "wednesday",
  Thursday: "thursday",
  Friday: "friday",
  Saturday: "saturday",
  Sunday: "sunday",
};

export type TodayHours = {
  day: Weekday;
  hours: DayHours;
};

function minutesFromTime(value: string): number {
  const [hourText, minuteText] = value.split(":");
  return Number(hourText) * 60 + Number(minuteText);
}

/** The weekday and minutes after midnight in Africa/Lagos, whatever the server zone. */
function zonedNow(now: Date): { day: Weekday; minutes: number } {
  if (Number.isNaN(now.getTime())) {
    throw new Error("The date for the opening-hours check is not valid.");
  }

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: SITE.hours.timeZone,
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const values = new Map(parts.map((part) => [part.type, part.value]));
  const weekday = values.get("weekday");
  const hour = Number(values.get("hour"));
  const minute = Number(values.get("minute"));
  const day = weekday ? WEEKDAY_BY_NAME[weekday] : undefined;

  if (!day || !Number.isFinite(hour) || !Number.isFinite(minute)) {
    throw new Error("Could not read the current time in Africa/Lagos.");
  }

  return { day, minutes: hour * 60 + minute };
}

/** Today's row for the hours card, in Nigerian time. */
export function todayHours(now = new Date()): TodayHours {
  const { day } = zonedNow(now);
  return { day, hours: SITE.hours.days[day] };
}

/**
 * Open at the opening minute, closed at the closing minute. Sunday is closed
 * all day. Uses Africa/Lagos (UTC+1, no daylight saving).
 */
export function isOpenNow(now = new Date()): boolean {
  const { day, minutes } = zonedNow(now);
  const hours = SITE.hours.days[day];

  if (!hours) return false;

  return (
    minutes >= minutesFromTime(hours.opens) &&
    minutes < minutesFromTime(hours.closes)
  );
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
