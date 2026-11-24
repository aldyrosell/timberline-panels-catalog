import { Box, Button, Card, Flex, Select, Stack, Switch, Text } from "@sanity/ui";
import { useCallback, useMemo } from "react";
import { set, type ArrayOfObjectsInputProps } from "sanity";

const WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

type Weekday = (typeof WEEK)[number];
type Day = { open: boolean; opens: string; closes: string };
type Week = Record<Weekday, Day>;
type Spec = {
  _key: string;
  _type: "openingHoursSpec";
  days: Weekday[];
  opens: string;
  closes: string;
};

const DEFAULT_OPENS = "09:00";
const DEFAULT_CLOSES = "17:00";

const HALF_HOURS = Array.from(
  { length: 48 },
  (_, i) => `${String(Math.floor(i / 2)).padStart(2, "0")}:${i % 2 ? "30" : "00"}`,
);

function timeLabel(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  return `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`;
}

function timeOptions(current: string): string[] {
  return HALF_HOURS.includes(current) ? HALF_HOURS : [...HALF_HOURS, current].sort();
}

function toWeek(value: Partial<Spec>[] | undefined): Week {
  const week = Object.fromEntries(
    WEEK.map((day) => [day, { open: false, opens: DEFAULT_OPENS, closes: DEFAULT_CLOSES }]),
  ) as Week;

  for (const spec of value ?? []) {
    for (const day of spec.days ?? []) {
      week[day] = {
        open: true,
        opens: spec.opens ?? DEFAULT_OPENS,
        closes: spec.closes ?? DEFAULT_CLOSES,
      };
    }
  }

  return week;
}

function toSpecs(week: Week): Spec[] {
  const groups = new Map<string, Spec>();

  for (const day of WEEK) {
    const { open, opens, closes } = week[day];
    if (!open) continue;

    const signature = `${opens}-${closes}`;
    const group = groups.get(signature) ?? {
      _key: `hours-${opens.replace(":", "")}-${closes.replace(":", "")}`,
      _type: "openingHoursSpec",
      days: [],
      opens,
      closes,
    };

    group.days.push(day);
    groups.set(signature, group);
  }

  return [...groups.values()];
}

function daysLabel(days: Weekday[]): string {
  const short = (day: Weekday) => day.slice(0, 3);
  const consecutive = days.every(
    (day, i) => i === 0 || WEEK.indexOf(day) === WEEK.indexOf(days[i - 1]) + 1,
  );

  if (days.length === 1) return short(days[0]);
  if (consecutive) return `${short(days[0])} – ${short(days[days.length - 1])}`;
  return days.map(short).join(", ");
}

function summary(week: Week): string {
  const open = toSpecs(week).map(
    (spec) => `${daysLabel(spec.days)} ${timeLabel(spec.opens)} – ${timeLabel(spec.closes)}`,
  );
  const closed = WEEK.filter((day) => !week[day].open);

  if (open.length === 0) return "Closed every day";
  return [...open, ...(closed.length ? [`${daysLabel(closed)} closed`] : [])].join(" · ");
}

export function OpeningHoursInput(props: ArrayOfObjectsInputProps) {
  const { value, onChange, readOnly } = props;
  const week = useMemo(() => toWeek(value as Partial<Spec>[] | undefined), [value]);

  const commit = useCallback((next: Week) => onChange(set(toSpecs(next))), [onChange]);

  const update = useCallback(
    (day: Weekday, patch: Partial<Day>) => commit({ ...week, [day]: { ...week[day], ...patch } }),
    [commit, week],
  );

  const copyMondayToWeekdays = useCallback(() => {
    const next = { ...week };
    for (const day of ["Tuesday", "Wednesday", "Thursday", "Friday"] as const) {
      next[day] = { ...week.Monday };
    }
    commit(next);
  }, [commit, week]);

  return (
    <Stack gap={3}>
      <Card border radius={2} overflow="hidden">
        {WEEK.map((day, index) => {
          const { open, opens, closes } = week[day];
          const invalid = open && closes <= opens;

          return (
            <Card key={day} borderTop={index > 0} paddingX={3} paddingY={2}>
              <Flex align="center" gap={3} wrap="wrap" style={{ minHeight: 44 }}>
                <Box style={{ width: 96 }}>
                  <Text size={1} weight="medium">
                    {day}
                  </Text>
                </Box>

                <Flex align="center" gap={2} style={{ width: 92 }}>
                  <Switch
                    checked={open}
                    disabled={readOnly}
                    aria-label={`${day} open`}
                    onChange={(event) => update(day, { open: event.currentTarget.checked })}
                  />
                  <Text size={1} muted>
                    {open ? "Open" : "Closed"}
                  </Text>
                </Flex>

                {open ? (
                  <Flex align="center" gap={2}>
                    <Select
                      fontSize={1}
                      value={opens}
                      disabled={readOnly}
                      aria-label={`${day} opening time`}
                      onChange={(event) => update(day, { opens: event.currentTarget.value })}
                    >
                      {timeOptions(opens).map((time) => (
                        <option key={time} value={time}>
                          {timeLabel(time)}
                        </option>
                      ))}
                    </Select>
                    <Text size={1} muted>
                      to
                    </Text>
                    <Select
                      fontSize={1}
                      value={closes}
                      disabled={readOnly}
                      aria-label={`${day} closing time`}
                      onChange={(event) => update(day, { closes: event.currentTarget.value })}
                    >
                      {timeOptions(closes).map((time) => (
                        <option key={time} value={time}>
                          {timeLabel(time)}
                        </option>
                      ))}
                    </Select>
                  </Flex>
                ) : null}
              </Flex>

              {invalid ? (
                <Box paddingTop={2}>
                  <Card tone="critical" radius={2} padding={2}>
                    <Text size={1}>Closing time must be after opening time.</Text>
                  </Card>
                </Box>
              ) : null}
            </Card>
          );
        })}
      </Card>

      <Flex align="center" justify="space-between" gap={3} wrap="wrap">
        <Text size={1} muted>
          {summary(week)}
        </Text>
        <Button
          mode="ghost"
          fontSize={1}
          padding={2}
          text="Copy Monday to Tue – Fri"
          disabled={readOnly || !week.Monday.open}
          onClick={copyMondayToWeekdays}
        />
      </Flex>
    </Stack>
  );
}
