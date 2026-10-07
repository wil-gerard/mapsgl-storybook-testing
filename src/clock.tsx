import { createContext, useContext, type ReactNode } from "react";

// Every component that renders a relative time reads the clock from here
// instead of calling new Date() directly. In the app this is the real clock.
// In a story it is whatever instant you pin it to.
const ClockContext = createContext<() => Date>(() => new Date());

export function ClockProvider({
  at,
  children,
}: {
  at?: Date;
  children: ReactNode;
}) {
  const read = at ? () => at : () => new Date();
  return <ClockContext.Provider value={read}>{children}</ClockContext.Provider>;
}

export function useNow(): Date {
  return useContext(ClockContext)();
}

export function relativeMinutes(from: string | number, now: Date): string {
  const then = typeof from === "number" ? from * 1000 : Date.parse(from);
  const mins = Math.round((now.getTime() - then) / 60000);
  if (mins < 1) return "just now";
  if (mins === 1) return "1 minute ago";
  if (mins < 60) return `${mins} minutes ago`;
  const hrs = Math.round(mins / 60);
  return hrs === 1 ? "1 hour ago" : `${hrs} hours ago`;
}

export function minutesUntil(iso: string, now: Date): number {
  return Math.round((Date.parse(iso) - now.getTime()) / 60000);
}
