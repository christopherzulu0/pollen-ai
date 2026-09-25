import { dateFnsLocalizer } from "react-big-calendar";
import {
  format,
  getDay,
  parse,
  startOfWeek as dfStartOfWeek,
} from "date-fns";
import type { Locale } from "date-fns";
import { enUS } from "date-fns/locale";

/** Sunday (0) for US, Canada, Japan; Monday (1) elsewhere — must match getWeekStartsOnClient. */
export function getWeekStartsOnClient(): 0 | 1 {
  const lang = navigator.language;
  return ["en-US", "en-CA", "ja", "ja-JP"].includes(lang) ? 0 : 1;
}

/** SSR / hydration snapshot: ISO Monday week so server HTML matches first paint (see useSyncExternalStore). */
export function getWeekStartsOnServerSnapshot(): 0 | 1 {
  return 1;
}

export function createCalendarLocalizer(weekStartsOn: 0 | 1) {
  return dateFnsLocalizer({
    format,
    parse,
    startOfWeek: (date: Date, options?: { locale?: Locale }) =>
      dfStartOfWeek(date, { ...options, weekStartsOn }),
    getDay,
    locales: { "en-US": enUS },
  });
}
