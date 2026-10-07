import { useNow, minutesUntil } from "../clock";

export type Alert = {
  details: { name: string; body: string; priority: number };
  timestamps: { expiresISO: string };
};

function severityOf(priority: number): "advisory" | "watch" | "warning" {
  if (priority <= 2) return "warning";
  if (priority <= 4) return "watch";
  return "advisory";
}

export function AlertBanner({ alert }: { alert: Alert }) {
  const now = useNow();
  const left = minutesUntil(alert.timestamps.expiresISO, now);
  const severity = severityOf(alert.details.priority);

  return (
    <section className="wx wx-alert" data-severity={severity} role="status">
      <h3>{titleCase(alert.details.name)}</h3>
      <p>{alert.details.body}</p>
      <p className="wx-countdown">{expiryLabel(left)}</p>
    </section>
  );
}

function expiryLabel(mins: number) {
  if (mins <= 0) return "Expired";
  if (mins < 60) return `Expires in ${mins} minutes`;
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  if (rem === 0) return `Expires in ${hrs} ${hrs === 1 ? "hour" : "hours"}`;
  return `Expires in ${hrs}h ${rem}m`;
}

function titleCase(s: string) {
  return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}
