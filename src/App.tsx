import { CurrentConditions } from "./components/CurrentConditions";
import { AlertBanner } from "./components/AlertBanner";
import { HourlyStrip } from "./components/HourlyStrip";
import conditions from "./fixtures/minneapolis.json";
import hourly from "./fixtures/hourly.json";
import alert from "./fixtures/alert.json";

// No ClockProvider here on purpose. In the running app the components read the
// real clock, which is exactly what you want. Pinning happens in stories only.
export function App() {
  return (
    <main
      style={{
        display: "grid",
        gap: 24,
        padding: 32,
        justifyItems: "start",
        background: "#f6f7f9",
        minHeight: "100vh",
      }}
    >
      <CurrentConditions
        data={{
          place: conditions.response[0].place,
          periods: conditions.response[0].periods,
        }}
      />
      <AlertBanner alert={alert.response[0]} />
      <HourlyStrip hours={hourly.response[0].periods} />
    </main>
  );
}
