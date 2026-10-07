import { useNow } from "../clock";

export type Hour = { dateTimeISO: string; tempF: number; pop: number };

export function HourlyStrip({ hours }: { hours: Hour[] }) {
  const now = useNow();
  const currentHour = new Date(now).setMinutes(0, 0, 0);

  return (
    <div className="wx wx-hourly">
      {hours.map((h) => {
        const t = new Date(h.dateTimeISO);
        const isNow = new Date(t).setMinutes(0, 0, 0) === currentHour;
        return (
          <div key={h.dateTimeISO} className="wx-hour" data-current={isNow}>
            <p className="wx-hour-time">{isNow ? "Now" : hourLabel(t)}</p>
            <p className="wx-hour-temp">{h.tempF}&deg;</p>
            <p className="wx-hour-pop">{h.pop >= 20 ? `${h.pop}%` : ""}</p>
          </div>
        );
      })}
    </div>
  );
}

function hourLabel(d: Date) {
  const h = d.getHours();
  if (h === 0) return "12a";
  if (h === 12) return "12p";
  return h > 12 ? `${h - 12}p` : `${h}a`;
}
